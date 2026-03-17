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

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;
    private final ModelMapper modelMapper;

    // ================= CREATE BOOKING =================
    @Override
    public BookingDTO saveBooking(BookingDTO bookingDTO) {

        Flight flight = flightRepository.findById(bookingDTO.getFlightId())
                .orElseThrow(() -> new RuntimeException("Flight with ID " + bookingDTO.getFlightId() + " not found"));

        // Prevent duplicate seat booking
        if (bookingRepository.existsByFlight_IdAndSeat(flight.getId(), bookingDTO.getSeat())) {
            throw new RuntimeException("Seat " + bookingDTO.getSeat() + " is already booked for this flight");
        }

        // Map DTO to entity
        Booking booking = modelMapper.map(bookingDTO, Booking.class);
        booking.setFlight(flight);

        // Auto-generate PNR if empty
        if (booking.getPnr() == null || booking.getPnr().isEmpty()) {
            booking.setPnr(UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        }

        // Set default values
        booking.setBookingDate(LocalDate.now());
        if (booking.getDepartureDate() == null) booking.setDepartureDate(flight.getDate());
        if (booking.getStatus() == null) booking.setStatus("CONFIRMED");
        if (booking.getPaid() == null) booking.setPaid(false);

        Booking savedBooking = bookingRepository.save(booking);

        // Map back to DTO
        BookingDTO dto = modelMapper.map(savedBooking, BookingDTO.class);
        dto.setFlightId(flight.getId());
        return dto;
    }

    // ================= UPDATE BOOKING =================
    @Override
    public BookingDTO updateBooking(BookingDTO bookingDTO) {

        Booking booking = bookingRepository.findById(bookingDTO.getId())
                .orElseThrow(() -> new RuntimeException("Booking with ID " + bookingDTO.getId() + " not found"));

        Flight flight = flightRepository.findById(bookingDTO.getFlightId())
                .orElseThrow(() -> new RuntimeException("Flight with ID " + bookingDTO.getFlightId() + " not found"));

        // Prevent double booking if seat is changed
        if (!booking.getSeat().equals(bookingDTO.getSeat()) &&
                bookingRepository.existsByFlight_IdAndSeat(flight.getId(), bookingDTO.getSeat())) {
            throw new RuntimeException("Seat " + bookingDTO.getSeat() + " is already booked for this flight");
        }

        booking.setPnr(bookingDTO.getPnr() != null ? bookingDTO.getPnr() : booking.getPnr());
        booking.setPassenger(bookingDTO.getPassenger());
        booking.setSeat(bookingDTO.getSeat());
        booking.setFlight(flight);
        booking.setFrom(bookingDTO.getFrom());
        booking.setTo(bookingDTO.getTo());
        booking.setTravelClass(bookingDTO.getTravelClass());
        booking.setPrice(bookingDTO.getPrice());
        booking.setPaid(bookingDTO.getPaid() != null ? bookingDTO.getPaid() : booking.getPaid());
        booking.setStatus(bookingDTO.getStatus() != null ? bookingDTO.getStatus() : booking.getStatus());
        if (bookingDTO.getDepartureDate() != null) booking.setDepartureDate(bookingDTO.getDepartureDate());

        Booking updatedBooking = bookingRepository.save(booking);

        BookingDTO dto = modelMapper.map(updatedBooking, BookingDTO.class);
        dto.setFlightId(flight.getId());
        return dto;
    }

    // ================= DELETE BOOKING =================
    @Override
    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking with ID " + id + " not found");
        }
        bookingRepository.deleteById(id);
    }

    // ================= GET ALL BOOKINGS =================
    @Override
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(booking -> {
                    BookingDTO dto = modelMapper.map(booking, BookingDTO.class);
                    dto.setFlightId(booking.getFlight().getId());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // ================= GET BOOKING BY ID =================
    @Override
    public BookingDTO searchBookingByID(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking with ID " + id + " not found"));

        BookingDTO dto = modelMapper.map(booking, BookingDTO.class);
        dto.setFlightId(booking.getFlight().getId());
        return dto;
    }
}