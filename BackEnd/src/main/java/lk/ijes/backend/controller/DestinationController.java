package lk.ijes.backend.controller;

import lk.ijes.backend.dto.DestinationDTO;
import lk.ijes.backend.service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/v1/flights")
public class DestinationController {

    private final DestinationService destinationService;

    @Autowired
    public DestinationController(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    // ================= GET ALL DESTINATIONS =================
    @GetMapping("/destinations")
    public ResponseEntity<List<DestinationDTO>> getAllDestinations() {
        try {
            List<DestinationDTO> destinations = destinationService.getAllDestinations();
            return ResponseEntity.ok(destinations);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    // ================= GET DESTINATION BY FLIGHT ID =================
    @GetMapping("/destination/{flightId}")
    public ResponseEntity<DestinationDTO> getDestination(@PathVariable Long flightId) {
        try {
            DestinationDTO destinationDTO = destinationService.getDestinationById(flightId);
            return ResponseEntity.ok(destinationDTO);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    // ================= ADD NEW DESTINATION =================
    @PostMapping("/destination")
    public ResponseEntity<DestinationDTO> addDestination(@RequestBody DestinationDTO dto) {
        try {
            DestinationDTO saved = destinationService.createDestination(dto);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}