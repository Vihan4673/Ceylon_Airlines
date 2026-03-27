package lk.ijes.backend.repository;

import lk.ijes.backend.entity.Ad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdRepository extends JpaRepository<Ad, Long> {

    List<Ad> findByActiveTrue();

}