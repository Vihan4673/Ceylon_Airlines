package lk.ijes.backend.controller;

import jakarta.validation.Valid;
import lk.ijes.backend.dto.FareDTO;
import lk.ijes.backend.service.FareService;
import lk.ijes.backend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * FareController handles CRUD operations for class-specific fares (Economy, Business, etc.)
 */
@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/api/v1/fares")
public class FareController {

    private final FareService fareService;

    // ================= CREATE FARE =================
    @PostMapping
    public ResponseEntity<APIResponse<FareDTO>> createFare(
            @Valid @RequestBody FareDTO fareDTO) {

        FareDTO savedFare = fareService.createFare(fareDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new APIResponse<>(201, "Fare created successfully", savedFare));
    }

    // ================= UPDATE FARE =================
    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<FareDTO>> updateFare(
            @PathVariable Long id,
            @Valid @RequestBody FareDTO fareDTO) {

        fareDTO.setId(id); // Ensure the correct ID is set for update
        FareDTO updatedFare = fareService.updateFare(fareDTO);

        return ResponseEntity.ok(
                new APIResponse<>(200, "Fare updated successfully", updatedFare)
        );
    }

    // ================= DELETE FARE =================
    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<String>> deleteFare(@PathVariable Long id) {
        fareService.deleteFare(id);
        return ResponseEntity.ok(
                new APIResponse<>(200, "Fare deleted successfully", null)
        );
    }

    // ================= GET ALL FARES =================
    @GetMapping
    public ResponseEntity<APIResponse<List<FareDTO>>> getAllFares() {
        List<FareDTO> fareList = fareService.getAllFares();
        return ResponseEntity.ok(
                new APIResponse<>(200, "Fares retrieved successfully", fareList)
        );
    }

    // ================= GET FARES BY FLIGHT ID =================
    @GetMapping("/flight/{flightId}")
    public ResponseEntity<APIResponse<List<FareDTO>>> getFaresByFlight(
            @PathVariable Long flightId) {

        List<FareDTO> fares = fareService.getFaresByFlight(flightId);
        return ResponseEntity.ok(
                new APIResponse<>(200, "Fares retrieved successfully", fares)
        );
    }

    // ================= GET FARE BY ID =================
    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<FareDTO>> getFareById(@PathVariable Long id) {
        FareDTO fareDTO = fareService.getFareById(id);
        return ResponseEntity.ok(
                new APIResponse<>(200, "Fare retrieved successfully", fareDTO)
        );
    }
}