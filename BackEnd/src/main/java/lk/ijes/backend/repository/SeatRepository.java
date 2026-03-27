package lk.ijes.backend.repository;

import lk.ijes.backend.entity.Flight;
import lk.ijes.backend.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByFlight(Flight flight);

    Optional<Seat> findBySeatIdAndFlight(String seatId, Flight flight);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Seat s WHERE s.seatId = :seatId AND s.flight = :flight")
    Optional<Seat> findBySeatIdAndFlightForUpdate(String seatId, Flight flight);
}