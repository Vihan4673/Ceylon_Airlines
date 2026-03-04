package lk.ijes.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "destination")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "from_city", nullable = false)
    private String from;        // e.g., "Colombo"

    @Column(name = "to_city", nullable = false)
    private String to;          // e.g., "Abu Dhabi"

    @Column(name = "from_airport_code", nullable = false)
    private String fromCode;    // e.g., "CMB"

    @Column(name = "to_airport_code", nullable = false)
    private String toCode;      // e.g., "AUH"
}