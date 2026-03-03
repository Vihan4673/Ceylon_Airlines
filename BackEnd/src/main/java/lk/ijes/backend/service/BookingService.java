package lk.ijes.backend.service;

import lk.ijes.backend.dto.BookingDTO;
import java.util.List;

public interface BookingService {

    BookingDTO saveBooking(BookingDTO bookingDTO);

    BookingDTO updateBooking(BookingDTO bookingDTO);

    void deleteBooking(Long id);

    List<BookingDTO> getAllBookings();

    BookingDTO searchBookingByID(Long id);
}