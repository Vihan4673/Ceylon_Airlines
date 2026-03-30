package lk.ijes.backend.controller;

import lk.ijes.backend.dto.BaggageReportDTO;
import lk.ijes.backend.entity.BaggageReport;
import lk.ijes.backend.service.BaggageReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/baggage")
public class BaggageReportController {

    @Autowired
    private BaggageReportService baggageService;

    @PostMapping(value = "/report", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> submitBaggageReport(
            @RequestParam("passengerName") String name,
            @RequestParam("email") String email,
            @RequestParam("passportNumber") String passport,
            @RequestParam("flightNumber") String flight,
            @RequestParam("description") String description,
            @RequestParam(value = "photo", required = false) MultipartFile photo
    ) {
        try {
            BaggageReportDTO dto = new BaggageReportDTO();
            dto.setPassengerName(name);
            dto.setEmail(email);
            dto.setPassportNumber(passport);
            dto.setFlightNumber(flight);
            dto.setDescription(description);
            dto.setPhoto(photo);

            BaggageReport savedReport = baggageService.saveReport(dto);
            return new ResponseEntity<>(savedReport, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>("Error submitting report: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/all")
    public ResponseEntity<List<BaggageReport>> getAllReports() {
        List<BaggageReport> reports = baggageService.getAllReports();
        return ResponseEntity.ok(reports);
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateReportStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> updateData) {
        try {
            String status = updateData.get("status");
            String adminComment = updateData.get("adminComment");

            baggageService.updateStatus(id, status, adminComment);
            return ResponseEntity.ok("Incident status updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/health")
    public String healthCheck() {
        return "Ceylon Airlines Baggage Service is running!";
    }
}