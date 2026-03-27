package lk.ijes.backend.dto;

import lombok.Data;

@Data
public class ChatResponse {
    private String reply;

    public ChatResponse(String reply) {
        this.reply = reply;
    }
}