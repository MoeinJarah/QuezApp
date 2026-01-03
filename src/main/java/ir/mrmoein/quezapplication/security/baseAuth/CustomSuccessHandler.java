//package ir.mrmoein.quezapplication.security.baseAuth;
//
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.web.DefaultRedirectStrategy;
//import org.springframework.security.web.RedirectStrategy;
//import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
//import org.springframework.stereotype.Component;
//
//
//import java.io.IOException;
//import java.util.Collection;
//
//@Component
//public class CustomSuccessHandler implements AuthenticationSuccessHandler {
//
//    private final RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
//    private final Logger logger = LoggerFactory.getLogger(CustomSuccessHandler.class);
//
//
//    @Override
//    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
//        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
//
//        String def = "/start";
//
//        label:
//        for (GrantedAuthority authority : authorities) {
//            String role = authority.getAuthority();
//
//            switch (role) {
//                case "ROLE_ADMIN":
//                    def = "/admin";
//                    break label;
//                case "ROLE_TEACHER":
//                    def = "/teacher";
//                    break label;
//                case "ROLE_STUDENT":
//                    def = "/student";
//                    break label;
//            }
//        }
//        logger.info("redirect {}" , def);
//        redirectStrategy.sendRedirect(request, response, def);
//    }
//}
