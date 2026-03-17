//package lk.ijes.backend.controller;
//
//import lk.ijes.backend.dto.Loginpage.APIResponse;
//import lk.ijes.backend.dto.Loginpage.AuthDTO;
//import lk.ijes.backend.dto.Loginpage.RegisterDTO;
//import lk.ijes.backend.service.AuthService;
//import lombok.RequiredArgsConstructor;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("api/v1/auth")
//@CrossOrigin
//@RequiredArgsConstructor
//public class AuthController {
//    private final AuthService authService;
//    @PostMapping("signup")
//    public ResponseEntity<APIResponse> registerUser(@RequestBody RegisterDTO registerDTO) {
//        return ResponseEntity.ok(new APIResponse
//                (200,"OK",authService.register(registerDTO)));
//    }
//    @PostMapping("signin")
//    public ResponseEntity<APIResponse> loginUser(@RequestBody AuthDTO authDTO) {
//        return ResponseEntity.ok(new APIResponse(
//                200,"OK",authService.authenticate(authDTO)
//        ));
//    }
//
//}