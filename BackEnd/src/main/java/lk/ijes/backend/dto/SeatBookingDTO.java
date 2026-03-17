package lk.ijes.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatBookingDTO {

    private String seatId;        // e.g., "6A"
    private Long flightId;        // Flight-specific ID
    private String passengerName; // Optional, can be null if guest
}