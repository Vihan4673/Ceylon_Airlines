package lk.ijes.backend.service.impl;

import lk.ijes.backend.dto.BaggageDTO;
import lk.ijes.backend.entity.Baggage;
import lk.ijes.backend.repository.BaggageRepository;
import lk.ijes.backend.service.BaggageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BaggageServiceImpl implements BaggageService {

    private final BaggageRepository repository;

    @Override
    public BaggageDTO saveBaggage(BaggageDTO dto) {
        Baggage baggage = new Baggage();
        baggage.setPassenger(dto.getPassenger());
        baggage.setPassportNo(dto.getPassportNo());
        baggage.setFlightNo(dto.getFlightNo());
        baggage.setTagId(dto.getTagId());
        baggage.setStatus(dto.getStatus() != null ? dto.getStatus() : "Checked");
        baggage.setCreatedAt(LocalDateTime.now());
        baggage.setUpdatedAt(LocalDateTime.now());
        repository.save(baggage);
        dto.setId(baggage.getId());
        dto.setCreatedAt(baggage.getCreatedAt());
        dto.setUpdatedAt(baggage.getUpdatedAt());
        return dto;
    }

    @Override
    public List<BaggageDTO> getAllBaggages() {
        return repository.findAll().stream().map(b -> new BaggageDTO(
                b.getId(),
                b.getPassportNo(),
                b.getPassenger(),
                b.getFlightNo(),
                b.getTagId(),
                b.getStatus(),
                b.getCreatedAt(),
                b.getUpdatedAt()
        )).collect(Collectors.toList());
    }

    @Override
    public BaggageDTO updateStatus(Long id, String status) {
        Baggage b = repository.findById(id).orElseThrow(() -> new RuntimeException("Baggage not found"));
        b.setStatus(status);
        b.setUpdatedAt(LocalDateTime.now());
        repository.save(b);
        return new BaggageDTO(
                b.getId(),
                b.getPassportNo(),
                b.getPassenger(),
                b.getFlightNo(),
                b.getTagId(),
                b.getStatus(),
                b.getCreatedAt(),
                b.getUpdatedAt()
        );
    }

    @Override
    public void deleteBaggage(Long id) {
        repository.deleteById(id);
    }
}