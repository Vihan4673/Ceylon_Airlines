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

    // ❌ remove pnr from input (optional but recommended)
    private String pnr;

    @NotBlank(message = "Passenger name cannot be empty")
    private String passenger;

    @NotBlank(message = "Flight number cannot be empty")
    private String flightNumber;

    @NotBlank(message = "Seat cannot be empty")
    private String seat;

    private LocalDate bookingDate;

    @NotNull(message = "Departure date cannot be null")
    private LocalDate departureDate;

    @NotBlank(message = "Class type cannot be empty")
    private String travelClass;

    private Double price;

    private Boolean paid = false;

    private String status = "CONFIRMED";

    @NotBlank(message = "Origin cannot be empty")
    private String origin;

    @NotBlank(message = "Destination cannot be empty")
    private String destination;
}