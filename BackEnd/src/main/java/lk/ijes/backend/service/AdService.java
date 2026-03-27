package lk.ijes.backend.service;

import lk.ijes.backend.dto.AdDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface AdService {

    AdDTO createAd(AdDTO adDTO);

    List<AdDTO> getAllAds();

    List<AdDTO> getActiveAds();

    void deleteAd(Long id);

    AdDTO saveAdWithImage(MultipartFile file,
                          String title,
                          String description,
                          String placement,
                          String startDate,
                          String endDate) throws IOException;
}