package lk.ijes.backend.entity;

public enum BookingStatus {

    CONFIRMED("Confirmed"),
    CANCELLED("Cancelled"),
    PENDING("Pending");

    private final String displayName;

    BookingStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}