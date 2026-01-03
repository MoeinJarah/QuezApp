package ir.mrmoein.quezapplication.listener;

import ir.mrmoein.quezapplication.model.dto.LoginRequest;
import ir.mrmoein.quezapplication.model.entity.Authority;
import ir.mrmoein.quezapplication.model.entity.Role;
import ir.mrmoein.quezapplication.model.entity.RoleName;
import ir.mrmoein.quezapplication.model.entity.User;
import ir.mrmoein.quezapplication.repository.jpa.RoleRepository;
import ir.mrmoein.quezapplication.repository.jpa.TeacherRepository;
import ir.mrmoein.quezapplication.repository.jpa.UserRepository;
import ir.mrmoein.quezapplication.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;


@Component
public class CommandListener implements CommandLineRunner {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final UserService service;
    private final RoleRepository roleRepository;
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    @Autowired
    public CommandListener(UserService service, RoleRepository roleRepository, UserRepository repository, TeacherRepository teacherRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, UserService userService) {
        this.service = service;
        this.roleRepository = roleRepository;
        this.repository = repository;
        this.teacherRepository = teacherRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }


    @Override
    public void run(String... args) throws Exception {


        Authority privilege1 = Authority.builder()
                .name("PRIVILEGE_WRITE")
                .build();

        Authority privilege2 = Authority.builder()
                .name("PRIVILEGE_READ")
                .build();

        Role admin = Role.builder()
                .name(RoleName.ROLE_ADMIN.name())
                .authorities(new HashSet<>())
                .build();
        admin.getAuthorities().add(privilege1);
        admin.getAuthorities().add(privilege2);

        Role teacher = Role.builder()
                .name(RoleName.ROLE_TEACHER.name())
                .build();

        Role student = Role.builder()
                .name(RoleName.ROLE_STUDENT.name())
                .build();


        HashSet<Role> adminRole = new HashSet<>();
        adminRole.add(admin);

        HashSet<Role> teacherRole = new HashSet<>();
        teacherRole.add(teacher);

        HashSet<Role> studentRole = new HashSet<>();
        studentRole.add(student);

        Set<Role> takesRole = new HashSet<>();
        takesRole.add(admin);

        Optional<User> admin1 = repository.findByUsername("admin");
        if (admin1.isEmpty()) {
            roleRepository.save(admin);
            roleRepository.save(teacher);
            roleRepository.save(student);
            User admins = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin"))
                    .roles(takesRole)
                    .enable(Boolean.TRUE)
                    .build();
            userRepository.save(admins);
        }
        userService.login(LoginRequest.builder().username("admin").password("admin").build());
    }
}

