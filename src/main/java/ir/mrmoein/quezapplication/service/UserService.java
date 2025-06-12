package ir.mrmoein.quezapplication.service;


import ir.mrmoein.quezapplication.model.dto.*;

import java.util.List;

public interface UserService {

    ResponseAuth registerTeacher(TeacherRegisterRequest requestDTO);

    ResponseAuth registerStudent(StudentRegisterRequest requestDTO);

    String login(LoginRequest requestDTO);

    void changeState(StatusDTO dto);

    List<StatusDTO> getAllStatus();

    List<StatusDTO> liveSearchWithFullName(String value);

    ProfileDTO getProfileUser(String nationalCode);

    List<RequestSelectedUserDTO> searchSelected(String value);

    List<StatusDTO> filter();


}
