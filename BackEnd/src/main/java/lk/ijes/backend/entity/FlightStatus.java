package lk.ijes.backend.entity;

import com.fasterxml.jackson.annotation.JsonValue;

public enum FlightStatus {

    ON_TIME("On Time"),
    DELAYED("Delayed"),
    CANCELLED("Cancelled");

    private final String displayName;

    FlightStatus(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue // ensures JSON serialization uses displayName
    public String getDisplayName() {
        return displayName;
    }
}