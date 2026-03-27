package lk.ijes.backend.repository;

import lk.ijes.backend.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<ChatMessage, Long> {
}