package lk.ijes.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String sender; // "USER" or "BOT"

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
}