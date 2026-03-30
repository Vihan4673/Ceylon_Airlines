package lk.ijes.backend.service;

import lk.ijes.backend.dto.BaggageDTO;
import java.util.List;

public interface BaggageService {

    List<BaggageDTO> saveBaggage(BaggageDTO dto);

    List<BaggageDTO> getAllBaggages();

    BaggageDTO updateStatus(Long id, String status);

    void deleteBaggage(Long id);
}