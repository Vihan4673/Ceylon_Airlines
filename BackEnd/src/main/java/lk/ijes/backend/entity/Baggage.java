package lk.ijes.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "baggages")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Baggage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String passportNo;

    @Column(nullable = false)
    private String passenger;

    @Column(nullable = false)
    private String flightNo;

    @Column(unique = true)
    private String tagId;
    @Column(nullable = false)
    private String pnr;

    private String status = "Checked";

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}