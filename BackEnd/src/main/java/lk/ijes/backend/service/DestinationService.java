package lk.ijes.backend.service;

import lk.ijes.backend.dto.DestinationDTO;

import java.util.List;

public interface DestinationService {


    DestinationDTO getDestinationById(Long id);


    DestinationDTO createDestination(DestinationDTO dto);


    List<DestinationDTO> getAllDestinations();

    DestinationDTO updateDestination(Long id, DestinationDTO dto);

    void deleteDestination(Long id);
}