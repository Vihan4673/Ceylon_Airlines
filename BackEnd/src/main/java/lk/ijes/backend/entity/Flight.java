package lk.ijes.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String flightNumber;

    @Column(nullable = false)
    private String departure;

    @Column(nullable = false)
    private String arrival;

    @Column(nullable = false)
    private String departureTime;

    @Column(nullable = false)
    private String arrivalTime;

    @Column(nullable = false)
    private Integer totalSeats;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer bookedSeats = 0; // default 0

    @Column(nullable = false)
    private String status = "On Time"; // default status
}