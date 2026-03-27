package lk.ijes.backend.controller;

import jakarta.validation.Valid;
import lk.ijes.backend.dto.FlightDTO;
import lk.ijes.backend.service.FlightService;
import lk.ijes.backend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("api/v1/flights")
public class FlightController {

    private final FlightService flightService;

    // Save Flight
    @PostMapping("/saveFlight")
    public ResponseEntity<APIResponse<String>> saveFlight(
            @Valid @RequestBody FlightDTO flightDTO) {

        flightService.saveFlight(flightDTO);

        return new ResponseEntity<>(
                new APIResponse<>(201, "Flight saved successfully", null),
                HttpStatus.CREATED
        );
    }

    // Update Flight
    @PutMapping("/updateFlight")
    public ResponseEntity<APIResponse<String>> updateFlight(
            @Valid @RequestBody FlightDTO flightDTO) {

        flightService.updateFlight(flightDTO);

        return new ResponseEntity<>(
                new APIResponse<>(200, "Flight updated successfully", null),
                HttpStatus.OK
        );
    }

    // Delete Flight
    @DeleteMapping("/deleteFlight/{id}")
    public ResponseEntity<APIResponse<String>> deleteFlight(
            @PathVariable Long id) {

        flightService.deleteFlight(id);

        return new ResponseEntity<>(
                new APIResponse<>(200, "Flight deleted successfully", null),
                HttpStatus.OK
        );
    }

    // Get All Flights
    @GetMapping("/getAllFlight")
    public ResponseEntity<APIResponse<List<FlightDTO>>> getAllFlight() {

        List<FlightDTO> flightList = flightService.getAllFlight();

        return new ResponseEntity<>(
                new APIResponse<>(200, "Flights retrieved successfully", flightList),
                HttpStatus.OK
        );
    }

    // Search Flight By ID
    @GetMapping("/searchFlight/{id}")
    public ResponseEntity<APIResponse<FlightDTO>> searchFlight(
            @PathVariable Long id) {

        FlightDTO flightDTO = flightService.searchFlightByID(id);

        return new ResponseEntity<>(
                new APIResponse<>(200, "Flight retrieved successfully", flightDTO),
                HttpStatus.OK
        );
    }
}