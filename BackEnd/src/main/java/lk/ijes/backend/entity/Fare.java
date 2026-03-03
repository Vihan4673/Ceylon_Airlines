package lk.ijes.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fare {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String flightClass;

    private Double amount;

    // Many fares can belong to one flight
    @ManyToOne
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;
}