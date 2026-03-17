package lk.ijes.backend.controller;

import lk.ijes.backend.dto.SeatBookingDTO;
import lk.ijes.backend.entity.Seat;
import lk.ijes.backend.service.SeatService;
import lk.ijes.backend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/seats")
@CrossOrigin
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    // Get all seats for a specific flight
    @GetMapping("/flight/{flightId}")
    public ResponseEntity<APIResponse> getSeatsByFlight(@PathVariable Long flightId) {
        List<Seat> seats = seatService.getSeatsByFlight(flightId);
        return ResponseEntity.ok(new APIResponse(200, "Success", seats));
    }

    // Optional: If you want a "get all seats" endpoint for testing
    @GetMapping("/all")
    public ResponseEntity<APIResponse> getAllSeats() {
        List<Seat> seats = seatService.getAllSeats(); // Make sure seatService has this method
        return ResponseEntity.ok(new APIResponse(200, "Success", seats));
    }

    // Book a seat
    @PostMapping("/book")
    public ResponseEntity<APIResponse> bookSeat(@RequestBody SeatBookingDTO bookingDTO) {

        if (bookingDTO.getFlightId() == null || bookingDTO.getSeatId() == null) {
            return ResponseEntity.status(400)
                    .body(new APIResponse(400, "flightId and seatId are required", null));
        }

        boolean success = seatService.bookSeat(
                bookingDTO.getFlightId(),
                bookingDTO.getSeatId()
        );

        if (success) {
            return ResponseEntity.ok(new APIResponse(200, "Seat booked successfully", null));
        }

        return ResponseEntity.status(400)
                .body(new APIResponse(400, "Seat already booked", null));
    }
}