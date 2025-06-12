package ir.mrmoein.quezapplication.scheduling;

import ir.mrmoein.quezapplication.controller.admin.AdminController;
import ir.mrmoein.quezapplication.model.entity.*;
import ir.mrmoein.quezapplication.repository.elastic.SearchStudent;
import ir.mrmoein.quezapplication.repository.elastic.SearchTeacher;
import ir.mrmoein.quezapplication.repository.jpa.ExamRepository;
import ir.mrmoein.quezapplication.repository.jpa.OutBoxRepository;
import ir.mrmoein.quezapplication.repository.jpa.RefreshTokenRepository;
import ir.mrmoein.quezapplication.service.ScheduledTasks;
import ir.mrmoein.quezapplication.util.DTOService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ScheduledTasksImpl implements ScheduledTasks {

    private final OutBoxRepository repository;
    private final SearchTeacher searchTeacher;
    private final SearchStudent searchStudent;
    private final RefreshTokenRepository refreshTokenRepository;
    private final DTOService dtoService;
    private final Logger logger = LoggerFactory.getLogger(AdminController.class);
    private final ExamRepository examRepository;

    public ScheduledTasksImpl(OutBoxRepository repository, SearchTeacher searchTeacher, SearchStudent searchStudent, RefreshTokenRepository refreshTokenRepository, DTOService dtoService, ExamRepository examRepository) {
        this.repository = repository;
        this.searchTeacher = searchTeacher;
        this.searchStudent = searchStudent;
        this.refreshTokenRepository = refreshTokenRepository;
        this.dtoService = dtoService;
        this.examRepository = examRepository;
    }

    @Override
    @Scheduled(fixedRate = 5000)
    @Transactional(rollbackOn = Exception.class)
    public void processOutboxEvents() {
        try {
            List<OutboxEvent> all = repository.findAll();
            List<OutboxEvent> teachers = all.stream().filter((e) -> "ROLE_TEACHER".equals(e.getRole())).toList();
            List<OutboxEvent> students = all.stream().filter((e) -> "ROLE_STUDENT".equals(e.getRole())).toList();
            for (OutboxEvent teacher : teachers) {
                searchTeacher.save(dtoService.getTeacherDoc(teacher));
            }
            for (OutboxEvent student : students) {
                searchStudent.save(dtoService.getStudentDoc(student));
            }
            repository.deleteAll();
            logger.info("insert data in elasticSearch. ");
        } catch (Exception e) {
            System.err.println("Failed save elastic: " + e.getMessage());
        }

    }

    @Override
    @Scheduled(fixedRate = 50000)
    @Transactional(rollbackOn = Exception.class)
    public void checkExpireExam() {
        List<Exam> exams = examRepository.findAll();
        LocalDateTime now = LocalDateTime.now();
        exams.forEach((exam) -> {
            if (now.isAfter(exam.getEndDate())){
                exam.setState(CurrentExam.FINISHED);
                exam.setVisit(Visit.SEEN);
            }
            examRepository.save(exam);
        });
        logger.info("check expire exam. ");
    }

    @Override
    @Scheduled(fixedRate = 1000 * 60 * 60 * 24)
    @Transactional(rollbackOn = Exception.class)
    public void checkExpireRefreshToken() {
        List<JwtRefreshToken> allByRevoked = refreshTokenRepository.findAllByRevoked(true);
        if (!allByRevoked.isEmpty()){
            refreshTokenRepository.deleteAll(allByRevoked);
        }
    }
}
