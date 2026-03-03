package lk.ijes.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BookingDTO {

    private Long id;

    @NotBlank(message = "PNR cannot be empty")
    private String pnr;

    @NotBlank(message = "Passenger name cannot be empty")
    private String passenger;

    @NotNull(message = "Flight ID cannot be null")
    private Long flightId;

    @NotBlank(message = "Seat cannot be empty")
    private String seat;
}