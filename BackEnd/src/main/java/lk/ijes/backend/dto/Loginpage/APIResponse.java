package lk.ijes.backend.dto.Loginpage;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class APIResponse {
    private int code;
    private String message;
    private Object data;
}