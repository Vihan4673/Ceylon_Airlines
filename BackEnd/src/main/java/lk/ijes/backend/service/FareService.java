package lk.ijes.backend.service;

import lk.ijes.backend.dto.FareDTO;

import java.util.List;

public interface FareService {

    // Create a new fare
    FareDTO createFare(FareDTO fareDTO);

    // Update existing fare
    FareDTO updateFare(FareDTO fareDTO);

    // Delete a fare by ID
    void deleteFare(Long id);

    // Get all fares
    List<FareDTO> getAllFares();

    // Get fare by ID
    FareDTO getFareById(Long id);

    // Get fares for a specific flight
    List<FareDTO> getFaresByFlight(Long flightId);
}