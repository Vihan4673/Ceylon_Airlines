package lk.ijes.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String pnr;

    private String passenger;

    private String seat;

    // Many bookings can belong to one flight
    @ManyToOne
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;
}