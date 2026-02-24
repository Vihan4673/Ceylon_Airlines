package lk.ijes.backend.controller;

import lombok.RequiredArgsConstructor;
import lk.ijes.backend.entity.BaggageClaim;
import lk.ijes.backend.service.BaggageClaimService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/claims")
@RequiredArgsConstructor
@CrossOrigin
public class BaggageClaimController {

    private final BaggageClaimService service;

    @PostMapping("/save")
    public ResponseEntity<?> saveClaim(
            @RequestParam String baggageTagId,
            @RequestParam String issueType,
            @RequestParam String description,
            @RequestParam MultipartFile image
    ) throws IOException {

        return ResponseEntity.ok(
                service.saveClaim(baggageTagId, issueType, description, image)
        );
    }

    @GetMapping("/all")
    public List<BaggageClaim> getAllClaims() {
        return service.getAllClaims();
    }
}