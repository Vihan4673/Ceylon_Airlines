package lk.ijes.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "baggage_reports")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BaggageReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String passengerName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, length = 20)
    private String passportNumber;

    @Column(nullable = false, length = 10)
    private String flightNumber;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String photoPath;

    @Column(nullable = false)
    private String status = "Processing";

    @Column(columnDefinition = "TEXT")
    private String adminComment;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(updatable = false)
    private Date reportedAt = new Date();
}