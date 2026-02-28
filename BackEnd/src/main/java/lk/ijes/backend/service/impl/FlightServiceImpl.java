package lk.ijes.backend.service.impl;

import lk.ijes.backend.dto.FlightDTO;
import lk.ijes.backend.entity.Flight;
import lk.ijes.backend.exception.CustomException;
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
            throw new CustomException("FlightDTO is null");
        }

        Flight flight = modelMapper.map(flightDTO, Flight.class);

        // Default values
        if (flight.getBookedSeats() == null) flight.setBookedSeats(0);
        if (flight.getStatus() == null || flight.getStatus().isEmpty()) flight.setStatus("On Time");

        flightRepository.save(flight);
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
            throw new CustomException("FlightDTO is null");
        }

        Optional<Flight> existingFlightOpt = flightRepository.findById(flightDTO.getId());
        if (existingFlightOpt.isEmpty()) {
            throw new CustomException("Flight not found");
        }

        Flight existingFlight = existingFlightOpt.get();

        // Map all fields from DTO
        existingFlight.setFlightNumber(flightDTO.getFlightNumber());
        existingFlight.setDeparture(flightDTO.getDeparture());
        existingFlight.setArrival(flightDTO.getArrival());
        existingFlight.setDepartureTime(flightDTO.getDepartureTime());
        existingFlight.setArrivalTime(flightDTO.getArrivalTime());
        existingFlight.setTotalSeats(flightDTO.getTotalSeats());
        existingFlight.setPrice(flightDTO.getPrice());

        flightRepository.save(existingFlight);
    }

    // Delete Flight
    @Override
    public void deleteFlight(Long id) {
        if (!flightRepository.existsById(id)) {
            throw new CustomException("Flight not found");
        }
        flightRepository.deleteById(id);
    }

    // Get All Flights
    @Override
    public List<FlightDTO> getAllFlight() {
        List<Flight> flightList = flightRepository.findAll();
        return modelMapper.map(flightList, new TypeToken<ArrayList<FlightDTO>>() {}.getType());
    }

    // Search Flight By ID
    @Override
    public FlightDTO searchFlightByID(Long id) {
        Optional<Flight> flight = flightRepository.findById(id);
        if (flight.isEmpty()) {
            throw new CustomException("Flight not found");
        }
        return modelMapper.map(flight.get(), FlightDTO.class);
    }
}