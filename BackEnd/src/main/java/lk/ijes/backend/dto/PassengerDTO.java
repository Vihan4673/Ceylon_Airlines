package lk.ijes.backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PassengerDTO {

    private Long id;

    @NotBlank(message = "Title cannot be empty")
    private String title; // Mr, Ms, Mrs

    @NotBlank(message = "First name cannot be empty")
    private String firstName;

    @NotBlank(message = "Last name cannot be empty")
    private String lastName;

    @NotBlank(message = "Gender cannot be empty")
    private String gender;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Nationality cannot be empty")
    private String nationality;

    @NotBlank(message = "Document number cannot be empty")
    private String documentNumber;

    @NotNull(message = "Document expiry date is required")
    @Future(message = "Expiry date must be in the future")
    private LocalDate expiryDate;

    @Email(message = "Email must be valid")
    private String email;

    @Pattern(regexp="^\\+?[0-9]{7,15}$", message="Phone number must be valid")
    private String phoneNumber;
}