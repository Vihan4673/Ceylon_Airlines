package lk.ijes.backend.service.impl;

import lk.ijes.backend.dto.BaggageDTO;
import lk.ijes.backend.entity.Baggage;
import lk.ijes.backend.repository.BaggageRepository;
import lk.ijes.backend.service.BaggageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BaggageServiceImpl implements BaggageService {

    private final BaggageRepository repository;
    @Override
    @Transactional
    public List<BaggageDTO> saveBaggage(BaggageDTO dto) {
        int bagCount = (dto.getBagCount() != null && dto.getBagCount() > 0) ? dto.getBagCount() : 1;
        List<Baggage> baggageEntities = new ArrayList<>();

        for (int i = 0; i < bagCount; i++) {
            Baggage baggage = new Baggage();
            baggage.setPassenger(dto.getPassenger());
            baggage.setPassportNo(dto.getPassportNo());
            baggage.setFlightNo(dto.getFlightNo());
            baggage.setPnr(dto.getPnr());
            baggage.setStatus(dto.getStatus() != null ? dto.getStatus() : "Checked");
            baggage.setTagId(generateTag(dto.getPassportNo(), dto.getFlightNo()));

            baggageEntities.add(baggage);
        }

        List<Baggage> savedEntities = repository.saveAll(baggageEntities);

        return savedEntities.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<BaggageDTO> getAllBaggages() {
        return repository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BaggageDTO updateStatus(Long id, String status) {
        Baggage b = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Baggage record not found with ID: " + id));

        b.setStatus(status);

        return convertToDTO(repository.save(b));
    }

    @Override
    public void deleteBaggage(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Cannot delete. Baggage ID not found: " + id);
        }
        repository.deleteById(id);
    }

    private BaggageDTO convertToDTO(Baggage b) {
        return new BaggageDTO(
                b.getId(),
                b.getPassportNo(),
                b.getPassenger(),
                b.getFlightNo(),
                b.getTagId(),
                b.getPnr(),
                b.getStatus(),
                1,
                b.getCreatedAt(),
                b.getUpdatedAt()
        );
    }

    private String generateTag(String passportNo, String flightNo) {
        if (passportNo == null || flightNo == null) return "N/A";

        String flightPart = flightNo.length() >= 3 ? flightNo.substring(0, 3) : flightNo;
        String passportPart = passportNo.length() >= 4 ? passportNo.substring(passportNo.length() - 4) : passportNo;

        int random = (int) (1000 + Math.random() * 9000);

        return (flightPart + "-" + passportPart + "-" + random).toUpperCase();
    }
}