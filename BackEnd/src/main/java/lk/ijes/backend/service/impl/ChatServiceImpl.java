package lk.ijes.backend.service.impl;

import lk.ijes.backend.dto.ChatRequest;
import lk.ijes.backend.dto.ChatResponse;
import lk.ijes.backend.entity.ChatMessage;
import lk.ijes.backend.repository.ChatRepository;
import lk.ijes.backend.service.ChatService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;

@Service
public class ChatServiceImpl implements ChatService {

    private final WebClient webClient;
    private final String API_KEY = "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"; // ✅ Replace with your valid OpenAI key
    private final ChatRepository chatRepository;

    public ChatServiceImpl(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
        this.webClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1/chat/completions")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + API_KEY)
                .build();
    }

    @Override
    public ChatResponse getAIReply(ChatRequest request) {

        // Save user message
        ChatMessage userMsg = new ChatMessage();
        userMsg.setSender("USER");
        userMsg.setMessage(request.getMessage());
        chatRepository.save(userMsg);

        // Request body for GPT-4
        Map<String, Object> body = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", new Object[]{
                        Map.of("role", "system", "content", "You are a helpful assistant for Ceylone Airlines. Respond in Sinhala if possible."),
                        Map.of("role", "user", "content", request.getMessage())
                },
                "max_tokens", 200
        );

        String aiReply = "";

        try {
            // Call OpenAI API
            Map<String, Object> response = webClient.post()
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            Map choice = ((Map)((List)response.get("choices")).get(0));
            Map message = (Map) choice.get("message");
            aiReply = (String) message.get("content");

        } catch (WebClientResponseException e) {
            aiReply = "AI server error: " + e.getStatusCode() + " " + e.getResponseBodyAsString();
        } catch (Exception e) {
            aiReply = "AI server error: " + e.getMessage();
        }

        // Save bot reply
        ChatMessage botMsg = new ChatMessage();
        botMsg.setSender("BOT");
        botMsg.setMessage(aiReply);
        chatRepository.save(botMsg);

        return new ChatResponse(aiReply);
    }
}