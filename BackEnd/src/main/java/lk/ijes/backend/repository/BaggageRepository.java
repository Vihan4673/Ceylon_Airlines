package lk.ijes.backend.repository;

import lk.ijes.backend.entity.Baggage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BaggageRepository extends JpaRepository<Baggage, Long> {
    Optional<Baggage> findByPassportNo(String passportNo);
}