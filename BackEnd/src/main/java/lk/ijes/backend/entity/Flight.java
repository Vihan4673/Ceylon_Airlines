package lk.ijes.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "flight")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
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
    private String flightDate;

    private String duration;

    private Integer totalSeats;

    private Integer bookedSeats = 0;

    private String status = "On Time";

    @Column(nullable = false)
    private String economyFare;

    @Column(nullable = false)
    private String businessFare;  // e.g., "50000"

    /**
     * Convert the flightDate String to LocalDate
     */
    public LocalDate getDate() {
        if (flightDate == null || flightDate.isBlank()) return null;
        return LocalDate.parse(flightDate, DateTimeFormatter.ISO_LOCAL_DATE);
    }
}