package lk.ijes.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class BaggageClaim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String baggageTagId;
    private String issueType;

    @Column(length = 1000)
    private String description;

    private String imagePath;

    private String status;
}