package lk.ijes.backend.service;

import lk.ijes.backend.dto.FlightDTO;

import java.util.List;

public interface FlightService {
    void saveFlight(FlightDTO flightDTO);
    void updateCustomer(FlightDTO flightDTO);
    void deleteCustomer(Long id);
    List<FlightDTO> getAllFlights();
    void searchCFlightsByID(Long id);

    // Update Flight
    void updateFlight(FlightDTO flightDTO);

    // Delete Flight
    void deleteFlight(Long id);

    // Get All Flights
    List<FlightDTO> getAllFlight();

    // Search Flight By ID
    FlightDTO searchFlightByID(Long id);
}
