package lk.ijes.backend.service.impl;

import lk.ijes.backend.dto.DestinationDTO;
import lk.ijes.backend.entity.Destination;
import lk.ijes.backend.repository.DestinationRepository;
import lk.ijes.backend.service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationServiceImpl implements DestinationService {

    private final DestinationRepository destinationRepository;

    @Autowired
    public DestinationServiceImpl(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    @Override
    public DestinationDTO getDestinationById(Long id) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        return mapToDTO(destination);
    }

    @Override
    public DestinationDTO createDestination(DestinationDTO dto) {
        if (dto.getCity() == null || dto.getAirportCode() == null) {
            throw new RuntimeException("City and airport code cannot be null");
        }

        Destination destination = new Destination();
        destination.setCity(dto.getCity());              // maps to 'to_city'
        destination.setAirportCode(dto.getAirportCode());// maps to 'from_airport_code'

        Destination saved = destinationRepository.save(destination);
        return mapToDTO(saved);
    }

    @Override
    public List<DestinationDTO> getAllDestinations() {
        List<Destination> destinations = destinationRepository.findAll();
        return destinations.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Helper method to map entity to DTO
    private DestinationDTO mapToDTO(Destination destination) {
        return new DestinationDTO(
                destination.getCity(),        // DTO city
                destination.getAirportCode()  // DTO airportCode
        );
    }
}