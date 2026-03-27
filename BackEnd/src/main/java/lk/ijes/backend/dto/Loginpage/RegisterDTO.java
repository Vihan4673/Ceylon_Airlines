package lk.ijes.backend.dto.Loginpage;

import lombok.Data;

@Data
public class RegisterDTO {
    private String username;
    private String email;
    private String password;
    private String role = "USER";
}