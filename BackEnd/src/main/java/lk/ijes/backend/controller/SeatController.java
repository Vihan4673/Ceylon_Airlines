package lk.ijes.backend.controller;

import jakarta.validation.Valid;
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


    @GetMapping("/flight-number/{flightNumber}")
    public ResponseEntity<APIResponse> getSeatsByFlightNumber(@PathVariable String flightNumber) {

        List<Seat> seats = seatService.getSeatsByFlightNumber(flightNumber);

        return ResponseEntity.ok(
                new APIResponse(200, "Success", seats)
        );
    }

    @GetMapping("/all")
    public ResponseEntity<APIResponse> getAllSeats() {

        List<Seat> seats = seatService.getAllSeats();

        return ResponseEntity.ok(
                new APIResponse(200, "Success", seats)
        );
    }

    @PostMapping("/book")
    public ResponseEntity<APIResponse> bookSeat(@Valid @RequestBody SeatBookingDTO bookingDTO) {

        boolean success = seatService.bookSeat(
                bookingDTO.getFlightNumber(),
                bookingDTO.getSeatId(),
                bookingDTO.getPassengerName()
        );

        if (success) {
            return ResponseEntity.ok(
                    new APIResponse(200, "Seat booked successfully", null)
            );
        }

        return ResponseEntity.status(400)
                .body(new APIResponse(400, "Seat already booked or invalid flight", null));
    }
}