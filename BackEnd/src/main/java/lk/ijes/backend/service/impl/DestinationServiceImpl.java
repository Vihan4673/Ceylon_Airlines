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
        if (dto.getFrom() == null || dto.getTo() == null) {
            throw new RuntimeException("Origin and destination cannot be null");
        }

        Destination destination = new Destination();
        destination.setFrom(dto.getFrom());
        destination.setTo(dto.getTo());
        destination.setFromCode(dto.getFromCode());
        destination.setToCode(dto.getToCode());

        Destination saved = destinationRepository.save(destination);
        return mapToDTO(saved);
    }

    // ✅ New method to fetch all destinations
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
                destination.getFrom(),
                destination.getTo(),
                destination.getFromCode(),
                destination.getToCode()
        );
    }
}