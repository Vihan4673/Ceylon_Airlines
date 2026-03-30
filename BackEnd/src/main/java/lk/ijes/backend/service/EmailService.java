package lk.ijes.backend.service;

import lk.ijes.backend.dto.BookingDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendBookingConfirmation(String toEmail, BookingDTO booking) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("vihanvimen96@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Booking Confirmed - " + booking.getPnr());

        String body = "Dear " + booking.getPassenger() + ",\n\n" +
                "Your flight booking is successful!\n" +
                "PNR: " + booking.getPnr() + "\n" +
                "Flight: " + booking.getFlightNumber() + "\n" +
                "From: " + booking.getOrigin() + " To: " + booking.getDestination() + "\n" +
                "Date: " + booking.getDepartureDate() + "\n" +
                "Price: $" + booking.getPrice() + "\n\n" +
                "Thank you for flying with Ceylon Airlines!";

        message.setText(body);

        mailSender.send(message);
        System.out.println("✅ Booking confirmation email sent to " + toEmail);
    }
}