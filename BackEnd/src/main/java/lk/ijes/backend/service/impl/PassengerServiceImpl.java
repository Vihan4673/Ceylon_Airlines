package lk.ijes.backend.service.impl;

import lk.ijes.backend.dto.PassengerDTO;
import lk.ijes.backend.entity.Passenger;
import lk.ijes.backend.exception.CustomException;
import lk.ijes.backend.repository.PassengerRepository;
import lk.ijes.backend.service.PassengerService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PassengerServiceImpl implements PassengerService {

    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public void savePassenger(PassengerDTO passengerDTO) {
        if (passengerDTO == null) {
            throw new CustomException("PassengerDTO cannot be null");
        }
        passengerRepository.save(modelMapper.map(passengerDTO, Passenger.class));
    }

    @Override
    public void updatePassenger(PassengerDTO passengerDTO) {
        if (passengerDTO == null || passengerDTO.getId() == null) {
            throw new CustomException("PassengerDTO or ID cannot be null");
        }
        if (!passengerRepository.existsById(passengerDTO.getId())) {
            throw new CustomException("Passenger not found for ID: " + passengerDTO.getId());
        }
        passengerRepository.save(modelMapper.map(passengerDTO, Passenger.class));
    }

    @Override
    public void deletePassenger(Long id) {
        if (!passengerRepository.existsById(id)) {
            throw new CustomException("Passenger not found for ID: " + id);
        }
        passengerRepository.deleteById(id);
    }

    @Override
    public PassengerDTO searchPassengerByID(Long id) {
        Passenger passenger = passengerRepository.findById(id)
                .orElseThrow(() -> new CustomException("Passenger not found for ID: " + id));
        return modelMapper.map(passenger, PassengerDTO.class);
    }

    @Override
    public List<PassengerDTO> getAllPassengers() {
        List<Passenger> passengers = passengerRepository.findAll();
        return modelMapper.map(passengers, new TypeToken<ArrayList<PassengerDTO>>() {}.getType());
    }
}