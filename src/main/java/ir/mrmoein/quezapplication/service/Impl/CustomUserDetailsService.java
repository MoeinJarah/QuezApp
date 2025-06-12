package ir.mrmoein.quezapplication.service.Impl;

import ir.mrmoein.quezapplication.controller.admin.AdminController;
import ir.mrmoein.quezapplication.exception.NotEnableUserException;
import ir.mrmoein.quezapplication.model.entity.Role;
import ir.mrmoein.quezapplication.model.entity.User;
import ir.mrmoein.quezapplication.repository.elastic.SearchStudent;
import ir.mrmoein.quezapplication.repository.elastic.SearchTeacher;
import ir.mrmoein.quezapplication.repository.jpa.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository repository;

    private final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    public CustomUserDetailsService(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
        User user = repository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("this user not found : " + username));

        if (user.getEnable()){
            List<GrantedAuthority> grantedAuthorities = new LinkedList<>();

            for (Role role : user.getRoles()) {
                grantedAuthorities.add(new SimpleGrantedAuthority(role.getName()));
            }

            return new org.springframework.security.core.userdetails.User(
                    user.getUsername(),
                    user.getPassword(),
                    grantedAuthorities
            );
        }else {
            logger.info("User {} you want to log in but you haven't activated the account yet" , user.getUsername());
            throw new NotEnableUserException("this account not enable !!!");
        }
    }

}
