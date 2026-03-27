package lk.ijes.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(
        name = "seats",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"seat_id", "flight_id"})
        }
)
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "seat_id", nullable = false)
    private String seatId;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Column(nullable = false)
    private boolean booked = false;

    @Column(name = "passenger_name")
    private String passengerName;
    @Column(name = "flight_number", nullable = false)
    private String flightNumber;
}