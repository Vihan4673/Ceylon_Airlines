package lk.ijes.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class BaggageReportDTO {
    private String passengerName;
    private String email;
    private String passportNumber;
    private String flightNumber;
    private String description;

    private MultipartFile photo;
}