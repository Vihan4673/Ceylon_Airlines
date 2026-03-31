package lk.ijes.backend.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import jakarta.transaction.Transactional;
import lk.ijes.backend.dto.Loginpage.AuthDTO;
import lk.ijes.backend.dto.Loginpage.AuthResponseDTO;
import lk.ijes.backend.dto.Loginpage.RegisterDTO;
import lk.ijes.backend.entity.LoginPage.Role;
import lk.ijes.backend.entity.LoginPage.User;
import lk.ijes.backend.repository.UserRepository;
import lk.ijes.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;


    public AuthResponseDTO authenticate(AuthDTO authDTO) {
        User user = userRepository.findByEmail(authDTO.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + authDTO.getEmail()));

        if (user.getPassword() == null) {
            throw new BadCredentialsException("This account uses Google login. Please login with Google.");
        }

        if (!passwordEncoder.matches(authDTO.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponseDTO(token, user.getRole().name());
    }

    public String register(RegisterDTO registerDTO) {
        if (userRepository.findByEmail(registerDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        Role role;
        try {
            role = (registerDTO.getRole() != null)
                    ? Role.valueOf(registerDTO.getRole().toUpperCase())
                    : Role.USER;
        } catch (IllegalArgumentException e) {
            role = Role.USER;
        }

        User user = User.builder()
                .username(registerDTO.getUsername())
                .email(registerDTO.getEmail())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);
        return "User registered successfully";
    }

    public String handleGoogleUser(String email, String name) {
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    // Aluth user kenek save karaddi name eka username widiyata gannawa
                    User newUser = User.builder()
                            .username(name != null ? name : email.split("@")[0])
                            .email(email)
                            .password(null) // OAuth userslata password na
                            .role(Role.USER)
                            .build();
                    return userRepository.save(newUser);
                });

        return jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    }

    public String verifyGoogleIdToken(String idToken) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                    .build();

            GoogleIdToken token = verifier.verify(idToken);
            if (token != null) {
                GoogleIdToken.Payload payload = token.getPayload();
                return payload.getEmail();
            } else {
                throw new BadCredentialsException("Invalid Google ID Token");
            }
        } catch (Exception e) {
            throw new BadCredentialsException("Google Token Verification Failed: " + e.getMessage());
        }
    }
}