package lk.ijes.backend.repository;

import lk.ijes.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByPnr(String pnr);

    // IMPORTANT: Spring Data JPA will implement this automatically
    boolean existsByFlight_IdAndSeat(Long flightId, String seat);

    List<Booking> findByFlight_Id(Long flightId);
}