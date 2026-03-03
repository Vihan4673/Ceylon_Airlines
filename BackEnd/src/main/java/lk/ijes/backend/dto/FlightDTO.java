package lk.ijes.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class FlightDTO {

    private Long id;

    @NotBlank(message = "Flight number cannot be empty")
    private String flightNumber;

    @NotBlank(message = "Departure cannot be empty")
    private String departure;   // e.g., "CMB"

    @NotBlank(message = "Arrival cannot be empty")
    private String arrival;     // e.g., "BOM"

    @NotBlank(message = "Departure time cannot be empty")
    private String departureTime; // e.g., "08:00"

    @NotBlank(message = "Arrival time cannot be empty")
    private String arrivalTime;   // e.g., "10:30"

    @NotNull(message = "Flight date cannot be empty")
    private String flightDate;    // e.g., "2026-03-05"

    private String duration;      // optional: e.g., "2h 30m"

    private Integer totalSeats;   // total seats in the plane

    private Integer bookedSeats = 0; // default 0

    private String status = "On Time"; // default status

    // Fares
    @NotNull(message = "Economy fare cannot be empty")
    private String economyFare;   // e.g., "20000"

    @NotNull(message = "Business fare cannot be empty")
    private String businessFare;  // e.g., "50000"


}