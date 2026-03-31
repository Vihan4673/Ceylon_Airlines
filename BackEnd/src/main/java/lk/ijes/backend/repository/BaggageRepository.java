package lk.ijes.backend.repository;

import lk.ijes.backend.entity.Baggage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // Optional වෙනුවට List පාවිච්චි කරමු

@Repository
public interface BaggageRepository extends JpaRepository<Baggage, Long> {

    List<Baggage> findByPassportNo(String passportNo);
}