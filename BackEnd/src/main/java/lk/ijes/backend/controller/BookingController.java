package lk.ijes.backend.controller;

import jakarta.validation.Valid;
import lk.ijes.backend.dto.BookingDTO;
import lk.ijes.backend.service.BookingService;
import lk.ijes.backend.service.EmailService; // ✅ EmailService import
import lk.ijes.backend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final EmailService emailService;
    @PostMapping
    public ResponseEntity<APIResponse<BookingDTO>> createBooking(
            @Valid @RequestBody BookingDTO bookingDTO) {

        try {
            if (bookingDTO.getBookingDate() == null) {
                bookingDTO.setBookingDate(LocalDate.now());
            }

            BookingDTO savedBooking = bookingService.saveBooking(bookingDTO);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new APIResponse<>(201, "Booking created successfully", savedBooking));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new APIResponse<>(400, "Failed to create booking: " + e.getMessage(), null));
        }
    }

    @PutMapping("/pnr/{pnr}")
    public ResponseEntity<APIResponse<BookingDTO>> updateBookingByPnr(
            @PathVariable String pnr,
            @Valid @RequestBody BookingDTO bookingDTO) {

        try {
            if (bookingDTO.getBookingDate() == null) {
                bookingDTO.setBookingDate(LocalDate.now());
            }

            BookingDTO updatedBooking = bookingService.updateBookingByPnr(pnr, bookingDTO);

            if (updatedBooking.getPaid() != null && updatedBooking.getPaid()) {
                try {
                    emailService.sendBookingConfirmation(updatedBooking.getEmail(), updatedBooking);
                    System.out.println(" Email sent to: " + updatedBooking.getEmail());
                } catch (Exception mailError) {
                    System.err.println(" Email sending failed: " + mailError.getMessage());
                }
            }

            return ResponseEntity.ok(
                    new APIResponse<>(200, "Booking updated to PAID successfully", updatedBooking)
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new APIResponse<>(400, "Failed to update booking by PNR: " + e.getMessage(), null));
        }
    }

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

    @GetMapping
    public ResponseEntity<APIResponse<List<BookingDTO>>> getAllBookings() {
        List<BookingDTO> bookingList = bookingService.getAllBookings();
        return ResponseEntity.ok(new APIResponse<>(200, "Bookings retrieved successfully", bookingList));
    }


    @GetMapping("/pnr/{pnr}")
    public ResponseEntity<APIResponse<BookingDTO>> getBookingByPnr(@PathVariable String pnr) {
        try {
            BookingDTO bookingDTO = bookingService.getBookingByPnr(pnr);
            return ResponseEntity.ok(new APIResponse<>(200, "Booking retrieved successfully", bookingDTO));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new APIResponse<>(404, "PNR not found: " + e.getMessage(), null));
        }
    }
}