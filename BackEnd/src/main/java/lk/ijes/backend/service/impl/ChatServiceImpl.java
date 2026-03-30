package lk.ijes.backend.service.impl;

import lk.ijes.backend.dto.ChatRequest;
import lk.ijes.backend.dto.ChatResponse;
import lk.ijes.backend.entity.ChatMessage;
import lk.ijes.backend.entity.Flight;
import lk.ijes.backend.repository.ChatRepository;
import lk.ijes.backend.repository.FlightRepository;
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
    private final String GROQ_API_KEY = "";
    private final ChatRepository chatRepository;
    private final FlightRepository flightRepository;

    public ChatServiceImpl(ChatRepository chatRepository, FlightRepository flightRepository) {
        this.chatRepository = chatRepository;
        this.flightRepository = flightRepository;
        this.webClient = WebClient.builder()
                .baseUrl("https://api.groq.com/openai/v1/chat/completions")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + GROQ_API_KEY)
                .build();
    }

    @Override
    public ChatResponse getAIReply(ChatRequest request) {
        String userMessage = request.getMessage().trim();

        if (userMessage.equalsIgnoreCase("hi") || userMessage.equalsIgnoreCase("hello") || userMessage.equalsIgnoreCase("start")) {
            String greeting = "Welcome to Ceylon Airlines! Please select your preferred language to continue:\n" +
                    "1. English\n" +
                    "2. සිංහල (Sinhala)";
            return new ChatResponse(greeting);
        }

        ChatMessage userMsg = new ChatMessage();
        userMsg.setSender("USER");
        userMsg.setMessage(userMessage);
        chatRepository.save(userMsg);
        String languageInstruction = "Determine the language used by the user. If they talk in Sinhala, reply in Sinhala. If English, reply in English.";

        if (userMessage.contains("සිංහල") || userMessage.equals("2")) {
            languageInstruction = "The user has selected Sinhala. Respond strictly in Sinhala language only.";
        } else if (userMessage.equalsIgnoreCase("english") || userMessage.equals("1")) {
            languageInstruction = "The user has selected English. Respond strictly in English language only.";
        }

        List<Flight> availableFlights = flightRepository.findAll();
        StringBuilder flightContext = new StringBuilder("Current Ceylon Airlines Flight Schedule Data:\n");
        for (Flight f : availableFlights) {
            flightContext.append(String.format(
                    "- Flight %s: From %s To %s. Date: %s, Dep: %s, Arr: %s. Price: Eco %s, Biz %s. Status: %s\n",
                    f.getFlightNumber(), f.getDeparture(), f.getArrival(), f.getFlightDate(),
                    f.getDepartureTime(), f.getArrivalTime(), f.getEconomyFare(), f.getBusinessFare(), f.getStatus()
            ));
        }

        Map<String, Object> body = Map.of(
                "model", "llama-3.3-70b-versatile",
                "messages", List.of(
                        Map.of("role", "system", "content",
                                "You are an official AI assistant for Ceylon Airlines. " +
                                        languageInstruction +
                                        " Use the provided flight data to answer queries. " +
                                        "Be polite and professional. If no flights match a destination, inform them nicely.\n\n" +
                                        flightContext.toString()),
                        Map.of("role", "user", "content", userMessage)
                ),
                "max_tokens", 800,
                "temperature", 0.5
        );

        String aiReply = "";
        try {
            Map response = webClient.post()
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("choices")) {
                List choices = (List) response.get("choices");
                Map choice = (Map) choices.get(0);
                Map message = (Map) choice.get("message");
                aiReply = (String) message.get("content");
            }
        } catch (WebClientResponseException e) {
            aiReply = "Error from AI Provider: " + e.getStatusCode();
        } catch (Exception e) {
            aiReply = "සමාවන්න, පද්ධතියේ දෝෂයක් පවතී. / Sorry, a system error occurred.";
        }
        ChatMessage botMsg = new ChatMessage();
        botMsg.setSender("BOT");
        botMsg.setMessage(aiReply);
        chatRepository.save(botMsg);

        return new ChatResponse(aiReply);
    }
}