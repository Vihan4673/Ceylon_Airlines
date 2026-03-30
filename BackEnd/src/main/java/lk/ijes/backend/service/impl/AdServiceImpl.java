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
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdServiceImpl implements AdService {

    private final AdRepository adRepository;
    private final ModelMapper modelMapper;
    private final Path uploadDir = Paths.get("uploads");

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
    public AdDTO saveAdWithImage(MultipartFile file, String title, String description,
                                 String placement, String startDate, String endDate) throws IOException {

        String imageUrl = null;
        if (file != null && !file.isEmpty()) {
            imageUrl = saveFile(file);
        }

        Ad ad = new Ad();
        updateAdFields(ad, title, description, placement, startDate, endDate, imageUrl);
        ad.setActive(true);

        return modelMapper.map(adRepository.save(ad), AdDTO.class);
    }

    @Override
    public AdDTO updateAdWithImage(Long id, MultipartFile file, String title, String description,
                                   String placement, String startDate, String endDate) throws IOException {

        Ad existingAd = adRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ad not found with id: " + id));

        String newImageUrl = existingAd.getImageUrl();

        if (file != null && !file.isEmpty()) {
            newImageUrl = saveFile(file);
        }

        updateAdFields(existingAd, title, description, placement, startDate, endDate, newImageUrl);

        return modelMapper.map(adRepository.save(existingAd), AdDTO.class);
    }

    private String saveFile(MultipartFile file) throws IOException {
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return "/uploads/" + filename;
    }

    private void updateAdFields(Ad ad, String title, String description, String placement,
                                String startDate, String endDate, String imageUrl) {
        try {
            ad.setTitle(title);
            ad.setDescription(description);
            ad.setPlacement(placement);
            ad.setStartDate(LocalDate.parse(startDate));
            ad.setEndDate(LocalDate.parse(endDate));
            if (imageUrl != null) {
                ad.setImageUrl(imageUrl);
            }
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format. Use YYYY-MM-DD");
        }
    }
}