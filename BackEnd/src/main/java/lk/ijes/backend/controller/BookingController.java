package lk.ijes.backend.controller;

import jakarta.validation.Valid;
import lk.ijes.backend.dto.BookingDTO;
import lk.ijes.backend.service.BookingService;
import lk.ijes.backend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("api/v1/bookings")
public class BookingController {

    private final BookingService bookingService;

    // Save Booking
    @PostMapping("/saveBooking")
    public ResponseEntity<APIResponse<String>> saveBooking(
            @Valid @RequestBody BookingDTO bookingDTO) {

        bookingService.saveBooking(bookingDTO);

        return new ResponseEntity<>(
                new APIResponse<>(201, "Booking saved successfully", null),
                HttpStatus.CREATED
        );
    }

    // Update Booking
    @PutMapping("/updateBooking")
    public ResponseEntity<APIResponse<String>> updateBooking(
            @Valid @RequestBody BookingDTO bookingDTO) {

        bookingService.updateBooking(bookingDTO);

        return new ResponseEntity<>(
                new APIResponse<>(200, "Booking updated successfully", null),
                HttpStatus.OK
        );
    }

    // Delete Booking
    @DeleteMapping("/deleteBooking/{id}")
    public ResponseEntity<APIResponse<String>> deleteBooking(
            @PathVariable Long id) {

        bookingService.deleteBooking(id);

        return new ResponseEntity<>(
                new APIResponse<>(200, "Booking deleted successfully", null),
                HttpStatus.OK
        );
    }

    // Get All Bookings
    @GetMapping("/getAllBookings")
    public ResponseEntity<APIResponse<List<BookingDTO>>> getAllBookings() {

        List<BookingDTO> bookingList = bookingService.getAllBookings();

        return new ResponseEntity<>(
                new APIResponse<>(200, "Bookings retrieved successfully", bookingList),
                HttpStatus.OK
        );
    }

    // Search Booking By ID
    @GetMapping("/searchBooking/{id}")
    public ResponseEntity<APIResponse<BookingDTO>> searchBooking(
            @PathVariable Long id) {

        BookingDTO bookingDTO = bookingService.searchBookingByID(id);

        return new ResponseEntity<>(
                new APIResponse<>(200, "Booking retrieved successfully", bookingDTO),
                HttpStatus.OK
        );
    }
}