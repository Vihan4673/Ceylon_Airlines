package lk.ijes.backend.service;


import lk.ijes.backend.dto.AdDTO;

import java.util.List;

public interface AdService {

    AdDTO createAd(AdDTO adDTO);

    List<AdDTO> getAllAds();

    List<AdDTO> getActiveAds();

    void deleteAd(Long id);

}