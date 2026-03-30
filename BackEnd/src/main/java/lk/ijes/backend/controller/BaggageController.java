package lk.ijes.backend.controller;

import lk.ijes.backend.dto.BaggageDTO;
import lk.ijes.backend.service.BaggageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/baggages")
@RequiredArgsConstructor
@CrossOrigin
public class BaggageController {

    private final BaggageService service;

    @PostMapping("/save")
    public ResponseEntity<List<BaggageDTO>> saveBaggage(@RequestBody BaggageDTO dto) {
        List<BaggageDTO> savedBags = service.saveBaggage(dto);
        return ResponseEntity.ok(savedBags);
    }

    @GetMapping("/all")
    public ResponseEntity<List<BaggageDTO>> getAllBaggages() {
        return ResponseEntity.ok(service.getAllBaggages());
    }

    @PatchMapping("/status/{id}")
    public ResponseEntity<BaggageDTO> updateStatus(@PathVariable Long id, @RequestParam String status) {
        BaggageDTO updated = service.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBaggage(@PathVariable Long id) {
        service.deleteBaggage(id);
        return ResponseEntity.noContent().build();
    }
}