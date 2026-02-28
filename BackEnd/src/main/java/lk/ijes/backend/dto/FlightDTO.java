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
    private String departure;

    @NotBlank(message = "Arrival cannot be empty")
    private String arrival;

    @NotBlank(message = "Departure time cannot be empty")
    private String departureTime;

    @NotBlank(message = "Arrival time cannot be empty")
    private String arrivalTime;

    @NotNull(message = "Total seats cannot be empty")
    private Integer totalSeats;

    @NotNull(message = "Price cannot be empty")
    private Double price;

    private Integer bookedSeats = 0; // default 0
    private String status = "On Time"; // default status
}