package lk.ijes.backend.repository;

import lk.ijes.backend.entity.Fare;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FareRepository extends JpaRepository<Fare, Long> {

    // Get all fares for a specific flight
    List<Fare> findByFlight_Id(Long flightId);
}