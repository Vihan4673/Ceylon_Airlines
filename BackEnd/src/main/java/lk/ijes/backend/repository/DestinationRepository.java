package lk.ijes.backend.repository;

import lk.ijes.backend.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {
    // Optional: custom query if needed
    // Destination findByFromAndTo(String from, String to);
}