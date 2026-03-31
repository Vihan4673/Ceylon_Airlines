package lk.ijes.backend.service;

import lk.ijes.backend.dto.BaggageReportDTO;
import lk.ijes.backend.entity.BaggageReport;

import java.io.IOException;
import java.util.List;

public interface BaggageReportService {

    /**
     * මගියෙකු විසින් එවන Baggage Report එක දත්ත ගබඩාවේ සුරැකීම සහ පින්තූරය (Photo) Save කිරීම.
     */
    BaggageReport saveReport(BaggageReportDTO dto) throws IOException;

    /**
     * පද්ධතියේ ඇති සියලුම Baggage Reports ලැයිස්තුවක් ලෙස ලබා ගැනීම (Admin Dashboard සඳහා).
     */
    List<BaggageReport> getAllReports();

    /**
     * ලබා දී ඇති ID එකට අදාළව Report එකක තත්ත්වය (Status) සහ Admin ගේ සටහන (Comment) Update කිරීම.
     * @param id - Report ID
     * @param status - New status (e.g., Approved, Rejected, Processing)
     * @param adminComment - Official message to the passenger
     */
    void updateStatus(Long id, String status, String adminComment);

    /**
     * නිශ්චිත ID එකක් මගින් එක් Report එකක සම්පූර්ණ විස්තර ලබා ගැනීම.
     */
    BaggageReport getReportById(Long id);
}