package lk.ijes.backend.service;

import lk.ijes.backend.dto.BookingDTO;
import java.util.List;

public interface BookingService {

    BookingDTO saveBooking(BookingDTO bookingDTO);

    BookingDTO updateBooking(Long id, BookingDTO bookingDTO);

    BookingDTO updateBookingByPnr(String pnr, BookingDTO bookingDTO);

    void deleteBooking(Long id);

    List<BookingDTO> getAllBookings();

    BookingDTO searchBookingByID(Long id);

    BookingDTO getBookingByPnr(String pnr);
}