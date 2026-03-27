package lk.ijes.backend.service;

import lk.ijes.backend.entity.Seat;
import java.util.List;

public interface SeatService {

    List<Seat> getSeatsByFlightNumber(String flightNumber);

    List<Seat> getAllSeats();


    boolean bookSeat(String flightNumber, String seatId, String passengerName);

    default boolean bookSeat(String flightNumber, String seatId) {
        return bookSeat(flightNumber, seatId, null);
    }
}