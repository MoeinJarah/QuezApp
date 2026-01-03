//package ir.mrmoein.quezapplication.security.jwt;
//
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.security.web.AuthenticationEntryPoint;
//import org.springframework.stereotype.Component;
//
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import java.io.IOException;
//
//@Component
//public class AuthEntryPointJwt implements AuthenticationEntryPoint {
//    @Override
//    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
//            throws IOException {
////        response.sendRedirect("/index");
////        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
////        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
////
////        final Map<String, Object> body = new HashMap<>();
////        body.put("status", HttpServletResponse.SC_UNAUTHORIZED);
////        body.put("error", "Unauthorized");
////        body.put("message", authException.getMessage());
////        body.put("path", request.getServletPath());
////
////        final ObjectMapper mapper = new ObjectMapper();
////        mapper.writeValue(response.getOutputStream(), body);
//    }
//}
