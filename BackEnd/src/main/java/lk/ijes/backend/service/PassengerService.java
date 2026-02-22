package lk.ijes.backend.service;

import lk.ijes.backend.dto.PassengerDTO;
import java.util.List;

public interface PassengerService {

    void savePassenger(PassengerDTO passengerDTO);

    void updatePassenger(PassengerDTO passengerDTO);

    void deletePassenger(Long id);

    List<PassengerDTO> getAllPassengers();

    // Add this method
    PassengerDTO searchPassengerByID(Long id);
}