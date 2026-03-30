package lk.ijes.backend.repository;

import lk.ijes.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByPnr(String pnr);

    boolean existsByFlightNumberAndSeat(String flightNumber, String seat);

    List<Booking> findByFlightNumber(String flightNumber);
}