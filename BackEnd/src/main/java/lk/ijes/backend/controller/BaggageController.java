package lk.ijes.backend.controller;

import lk.ijes.backend.dto.BaggageDTO;
import lk.ijes.backend.service.BaggageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/baggages")
@RequiredArgsConstructor
@CrossOrigin
public class BaggageController {

    private final BaggageService service;

    @PostMapping("/save")
    public BaggageDTO saveBaggage(@RequestBody BaggageDTO dto) {
        return service.saveBaggage(dto);
    }

    @GetMapping("/all")
    public List<BaggageDTO> getAllBaggages() {
        return service.getAllBaggages();
    }

    @PatchMapping("/status/{id}")
    public BaggageDTO updateStatus(@PathVariable Long id, @RequestParam String status) {
        return service.updateStatus(id, status);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteBaggage(@PathVariable Long id) {
        service.deleteBaggage(id);
    }
}