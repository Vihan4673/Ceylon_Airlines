package lk.ijes.backend.service;


import lk.ijes.backend.dto.ChatRequest;
import lk.ijes.backend.dto.ChatResponse;

public interface ChatService {
    ChatResponse getAIReply(ChatRequest request);
}