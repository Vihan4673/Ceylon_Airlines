// =====================================================
// GET DATA (ALWAYS FRESH 🔥)
// =====================================================
function getFlightState() {
    return JSON.parse(localStorage.getItem("selectedFlight")) || {};
}

function getPassenger() {
    return JSON.parse(localStorage.getItem("passengerInfo")) || {};
}

// =====================================================
// FORMAT DATE
// =====================================================
function formatFullDate(dateStr) {
    if (!dateStr) return "Date not available";
    return new Date(dateStr).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

// =====================================================
// HELPER
// =====================================================
function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value || "";
}

function generatePNR() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// =====================================================
// UPDATE UI
// =====================================================
function updateFlightSummary() {
    const flight = getFlightState();

    setText(
        "flight-route",
        `${flight.from || ""} to ${flight.to || ""} - ${formatFullDate(
            flight.date || flight.flightDate
        )}`
    );
    setText("departure-code", flight.from);
    setText("arrival-code", flight.to);
    setText("departure-time", flight.departureTime);
    setText("arrival-time", flight.arrivalTime);
    setText("departure-airport", flight.departureAirport || flight.from);
    setText("arrival-airport", flight.arrivalAirport || flight.to);
    setText("flight-stops", flight.stops || "Non-stop");
    setText("flight-duration", flight.duration);
    setText("summary-seat-number", flight.selectedSeat || "Not selected");
    setText("footer-seat-id", flight.selectedSeat || "--");
    setText("fare-class", `🎫 ${(flight.type || "ECO").toUpperCase()} FLEX`);
    setText("total-price", `LKR ${calculateTotalPrice(flight)}`);
}

function calculateTotalPrice(flight) {
    const totalPassengers =
        (parseInt(flight.adults || 0)) +
        (parseInt(flight.children || 0)) +
        (parseInt(flight.infants || 0));
    const price = parseFloat(flight.price?.toString().replace(/[^0-9.-]+/g, "")) || 0;
    return (totalPassengers * price).toLocaleString("en-LK");
}

function updatePassengerDetails() {
    const passenger = getPassenger();
    const nameEl = document.querySelector(".card span.font-bold.text-blue-900");
    if (nameEl)
        nameEl.innerText = `${passenger.title || ""} ${passenger.firstName || ""} ${
            passenger.lastName || ""
        }`.trim();

    const info = document.querySelectorAll(".text-xs.text-gray-500");
    if (info.length >= 3) {
        info[0].innerText = passenger.email || "N/A";
        info[1].innerText = passenger.phoneNumber || "N/A";
        info[2].innerText = passenger.type || "Adult";
    }
}

function updateSeatCard() {
    const flight = getFlightState();
    const seatEl = document.getElementById("checkout-seat-number");
    const btn = document.getElementById("seat-action-btn");

    if (seatEl) seatEl.innerText = flight.selectedSeat || "Not selected";

    if (btn) {
        btn.innerText = flight.selectedSeat ? "Change your seat" : "Add seat";
        btn.onclick = () => (window.location.href = "../Pages/Seats.html");
    }
}

function updateHero() {
    const flight = getFlightState();
    const el = document.getElementById("hero-text");
    if (el) el.innerText = `${flight.from || ""} to ${flight.to || ""}`;
}

// =====================================================
// BOOKING FUNCTION (FIXED 🔥)
// =====================================================
async function bookSeatAndProceed() {
    const flight = getFlightState();
    const passenger = getPassenger();

    console.log("Flight object 👉", flight); // DEBUG

    if (!flight.flightNumber) return alert("Select flight first!");
    if (!flight.selectedSeat) return alert("Select seat first!");

    // ✅ Ensure departureDate exists
    const departureDate = flight.departureDate || flight.date || flight.flightDate;

    if (!departureDate) {
        alert("❌ Flight date missing!");
        console.error("Flight data:", flight);
        return;
    }

    const bookingDTO = {
        passenger: `${passenger.title || ""} ${passenger.firstName || ""} ${
            passenger.lastName || ""
        }`.trim(),
        flightNumber: flight.flightNumber,
        seat: flight.selectedSeat,

        // ✅ Correct date format for backend
        departureDate: new Date(departureDate).toISOString().split("T")[0],

        // ✅ Ensure enum uppercase
        travelClass: (flight.type || "ECONOMY").toUpperCase(),

        price: parseFloat(flight.price?.toString().replace(/[^0-9.-]+/g, "")) || 0,

        origin: flight.from || "",
        destination: flight.to || "",

        paid: false,
        status: "CONFIRMED"
    };

    console.log("Booking DTO 👉", bookingDTO); // DEBUG before sending

    try {
        const res = await fetch("http://localhost:8080/api/v1/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingDTO)
        });

        let data = null;
        try {
            data = await res.json();
        } catch (e) {
            console.warn("No JSON response");
        }

        if (res.ok) {
            alert("✅ Booking created!");
            if (data?.data) {
                localStorage.setItem("currentBooking", JSON.stringify(data.data));
                goToPayment(data.data.id);
            }
        } else {
            alert(data?.message || "Booking failed!");
        }
    } catch (err) {
        console.error(err);
        alert("❌ Server not reachable!");
    }
}

// =====================================================
// PAYMENT PAGE REDIRECT
// =====================================================
function goToPayment(bookingId) {
    localStorage.setItem("bookingIdForPayment", bookingId);
    window.location.href = "../Pages/Pyment.html";
}

// =====================================================
// PAYMENT SUCCESS FLOW
// =====================================================
async function markBookingPaid() {
    const bookingId = localStorage.getItem("bookingIdForPayment");
    if (!bookingId) return;

    try {
        const res = await fetch(`http://localhost:8080/api/v1/bookings/${bookingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentStatus: "PAID" })
        });
        const data = await res.json();
        if (res.ok) {
            alert("Payment successful! Booking updated.");
            localStorage.removeItem("bookingIdForPayment");
        } else {
            alert(data.message || "Failed to update payment status.");
        }
    } catch (err) {
        console.error(err);
        alert("Server error during payment update!");
    }
}

// =====================================================
// INIT
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
    updateSeatCard();
    updateFlightSummary();
    updatePassengerDetails();
    updateHero();

    const checkoutBtn = document.querySelector(".btn-primary");
    if (checkoutBtn) checkoutBtn.addEventListener("click", bookSeatAndProceed);
});