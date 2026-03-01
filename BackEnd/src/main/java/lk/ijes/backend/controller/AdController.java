package lk.ijes.backend.controller;

import lk.ijes.backend.dto.AdDTO;
import lk.ijes.backend.service.AdService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/ads")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:63342") // Frontend origin
public class AdController {

    private final AdService adService;

    // ✅ Upload Ad with image
    @PostMapping("/upload")
    public ResponseEntity<AdDTO> uploadAd(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("placement") String placement,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate
    ) throws IOException {
        AdDTO adDTO = adService.saveAdWithImage(file, title, description, placement, startDate, endDate);
        return new ResponseEntity<>(adDTO, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AdDTO>> getAllAds() {
        return new ResponseEntity<>(adService.getAllAds(), HttpStatus.OK);
    }

    @GetMapping("/active")
    public ResponseEntity<List<AdDTO>> getActiveAds() {
        return new ResponseEntity<>(adService.getActiveAds(), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAd(@PathVariable Long id) {
        adService.deleteAd(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}