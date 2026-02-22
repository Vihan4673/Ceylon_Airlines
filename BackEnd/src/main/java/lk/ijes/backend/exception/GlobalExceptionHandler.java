package lk.ijes.backend.exception;

import lk.ijes.backend.util.APIResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<APIResponse<String>> handleRuntimeException(RuntimeException ex) {

        return new ResponseEntity<>(
                new APIResponse<>(400, ex.getMessage(), null),
                HttpStatus.BAD_REQUEST
        );
    }
}