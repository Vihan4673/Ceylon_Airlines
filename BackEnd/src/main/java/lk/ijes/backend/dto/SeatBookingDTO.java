package lk.ijes.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatBookingDTO {

    @NotBlank(message = "Seat ID is required")
    private String seatId;

    @NotBlank(message = "Flight number is required")
    private String flightNumber;

    @NotBlank(message = "Passenger name is required")
    private String passengerName;
}