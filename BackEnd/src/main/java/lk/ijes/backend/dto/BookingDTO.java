package lk.ijes.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BookingDTO {

    private Long id;

    // PNR is auto-generated, so client may leave it blank
    private String pnr;

    @NotBlank(message = "Passenger name cannot be empty")
    private String passenger;

    @NotNull(message = "Flight ID cannot be null")
    private Long flightId;  // keep for easy mapping

    @NotBlank(message = "Seat cannot be empty")
    private String seat;

    // Booking date is auto-set in service if null
    private LocalDate bookingDate;

    // Departure date can be taken from flight if null
    private LocalDate departureDate;

    @NotBlank(message = "Class type cannot be empty")
    private String travelClass; // Economy, Business, etc.

    private Double price;       // Price for this booking

    private Boolean paid = false;    // Payment status

    private String status = "CONFIRMED"; // Booking status

    @NotBlank(message = "Origin cannot be empty")
    private String from;   // Flight origin

    @NotBlank(message = "Destination cannot be empty")
    private String to;     // Flight destination
}