package lk.ijes.backend.service.impl;

import lk.ijes.backend.dto.AdDTO;
import lk.ijes.backend.entity.Ad;
import lk.ijes.backend.repository.AdRepository;
import lk.ijes.backend.service.AdService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
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
        return adRepository.findByActiveTrue()
                .stream()
                .map(ad -> modelMapper.map(ad, AdDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAd(Long id) {
        adRepository.deleteById(id);
    }
}