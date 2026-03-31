package lk.ijes.backend.controller;

import lk.ijes.backend.dto.DestinationDTO;
import lk.ijes.backend.service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/v1/flights")
@CrossOrigin
public class DestinationController {

    private final DestinationService destinationService;

    @Autowired
    public DestinationController(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    // ================= GET ALL =================
    @GetMapping("/destinations")
    public ResponseEntity<List<DestinationDTO>> getAllDestinations() {
        try {
            List<DestinationDTO> destinations = destinationService.getAllDestinations();
            return ResponseEntity.ok(destinations);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch destinations");
        }
    }

    // ================= GET BY ID =================
    @GetMapping("/destination/{id}")
    public ResponseEntity<DestinationDTO> getDestination(@PathVariable Long id) {
        try {
            DestinationDTO destinationDTO = destinationService.getDestinationById(id);
            return ResponseEntity.ok(destinationDTO);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Destination not found");
        }
    }

    // ================= CREATE =================
    @PostMapping("/destination")
    public ResponseEntity<DestinationDTO> addDestination(@RequestBody DestinationDTO dto) {
        try {
            DestinationDTO saved = destinationService.createDestination(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to create destination");
        }
    }

    // ================= UPDATE =================
    @PutMapping("/destination/{id}")
    public ResponseEntity<DestinationDTO> updateDestination(
            @PathVariable Long id,
            @RequestBody DestinationDTO dto) {

        try {
            DestinationDTO updated = destinationService.updateDestination(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to update destination");
        }
    }

    // ================= DELETE =================
    @DeleteMapping("/destination/{id}")
    public ResponseEntity<Void> deleteDestination(@PathVariable Long id) {
        try {
            destinationService.deleteDestination(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Failed to delete destination");
        }
    }
}