package lk.ijes.backend.service.impl;

import lk.ijes.backend.dto.FareDTO;
import lk.ijes.backend.entity.Fare;
import lk.ijes.backend.repository.FareRepository;
import lk.ijes.backend.service.FareService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FareServiceImpl implements FareService {

    private final FareRepository fareRepository;
    private final ModelMapper modelMapper;

    @Override
    public FareDTO createFare(FareDTO fareDTO) {
        Fare fare = modelMapper.map(fareDTO, Fare.class);
        fareRepository.save(fare);
        return modelMapper.map(fare, FareDTO.class);
    }

    @Override
    public FareDTO updateFare(FareDTO fareDTO) {
        Fare fare = fareRepository.findById(fareDTO.getId())
                .orElseThrow(() -> new RuntimeException("Fare not found"));
        fare.setAmount(fareDTO.getAmount());
        fare.setFlightClass(fareDTO.getFlightClass());
        fareRepository.save(fare);
        return modelMapper.map(fare, FareDTO.class);
    }

    @Override
    public void deleteFare(Long id) {
        if (!fareRepository.existsById(id)) {
            throw new RuntimeException("Fare not found");
        }
        fareRepository.deleteById(id);
    }

    @Override
    public List<FareDTO> getAllFares() {
        return fareRepository.findAll()
                .stream()
                .map(fare -> modelMapper.map(fare, FareDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public FareDTO getFareById(Long id) {
        Fare fare = fareRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fare not found"));
        return modelMapper.map(fare, FareDTO.class);
    }

    @Override
    public List<FareDTO> getFaresByFlight(Long flightId) {
        List<Fare> fares = fareRepository.findByFlight_Id(flightId);
        return fares.stream()
                .map(fare -> modelMapper.map(fare, FareDTO.class))
                .collect(Collectors.toList());
    }
}