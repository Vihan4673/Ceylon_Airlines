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

        try {
            BookingDTO savedBooking = bookingService.saveBooking(bookingDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new APIResponse<>(201, "Booking created successfully", savedBooking));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new APIResponse<>(400, "Failed to create booking: " + e.getMessage(), null));
        }
    }

    // ================= UPDATE BOOKING =================
    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<BookingDTO>> updateBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingDTO bookingDTO) {

        try {
            bookingDTO.setId(id);
            BookingDTO updatedBooking = bookingService.updateBooking(bookingDTO);
            return ResponseEntity.ok(new APIResponse<>(200, "Booking updated successfully", updatedBooking));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new APIResponse<>(400, "Failed to update booking: " + e.getMessage(), null));
        }
    }

    // ================= DELETE BOOKING =================
    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<String>> deleteBooking(@PathVariable Long id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok(new APIResponse<>(200, "Booking deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new APIResponse<>(404, "Booking not found: " + e.getMessage(), null));
        }
    }

    // ================= GET ALL BOOKINGS =================
    @GetMapping
    public ResponseEntity<APIResponse<List<BookingDTO>>> getAllBookings() {
        List<BookingDTO> bookingList = bookingService.getAllBookings();
        return ResponseEntity.ok(new APIResponse<>(200, "Bookings retrieved successfully", bookingList));
    }

    // ================= GET BOOKING BY ID =================
    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<BookingDTO>> getBookingById(@PathVariable Long id) {
        try {
            BookingDTO bookingDTO = bookingService.searchBookingByID(id);
            return ResponseEntity.ok(new APIResponse<>(200, "Booking retrieved successfully", bookingDTO));
        } catch (RuntimeException e) {
            // If booking not found
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new APIResponse<>(404, "Booking not found: " + e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new APIResponse<>(500, "Error retrieving booking: " + e.getMessage(), null));
        }
    }
}