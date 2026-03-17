package lk.ijes.backend.service.impl;

import lk.ijes.backend.entity.Seat;
import lk.ijes.backend.repository.SeatRepository;
import lk.ijes.backend.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SeatServiceImpl implements SeatService {

    private final SeatRepository seatRepository;

    // =====================================================
    // GET ALL SEATS FOR A SPECIFIC FLIGHT
    // =====================================================
    @Override
    public List<Seat> getSeatsByFlight(Long flightId) {
        if (flightId == null) return List.of(); // prevent null
        return seatRepository.findByFlightId(flightId);
    }

    // =====================================================
    // GET ALL SEATS (for testing or frontend /all)
    // =====================================================
    @Override
    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    // =====================================================
    // BOOK SEAT WITH PASSENGER NAME
    // =====================================================
    @Override
    public boolean bookSeat(Long flightId, String seatId, String passengerName) {
        if (flightId == null || seatId == null || seatId.isBlank()) return false;

        Optional<Seat> seatOptional = seatRepository.findBySeatIdAndFlightId(seatId, flightId);

        Seat seat;
        if (seatOptional.isPresent()) {
            seat = seatOptional.get();
            if (seat.isBooked()) {
                System.out.println("Seat already booked: " + seatId + " on flight " + flightId);
                return false;
            }
        } else {
            seat = new Seat();
            seat.setFlightId(flightId);
            seat.setSeatId(seatId);
        }

        seat.setBooked(true);
        seat.setPassengerName(passengerName != null ? passengerName : "Guest");
        seatRepository.save(seat);

        return true;
    }

    // =====================================================
    // BOOK SEAT WITHOUT PASSENGER NAME (delegates to above)
    // =====================================================
    @Override
    public boolean bookSeat(Long flightId, String seatId) {
        return bookSeat(flightId, seatId, "Guest");
    }
}