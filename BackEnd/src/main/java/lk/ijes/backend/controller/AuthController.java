package lk.ijes.backend.controller;

import lk.ijes.backend.dto.Loginpage.APIResponse;
import lk.ijes.backend.dto.Loginpage.AuthDTO;
import lk.ijes.backend.dto.Loginpage.RegisterDTO;
import lk.ijes.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:63342"}) // ✅ IntelliJ port ekath add kala
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ================= SIGNUP =================
    @PostMapping("/signup")
    public ResponseEntity<APIResponse> registerUser(@RequestBody RegisterDTO registerDTO) {
        try {
            String result = authService.register(registerDTO);
            return ResponseEntity.ok(new APIResponse(200, "User Registered Successfully", result));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(new APIResponse(400, e.getMessage(), null));
        }
    }

    // ================= SIGNIN =================
    @PostMapping("/signin")
    public ResponseEntity<APIResponse> loginUser(@RequestBody AuthDTO authDTO) {
        try {
            return ResponseEntity.ok(
                    new APIResponse(200, "Login Successful", authService.authenticate(authDTO))
            );
        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body(new APIResponse(401, e.getMessage(), null));
        }
    }

    // ================= GOOGLE LOGIN (MANUAL TOKEN VERIFY) =================
    // Me method eka use venne frontend ekath ekka manual token verify karanawanam vitharai.
    @PostMapping("/google")
    public ResponseEntity<APIResponse> googleLogin(@RequestBody Map<String, String> body) {
        String idToken = body.get("token");

        if (idToken == null || idToken.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new APIResponse(400, "Google token is missing", null));
        }

        try {
            // AuthService eke verifyGoogleIdToken method eka update karala thiyenna one
            String email = authService.verifyGoogleIdToken(idToken);

            // Userwa handle karala token eka gannawa
            // Api kalin handleGoogleUser method eka wenas kala email saha name ganna.
            // Name eka manual eken enne nathi nisa null damma.
            String jwtToken = authService.handleGoogleUser(email, null);

            return ResponseEntity.ok(new APIResponse(200, "Google Login Successful", Map.of("token", jwtToken)));

        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body(new APIResponse(401, "Google Login Failed: " + e.getMessage(), null));
        }
    }
}