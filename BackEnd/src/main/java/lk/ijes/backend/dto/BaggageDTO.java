package lk.ijes.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BaggageDTO {
    private Long id;
    private String passportNo;
    private String passenger;
    private String flightNo;
    private String tagId;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}