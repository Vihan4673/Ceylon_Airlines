package lk.ijes.backend.controller;

import lk.ijes.backend.dto.AdDTO;
import lk.ijes.backend.service.AdService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ads")
@RequiredArgsConstructor
@CrossOrigin
public class AdController {

    private final AdService adService;

    @PostMapping
    public AdDTO createAd(@RequestBody AdDTO adDTO) {
        return adService.createAd(adDTO);
    }

    @GetMapping
    public List<AdDTO> getAllAds() {
        return adService.getAllAds();
    }

    @GetMapping("/active")
    public List<AdDTO> getActiveAds() {
        return adService.getActiveAds();
    }

    @DeleteMapping("/{id}")
    public void deleteAd(@PathVariable Long id) {
        adService.deleteAd(id);
    }
}