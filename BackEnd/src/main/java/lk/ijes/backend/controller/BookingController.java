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
@RequestMapping("/api/v1/bookings")
public class BookingController {

    private final BookingService bookingService;

    // ================= CREATE BOOKING =================
    @PostMapping
    public ResponseEntity<APIResponse<BookingDTO>> createBooking(
            @Valid @RequestBody BookingDTO bookingDTO) {

        BookingDTO savedBooking = bookingService.saveBooking(bookingDTO);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new APIResponse<>(201, "Booking created successfully", savedBooking));
    }

    // ================= UPDATE BOOKING =================
    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<BookingDTO>> updateBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingDTO bookingDTO) {

        bookingDTO.setId(id);
        BookingDTO updatedBooking = bookingService.updateBooking(bookingDTO);

        return ResponseEntity.ok(
                new APIResponse<>(200, "Booking updated successfully", updatedBooking)
        );
    }

    // ================= DELETE BOOKING =================
    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<String>> deleteBooking(@PathVariable Long id) {

        bookingService.deleteBooking(id);

        return ResponseEntity.ok(
                new APIResponse<>(200, "Booking deleted successfully", null)
        );
    }

    // ================= GET ALL BOOKINGS =================
    @GetMapping
    public ResponseEntity<APIResponse<List<BookingDTO>>> getAllBookings() {

        List<BookingDTO> bookingList = bookingService.getAllBookings();

        return ResponseEntity.ok(
                new APIResponse<>(200, "Bookings retrieved successfully", bookingList)
        );
    }

    // ================= GET BOOKING BY ID =================
    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<BookingDTO>> getBookingById(@PathVariable Long id) {

        BookingDTO bookingDTO = bookingService.searchBookingByID(id);

        return ResponseEntity.ok(
                new APIResponse<>(200, "Booking retrieved successfully", bookingDTO)
        );
    }
}