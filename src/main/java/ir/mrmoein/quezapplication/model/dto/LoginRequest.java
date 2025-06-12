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

    @NotBlank
    @Size(min = 5 , message = "username length must be more than 5 characters !!!")
    private String username;

    @NotBlank
    @Size(min = 4 , max = 10 , message = "password length must be among 4 and 10 !!!")
    private String password;

}
