package lk.ijes.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "seats")
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "seat_id", nullable = false)
    private String seatId;      // e.g., "6A"

    @Column(name = "flight_id", nullable = false)
    private Long flightId;      // FK to Flight

    @Column(nullable = false)
    private boolean booked = false;  // default false

    @Column(name = "passenger_name")
    private String passengerName;    // optional
}