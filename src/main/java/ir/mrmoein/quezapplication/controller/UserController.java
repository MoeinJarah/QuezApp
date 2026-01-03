package ir.mrmoein.quezapplication.controller;


import ir.mrmoein.quezapplication.model.dto.LoginRequest;
import ir.mrmoein.quezapplication.model.dto.ResponseAuth;
import ir.mrmoein.quezapplication.model.dto.StudentRegisterRequest;
import ir.mrmoein.quezapplication.model.dto.TeacherRegisterRequest;
import ir.mrmoein.quezapplication.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.servlet.ModelAndView;

import javax.naming.AuthenticationException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/start")
public class UserController {

    private final UserService service;
    private final UserService userService;

    @Autowired
    public UserController(UserService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @GetMapping("/login")
    public ModelAndView showLoginForm() {
        return new ModelAndView("login");
    }

    @GetMapping("/signup")
    public ModelAndView signup() {
        return new ModelAndView("role_selection");
    }

    @GetMapping("/teacher-signup")
    public ModelAndView teacher() {
        return new ModelAndView("signup_teacher");
    }

    @GetMapping("/student-signup")
    public ModelAndView student() {
        return new ModelAndView("signup_student");
    }

    //this methods for Basic Auth
//    @PostMapping(value = "/student", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public String student(@ModelAttribute StudentRegisterRequest registerRequest , Model model) {
//        if (service.registerStudent(registerRequest)) {
//            model.addAttribute("info" , true);
//            return "redirect:/login";
//        } else {
//            model.addAttribute("error" , true);
//            return "signup_student";
//        }
//    }
//
//    @PostMapping(value = "/teacher", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public String teacher(@ModelAttribute TeacherRegisterRequest registerRequest , RedirectAttributes redirectAttributes) {
//        if (service.registerTeacher(registerRequest)) {
//            redirectAttributes.addAttribute("info" , true);
//            return "redirect:/login";
//        } else {
//            redirectAttributes.addAttribute("error" , true);
//            return "redirect:/signup";
//        }
//    }

    //this methods for jwtAuth
    @PostMapping(value = "/student" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseAuth> registerStudent(@ModelAttribute StudentRegisterRequest studentRegisterRequest){
        ResponseAuth responseAuth = service.registerStudent(studentRegisterRequest);
        return ResponseEntity.ok(responseAuth);
    }

    @PostMapping(value = "/teacher" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseAuth> registerTeacher(@ModelAttribute TeacherRegisterRequest teacherRegisterRequest){
        ResponseAuth responseAuth = service.registerTeacher(teacherRegisterRequest);
        return ResponseEntity.ok(responseAuth);
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<Map<String, String>> login(@Valid @ModelAttribute LoginRequest loginRequest) {
        return ResponseEntity.ok(userService.login(loginRequest));
    }


}
