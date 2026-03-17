package lk.ijes.backend.service;

import lk.ijes.backend.entity.Seat;
import java.util.List;

public interface SeatService {

    // Get all seats for a specific flight
    List<Seat> getSeatsByFlight(Long flightId);

    // Optional: get all seats (for testing or frontend GET /all)
    List<Seat> getAllSeats();

    // Book a seat for a flight with passengerName
    boolean bookSeat(Long flightId, String seatId, String passengerName);

    // Book a seat for a flight without passengerName
    default boolean bookSeat(Long flightId, String seatId) {
        return bookSeat(flightId, seatId, null);
    }
}