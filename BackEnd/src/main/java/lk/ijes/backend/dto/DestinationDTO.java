package lk.ijes.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DestinationDTO {
    private String from;      // origin city
    private String to;        // destination city
    private String fromCode;  // origin airport code
    private String toCode;    // destination airport code
}