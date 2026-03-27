package lk.ijes.backend.service.impl;

import jakarta.transaction.Transactional;
import lk.ijes.backend.entity.Flight;
import lk.ijes.backend.entity.Seat;
import lk.ijes.backend.repository.FlightRepository;
import lk.ijes.backend.repository.SeatRepository;
import lk.ijes.backend.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatServiceImpl implements SeatService {

    private final SeatRepository seatRepository;
    private final FlightRepository flightRepository;


    @Override
    public List<Seat> getSeatsByFlightNumber(String flightNumber) {

        if (flightNumber == null || flightNumber.isBlank()) {
            return List.of();
        }

        Flight flight = flightRepository
                .findByFlightNumber(flightNumber)
                .orElse(null);

        if (flight == null) {
            System.out.println("Flight not found: " + flightNumber);
            return List.of();
        }

        return seatRepository.findByFlight(flight);
    }


    @Override
    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }



    @Override
    @Transactional
    public boolean bookSeat(String flightNumber, String seatId, String passengerName) {

        // 🔹 Validate input
        if (flightNumber == null || flightNumber.isBlank() ||
                seatId == null || seatId.isBlank()) {
            return false;
        }

        Flight flight = flightRepository
                .findByFlightNumber(flightNumber)
                .orElse(null);

        if (flight == null) {
            System.out.println("Flight not found: " + flightNumber);
            return false;
        }

        Seat seat = seatRepository
                .findBySeatIdAndFlightForUpdate(seatId, flight)
                .orElseGet(() -> {
                    // 🔹 Create new seat if not exists
                    Seat newSeat = new Seat();
                    newSeat.setSeatId(seatId);
                    newSeat.setFlight(flight);
                    return newSeat;
                });

        if (seat.isBooked()) {
            System.out.println("Seat already booked: " + seatId);
            return false;
        }

        seat.setBooked(true);
        seat.setPassengerName(
                (passengerName == null || passengerName.isBlank())
                        ? "Guest"
                        : passengerName
        );
        seat.setFlightNumber(flight.getFlightNumber());
        seatRepository.save(seat);

        return true;
    }
}