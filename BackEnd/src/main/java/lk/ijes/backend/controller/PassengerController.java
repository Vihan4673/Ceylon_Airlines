package lk.ijes.backend.controller;

import jakarta.validation.Valid;
import lk.ijes.backend.dto.PassengerDTO;
import lk.ijes.backend.service.PassengerService;
import lk.ijes.backend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/passengers")
public class PassengerController {

    private final PassengerService passengerService;

    @PostMapping("/savePassenger")
    public ResponseEntity<APIResponse<String>> savePassenger(
            @RequestBody PassengerDTO passengerDTO) {
        passengerService.savePassenger(passengerDTO);
        return new ResponseEntity<>(
                new APIResponse<>(201, "Passenger saved successfully", null),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/updatePassenger")
    public ResponseEntity<APIResponse<String>> updatePassenger(
            @Valid @RequestBody PassengerDTO passengerDTO) {
        passengerService.updatePassenger(passengerDTO);
        return new ResponseEntity<>(
                new APIResponse<>(200, "Passenger updated successfully", null),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/deletePassenger/{id}")
    public ResponseEntity<APIResponse<String>> deletePassenger(@PathVariable Long id) {
        passengerService.deletePassenger(id);
        return new ResponseEntity<>(
                new APIResponse<>(200, "Passenger deleted successfully", null),
                HttpStatus.OK
        );
    }

    @GetMapping("/getAllPassengers")
    public ResponseEntity<APIResponse<List<PassengerDTO>>> getAllPassengers() {
        List<PassengerDTO> passengers = passengerService.getAllPassengers();
        return new ResponseEntity<>(
                new APIResponse<>(200, "Passengers retrieved successfully", passengers),
                HttpStatus.OK
        );
    }

    @GetMapping("/searchPassenger/{id}")
    public ResponseEntity<APIResponse<PassengerDTO>> searchPassenger(@PathVariable Long id) {
        PassengerDTO passengerDTO = passengerService.searchPassengerByID(id);
        return new ResponseEntity<>(
                new APIResponse<>(200, "Passenger retrieved successfully", passengerDTO),
                HttpStatus.OK
        );
    }
}