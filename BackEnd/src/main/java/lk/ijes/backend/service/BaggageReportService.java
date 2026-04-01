package lk.ijes.backend.service;

import lk.ijes.backend.dto.BaggageReportDTO;
import lk.ijes.backend.entity.BaggageReport;

import java.io.IOException;
import java.util.List;

public interface BaggageReportService {

    BaggageReport saveReport(BaggageReportDTO dto) throws IOException;
    List<BaggageReport> getAllReports();
    void updateStatus(Long id, String status, String adminComment);
    BaggageReport getReportById(Long id);
}