package lk.ijes.backend.repository;

import lk.ijes.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find booking by PNR
    Optional<Booking> findByPnr(String pnr);

    // Check seat already booked for a flight
    boolean existsByFlight_IdAndSeat(Long flightId, String seat);

    // Get all bookings for a specific flight
    List<Booking> findByFlight_Id(Long flightId);
}