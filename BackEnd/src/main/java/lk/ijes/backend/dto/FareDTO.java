package lk.ijes.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * FareDTO represents a class-specific fare for a flight.
 * Example: Economy = 152025 LKR, Business = 358625 LKR
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FareDTO {

    private Long id; // Database primary key (optional for frontend)

    @NotNull(message = "Flight ID cannot be null")
    private Long flightId; // Reference to the flight

    @NotBlank(message = "Flight class cannot be empty")
    private String flightClass; // Example: Economy, Business

    @NotNull(message = "Amount cannot be null")
    @Positive(message = "Amount must be positive")
    private Double amount; // Ticket price for this class
}