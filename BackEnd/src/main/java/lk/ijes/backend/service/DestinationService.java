package lk.ijes.backend.service;

import lk.ijes.backend.dto.DestinationDTO;
import java.util.List;

public interface DestinationService {

    // Get a single destination by ID
    DestinationDTO getDestinationById(Long id);

    // Create a new destination
    DestinationDTO createDestination(DestinationDTO dto);

    // ✅ Get all destinations
    List<DestinationDTO> getAllDestinations();
}