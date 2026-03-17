package lk.ijes.backend.repository;

import lk.ijes.backend.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    // Return all seats for a given flight
    List<Seat> findByFlightId(Long flightId);

    // Find specific seat by seatId and flightId
    Optional<Seat> findBySeatIdAndFlightId(String seatId, Long flightId);

}