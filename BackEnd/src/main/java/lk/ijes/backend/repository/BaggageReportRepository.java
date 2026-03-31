package lk.ijes.backend.repository;

import lk.ijes.backend.entity.BaggageReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface BaggageReportRepository extends JpaRepository<BaggageReport, Long> {

    List<BaggageReport> findByPassportNumber(String passportNumber);

    List<BaggageReport> findByFlightNumber(String flightNumber);

    List<BaggageReport> findByEmail(String email);
}