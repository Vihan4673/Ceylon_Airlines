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
        destination.setCity(dto.getCity());
        destination.setAirportCode(dto.getAirportCode().toUpperCase());

        Destination saved = destinationRepository.save(destination);
        return mapToDTO(saved);
    }

    @Override
    public List<DestinationDTO> getAllDestinations() {
        return destinationRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DestinationDTO updateDestination(Long id, DestinationDTO dto) {

        Destination existing = destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        if (dto.getCity() != null) {
            existing.setCity(dto.getCity());
        }

        if (dto.getAirportCode() != null) {
            existing.setAirportCode(dto.getAirportCode().toUpperCase());
        }

        Destination updated = destinationRepository.save(existing);
        return mapToDTO(updated);
    }

    @Override
    public void deleteDestination(Long id) {

        Destination existing = destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        destinationRepository.delete(existing);
    }

    private DestinationDTO mapToDTO(Destination destination) {
        return new DestinationDTO(
                destination.getId(),
                destination.getCity(),
                destination.getAirportCode()
        );
    }
}