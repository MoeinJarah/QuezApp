package ir.mrmoein.quezapplication.service;

import org.springframework.stereotype.Service;

@Service
public interface ScheduledTasks {

    void processOutboxEvents();

    void checkExpireExam();

    void checkExpireRefreshToken();

}
