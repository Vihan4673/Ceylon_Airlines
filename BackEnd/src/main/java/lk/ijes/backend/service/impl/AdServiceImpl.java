package lk.ijes.backend.service.impl;

import lk.ijes.backend.dto.AdDTO;
import lk.ijes.backend.entity.Ad;
import lk.ijes.backend.repository.AdRepository;
import lk.ijes.backend.service.AdService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdServiceImpl implements AdService {

    private final AdRepository adRepository;
    private final ModelMapper modelMapper;

    @Override
    public AdDTO createAd(AdDTO adDTO) {
        Ad ad = modelMapper.map(adDTO, Ad.class);
        Ad savedAd = adRepository.save(ad);
        return modelMapper.map(savedAd, AdDTO.class);
    }

    @Override
    public List<AdDTO> getAllAds() {
        return adRepository.findAll()
                .stream()
                .map(ad -> modelMapper.map(ad, AdDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<AdDTO> getActiveAds() {
        // Get ads that are active AND within date range
        LocalDate today = LocalDate.now();
        return adRepository.findAll()
                .stream()
                .filter(ad -> ad.isActive() &&
                        (ad.getStartDate() == null || !ad.getStartDate().isAfter(today)) &&
                        (ad.getEndDate() == null || !ad.getEndDate().isBefore(today)))
                .map(ad -> modelMapper.map(ad, AdDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAd(Long id) {
        adRepository.deleteById(id);
    }

    @Override
    public AdDTO saveAdWithImage(MultipartFile file,
                                 String title,
                                 String description,
                                 String placement,
                                 String startDate,
                                 String endDate) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IOException("File is empty");
        }

        // ✅ Create uploads folder if it doesn't exist
        Path uploadDir = Paths.get("uploads");
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        // ✅ Save the file with unique name
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // ✅ Create Ad entity
        Ad ad = new Ad();
        ad.setTitle(title);
        ad.setDescription(description);
        ad.setPlacement(placement);
        ad.setStartDate(LocalDate.parse(startDate));
        ad.setEndDate(LocalDate.parse(endDate));
        ad.setImageUrl("/uploads/" + filename); // path for frontend
        ad.setActive(true); // ✅ make active by default

        // ✅ Save Ad to DB
        Ad savedAd = adRepository.save(ad);

        // ✅ Map to DTO and return
        return modelMapper.map(savedAd, AdDTO.class);
    }
}