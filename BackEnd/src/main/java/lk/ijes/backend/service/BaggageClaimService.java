package lk.ijes.backend.service;

import lk.ijes.backend.entity.BaggageClaim;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BaggageClaimService {

    String saveClaim(String baggageTagId,
                     String issueType,
                     String description,
                     MultipartFile image) throws IOException;

    List<BaggageClaim> getAllClaims();
}