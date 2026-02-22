package lk.ijes.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "passengers")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Passenger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;          // Mr, Ms, Mrs
    private String firstName;
    private String lastName;
    private String gender;

    private LocalDate dateOfBirth;

    private String nationality;
    private String documentNumber;
    private LocalDate expiryDate;

    private String email;
    private String phoneNumber;
}