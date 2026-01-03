package ir.mrmoein.quezapplication.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class LoginRequest {

    @Size(min = 3 , message = "username length must be more than 3 characters !!!")
    private String username;

    @Size(min = 4 , max = 10 , message = "password length must be among 4 and 10 !!!")
    private String password;

}
