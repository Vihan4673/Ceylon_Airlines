package lk.ijes.backend.service;

import lk.ijes.backend.dto.BaggageDTO;
import lk.ijes.backend.entity.Baggage;

import java.util.List;

public interface BaggageService {
    BaggageDTO saveBaggage(BaggageDTO dto);
    List<BaggageDTO> getAllBaggages();
    BaggageDTO updateStatus(Long id, String status);
    void deleteBaggage(Long id);
}