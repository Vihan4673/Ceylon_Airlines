package lk.ijes.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // ✅ primary key

    @Column(unique = true)
    private String pnr; // ✅ business ID

    @Column(nullable = false)
    private String passenger;

    @Column(nullable = false)
    private String flightNumber;

    @Column(nullable = false)
    private String seat;

    private LocalDate bookingDate;

    @Column(nullable = false)
    private LocalDate departureDate;

    @Column(nullable = false)
    private String travelClass;

    private Double price;

    private Boolean paid = false;

    private String status = "CONFIRMED";

    @Column(nullable = false)
    private String origin;

    @Column(nullable = false)
    private String destination;
}