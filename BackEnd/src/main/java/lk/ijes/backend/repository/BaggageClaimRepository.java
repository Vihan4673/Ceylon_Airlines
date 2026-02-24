package lk.ijes.backend.repository;

import lk.ijes.backend.entity.BaggageClaim;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BaggageClaimRepository
        extends JpaRepository<BaggageClaim, Long> {
}