package lk.ijes.backend.service;

import lk.ijes.backend.dto.BookingDTO;
import java.util.List;

public interface BookingService {

    BookingDTO saveBooking(BookingDTO bookingDTO);

    BookingDTO updateBooking(Long id, BookingDTO bookingDTO); // ✅ FIXED

    // 🔥🔥🔥 ================= UPDATE BOOKING BY PNR (NEW) ================= 🔥🔥🔥
    BookingDTO updateBookingByPnr(String pnr, BookingDTO bookingDTO);

    void deleteBooking(Long id);

    List<BookingDTO> getAllBookings();

    BookingDTO searchBookingByID(Long id);
}