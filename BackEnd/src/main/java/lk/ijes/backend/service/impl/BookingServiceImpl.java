package lk.ijes.backend.service.impl;

import lk.ijes.backend.dto.BookingDTO;
import lk.ijes.backend.entity.Booking;
import lk.ijes.backend.entity.Flight;

import lk.ijes.backend.repository.BookingRepository;
import lk.ijes.backend.repository.FlightRepository;
import lk.ijes.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;
    private final ModelMapper modelMapper;

    @Override
    public void saveBooking(BookingDTO bookingDTO) {

        // Check Flight exists
        Flight flight = flightRepository.findById(bookingDTO.getFlightId())
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        // Check Seat already booked
        if (bookingRepository.existsByFlight_IdAndSeat(
                bookingDTO.getFlightId(),
                bookingDTO.getSeat())) {

            throw new RuntimeException("Seat already booked!");
        }

        Booking booking = new Booking();
        booking.setPnr(bookingDTO.getPnr());
        booking.setPassenger(bookingDTO.getPassenger());
        booking.setSeat(bookingDTO.getSeat());
        booking.setFlight(flight);

        bookingRepository.save(booking);
    }

    @Override
    public void updateBooking(BookingDTO bookingDTO) {

        Booking booking = bookingRepository.findById(bookingDTO.getId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Flight flight = flightRepository.findById(bookingDTO.getFlightId())
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        booking.setPnr(bookingDTO.getPnr());
        booking.setPassenger(bookingDTO.getPassenger());
        booking.setSeat(bookingDTO.getSeat());
        booking.setFlight(flight);

        bookingRepository.save(booking);
    }

    @Override
    public void deleteBooking(Long id) {

        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found");
        }

        bookingRepository.deleteById(id);
    }

    @Override
    public List<BookingDTO> getAllBookings() {

        return bookingRepository.findAll()
                .stream()
                .map(booking -> {
                    BookingDTO dto = new BookingDTO();
                    dto.setId(booking.getId());
                    dto.setPnr(booking.getPnr());
                    dto.setPassenger(booking.getPassenger());
                    dto.setSeat(booking.getSeat());
                    dto.setFlightId(booking.getFlight().getId());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public BookingDTO searchBookingByID(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setPnr(booking.getPnr());
        dto.setPassenger(booking.getPassenger());
        dto.setSeat(booking.getSeat());
        dto.setFlightId(booking.getFlight().getId());

        return dto;
    }
}