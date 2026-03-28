package lk.ijes.backend.service.impl;

import lk.ijes.backend.dto.BookingDTO;
import lk.ijes.backend.entity.Booking;
import lk.ijes.backend.repository.BookingRepository;
import lk.ijes.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ModelMapper modelMapper;

    // ================= CREATE BOOKING =================
    @Override
    public BookingDTO saveBooking(BookingDTO bookingDTO) {
        if (bookingRepository.existsByFlightNumberAndSeat(
                bookingDTO.getFlightNumber(),
                bookingDTO.getSeat())) {
            throw new RuntimeException(
                    "Seat " + bookingDTO.getSeat() +
                            " is already booked for flight " + bookingDTO.getFlightNumber()
            );
        }

        Booking booking = modelMapper.map(bookingDTO, Booking.class);
        booking.setPnr(generatePNR());

        if (booking.getBookingDate() == null) {
            booking.setBookingDate(LocalDate.now());
        }

        if (booking.getStatus() == null) booking.setStatus("CONFIRMED");
        if (booking.getPaid() == null) booking.setPaid(false);

        Booking savedBooking = bookingRepository.save(booking);
        return modelMapper.map(savedBooking, BookingDTO.class);
    }

    // ================= UPDATE BOOKING BY ID =================
    @Override
    public BookingDTO updateBooking(Long id, BookingDTO bookingDTO) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        updateBookingFields(booking, bookingDTO);

        Booking updatedBooking = bookingRepository.save(booking);
        return modelMapper.map(updatedBooking, BookingDTO.class);
    }

    // 🔥🔥🔥 ================= UPDATE BOOKING BY PNR (NEW) ================= 🔥🔥🔥
    @Override
    public BookingDTO updateBookingByPnr(String pnr, BookingDTO bookingDTO) {
        Booking booking = bookingRepository.findByPnr(pnr)
                .orElseThrow(() -> new RuntimeException("Booking not found with PNR: " + pnr));

        if (bookingDTO.getPaid() != null) {
            booking.setPaid(bookingDTO.getPaid());
        }

        if (bookingDTO.getStatus() != null) {
            booking.setStatus(bookingDTO.getStatus());
        }

        // ✅ Also update email if present
        if (bookingDTO.getEmail() != null) {
            booking.setEmail(bookingDTO.getEmail());
        }

        Booking updatedBooking = bookingRepository.save(booking);
        return modelMapper.map(updatedBooking, BookingDTO.class);
    }

    // ================= DELETE BOOKING =================
    @Override
    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found");
        }
        bookingRepository.deleteById(id);
    }

    // ================= GET ALL BOOKINGS =================
    @Override
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(booking -> modelMapper.map(booking, BookingDTO.class))
                .collect(Collectors.toList());
    }

    // ================= GET BOOKING BY ID =================
    @Override
    public BookingDTO searchBookingByID(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return modelMapper.map(booking, BookingDTO.class);
    }

    // ================= HELPERS =================
    private void updateBookingFields(Booking booking, BookingDTO bookingDTO) {
        booking.setPassenger(bookingDTO.getPassenger());
        booking.setSeat(bookingDTO.getSeat());
        booking.setOrigin(bookingDTO.getOrigin());
        booking.setDestination(bookingDTO.getDestination());
        booking.setTravelClass(bookingDTO.getTravelClass());
        booking.setPrice(bookingDTO.getPrice());
        booking.setFlightNumber(bookingDTO.getFlightNumber());

        if (bookingDTO.getPaid() != null) booking.setPaid(bookingDTO.getPaid());
        if (bookingDTO.getStatus() != null) booking.setStatus(bookingDTO.getStatus());
        if (bookingDTO.getDepartureDate() != null) booking.setDepartureDate(bookingDTO.getDepartureDate());

        // ✅ Also update email here for general updates
        if (bookingDTO.getEmail() != null) {
            booking.setEmail(bookingDTO.getEmail());
        }
    }

    private String generatePNR() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            int idx = (int) (Math.random() * chars.length());
            sb.append(chars.charAt(idx));
        }
        return sb.toString();
    }
}