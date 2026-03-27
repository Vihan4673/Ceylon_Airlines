package lk.ijes.backend.repository;

import lk.ijes.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find booking by PNR
    Optional<Booking> findByPnr(String pnr);

    // Check if a seat is already booked for a flight number
    boolean existsByFlightNumberAndSeat(String flightNumber, String seat);

    // Get all bookings for a flight number
    List<Booking> findByFlightNumber(String flightNumber);
}