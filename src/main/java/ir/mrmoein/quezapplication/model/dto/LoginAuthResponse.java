package ir.mrmoein.quezapplication.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@SuperBuilder
public class LoginAuthResponse {

    private String message;

    private String token;

    private Boolean success;

}
