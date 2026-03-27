package lk.ijes.backend.controller;

import lk.ijes.backend.dto.ChatRequest;
import lk.ijes.backend.dto.ChatResponse;
import lk.ijes.backend.service.ChatService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(
        originPatterns = {"http://localhost:*", "http://127.0.0.1:*"},
        allowCredentials = "true"
)
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {
        return chatService.getAIReply(request);
    }
}