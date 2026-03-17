package lk.ijes.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String pnr;

    private String passenger;

    @ManyToOne
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    private String seat;
    private LocalDate bookingDate;
    private LocalDate departureDate;
    private String travelClass;
    private Double price;
    private Boolean paid = false;
    private String status = "CONFIRMED";

    @Column(name = "origin")
    private String from;

    @Column(name = "destination")
    private String to;

    // Utility method to generate a random PNR
    @PrePersist
    public void generatePNR() {
        if (this.pnr == null || this.pnr.isEmpty()) {
            this.pnr = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        }
    }
}