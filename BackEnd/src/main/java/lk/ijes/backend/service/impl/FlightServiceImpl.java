package lk.ijes.backend.service.impl;

import lk.ijes.backend.dto.FlightDTO;
import lk.ijes.backend.entity.Flight;
import lk.ijes.backend.exception.FlightException;
import lk.ijes.backend.repository.FlightRepository;
import lk.ijes.backend.service.FlightService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FlightServiceImpl implements FlightService {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private ModelMapper modelMapper;

    // Save Flight
    @Override
    public void saveFlight(FlightDTO flightDTO) {
        if (flightDTO == null) {
            throw new FlightException("FlightDTO is null");
        }
        flightRepository.save(modelMapper.map(flightDTO, Flight.class));
    }

    @Override
    public void updateCustomer(FlightDTO flightDTO) {

    }

    @Override
    public void deleteCustomer(Long id) {

    }

    @Override
    public List<FlightDTO> getAllFlights() {
        return List.of();
    }

    @Override
    public void searchCFlightsByID(Long id) {

    }

    // Update Flight
    @Override
    public void updateFlight(FlightDTO flightDTO) {
        if (flightDTO == null) {
            throw new FlightException("FlightDTO is null");
        }

        if (!flightRepository.existsById(flightDTO.getId())) {
            throw new FlightException("Flight not found");
        }

        flightRepository.save(modelMapper.map(flightDTO, Flight.class));
    }

    // Delete Flight
    @Override
    public void deleteFlight(Long id) {
        if (!flightRepository.existsById(id)) {
            throw new FlightException("Flight not found");
        }
        flightRepository.deleteById(id);
    }

    // Get All Flights
    @Override
    public List<FlightDTO> getAllFlight() {
        List<Flight> flightList = flightRepository.findAll();
        return modelMapper.map(flightList,
                new TypeToken<ArrayList<FlightDTO>>() {}.getType());
    }

    // Search Flight By ID
    @Override
    public FlightDTO searchFlightByID(Long id) {
        Optional<Flight> flight = flightRepository.findById(id);

        if (flight.isEmpty()) {
            throw new FlightException("Flight not found");
        }

        return modelMapper.map(flight.get(), FlightDTO.class);
    }
}