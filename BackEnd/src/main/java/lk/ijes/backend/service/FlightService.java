
package lk.ijes.backend.service;

import lk.ijes.backend.dto.FlightDTO;

import java.util.List;

public interface FlightService {
    void saveFlight(FlightDTO flightDTO);
    void updateCustomer(FlightDTO flightDTO);
    void deleteCustomer(Long id);
    List<FlightDTO> getAllFlights();
    void searchCFlightsByID(Long id);


    void updateFlight(FlightDTO flightDTO);


    void deleteFlight(Long id);


    List<FlightDTO> getAllFlight();


    FlightDTO searchFlightByID(Long id);
}
