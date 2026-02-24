package lk.ijes.backend.service.impl;

import lombok.RequiredArgsConstructor;
import lk.ijes.backend.entity.BaggageClaim;
import lk.ijes.backend.repository.BaggageClaimRepository;
import lk.ijes.backend.service.BaggageClaimService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BaggageClaimServiceImpl implements BaggageClaimService {

    private final BaggageClaimRepository repository;

    @Override
    public String saveClaim(String baggageTagId,
                            String issueType,
                            String description,
                            MultipartFile image) throws IOException {

        String uploadDir = System.getProperty("user.dir") + "/uploads/";
        File uploadFolder = new File(uploadDir);

        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }

        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + fileName);

        Files.write(filePath, image.getBytes());

        BaggageClaim claim = new BaggageClaim();
        claim.setBaggageTagId(baggageTagId);
        claim.setIssueType(issueType);
        claim.setDescription(description);
        claim.setImagePath(fileName);
        claim.setStatus("PENDING");

        repository.save(claim);

        return "Claim Submitted Successfully";
    }

    @Override
    public List<BaggageClaim> getAllClaims() {
        return repository.findAll();
    }
}