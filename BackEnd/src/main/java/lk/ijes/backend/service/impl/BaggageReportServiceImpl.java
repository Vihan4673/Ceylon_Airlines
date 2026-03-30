package lk.ijes.backend.service.impl;

import lk.ijes.backend.dto.BaggageReportDTO;
import lk.ijes.backend.entity.BaggageReport;
import lk.ijes.backend.repository.BaggageReportRepository;
import lk.ijes.backend.service.BaggageReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class BaggageReportServiceImpl implements BaggageReportService {

    @Autowired
    private BaggageReportRepository repository;

    @Autowired
    private JavaMailSender mailSender;

    private final String UPLOAD_DIR = "uploads" + File.separator + "baggage" + File.separator;

    @Override
    public BaggageReport saveReport(BaggageReportDTO dto) throws IOException {
        String photoPath = null;

        if (dto.getPhoto() != null && !dto.getPhoto().isEmpty()) {
            photoPath = saveImage(dto.getPhoto());
        }

        BaggageReport report = new BaggageReport();
        report.setPassengerName(dto.getPassengerName());
        report.setEmail(dto.getEmail());
        report.setPassportNumber(dto.getPassportNumber());
        report.setFlightNumber(dto.getFlightNumber());
        report.setDescription(dto.getDescription());
        report.setPhotoPath(photoPath);
        report.setStatus("Processing");

        BaggageReport savedReport = repository.save(report);

        sendEmail(dto.getEmail(),
                "Baggage Report Confirmation - Ceylon Airlines",
                "Dear " + dto.getPassengerName() + ",\n\n" +
                        "We have received your report for flight " + dto.getFlightNumber() + ".\n" +
                        "Our team is investigating. Reference ID: #CEY-" + savedReport.getId());

        return savedReport;
    }

    @Override
    public List<BaggageReport> getAllReports() {
        return repository.findAll();
    }

    @Override
    public void updateStatus(Long id, String status, String adminComment) {
        BaggageReport report = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with ID: " + id));

        report.setStatus(status);

        repository.save(report);
        String subject = "Update on your Baggage Claim - #" + id;
        String messageBody = "Dear " + report.getPassengerName() + ",\n\n" +
                "The status of your baggage claim has been updated to: " + status.toUpperCase() + ".\n" +
                "Message from Airline: " + adminComment + "\n\n" +
                "Regards,\nCeylon Airlines.";

        sendEmail(report.getEmail(), subject, messageBody);
    }

    @Override
    public BaggageReport getReportById(Long id) {
        return repository.findById(id).orElse(null);
    }

    private String saveImage(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);
        return "baggage/" + fileName;
    }

    private void sendEmail(String toEmail, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("ceylonairlines@gmail.com");
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Email sending failed for: " + toEmail);
        }
    }
}