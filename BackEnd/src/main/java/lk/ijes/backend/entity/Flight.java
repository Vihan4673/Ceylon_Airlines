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
    private String departure;   // e.g., "CMB"

    @Column(nullable = false)
    private String arrival;     // e.g., "BOM"

    @Column(nullable = false)
    private String departureTime; // e.g., "08:00"

    @Column(nullable = false)
    private String arrivalTime;   // e.g., "10:30"

    @Column(nullable = false)
    private String flightDate;    // e.g., "2026-03-05"

    private String duration;      // optional: "2h 30m"

    private Integer totalSeats;   // total seats in the plane

    private Integer bookedSeats = 0; // default 0

    private String status = "On Time"; // default status

    @Column(nullable = false)
    private String economyFare;   // e.g., "20000"

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