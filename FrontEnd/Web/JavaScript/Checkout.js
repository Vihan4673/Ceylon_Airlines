// =====================================================
// GET DATA (ALWAYS FRESH 🔥)
// =====================================================
function getFlightState() {
    return JSON.parse(localStorage.getItem("selectedFlight")) || {};
}

function getPassenger() {
    return JSON.parse(
        localStorage.getItem("passengerInfo") ||
        localStorage.getItem("currentPassenger")
    ) || {};
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

// =====================================================
// UPDATE UI
// =====================================================
function updateFlightSummary() {
    const flight = getFlightState();

    setText(
        "flight-route",
        `${flight.from || ""} to ${flight.to || ""} - ${formatFullDate(flight.date || flight.flightDate)}`
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
        nameEl.innerText = `${passenger.title || ""} ${passenger.firstName || ""} ${passenger.lastName || ""}`.trim();

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
// BOOKING FUNCTION (FIXED FOR PNR HANDLING 🔥)
// =====================================================
async function bookSeatAndProceed() {
    const flight = getFlightState();
    const passenger = getPassenger();

    if (!flight.flightNumber) return alert("Select flight first!");
    if (!flight.selectedSeat) return alert("Select seat first!");

    // ✅ Date formatting
    let rawDate = flight.departureDate || flight.date || flight.flightDate;
    if (!rawDate) return alert("❌ Flight date missing!");

    let departureDate = (typeof rawDate === "string" && rawDate.includes("-"))
        ? rawDate
        : new Date(rawDate).toISOString().split("T")[0];

    const passengerName = `${passenger.title || ""} ${passenger.firstName || ""} ${passenger.lastName || ""}`.trim();

    // DTO mapping
    // DTO mapping
    const bookingDTO = {
        passenger: passengerName,
        email: passenger.email || "",       // ✅ add this line
        flightNumber: flight.flightNumber,
        seat: flight.selectedSeat,
        departureDate: departureDate,
        travelClass: (flight.type || "ECONOMY").toUpperCase(),
        price: parseFloat(flight.price?.toString().replace(/[^0-9.-]+/g, "")) || 0,
        origin: flight.from || "",
        destination: flight.to || ""
    };

    try {
        const res = await fetch("http://localhost:8080/api/v1/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingDTO)
        });

        const result = await res.json();

        if (res.ok && result.data) {
            alert("✅ Booking created successfully!");

            // 🔥 ඉතා වැදගත්: Backend එකෙන් එන සැබෑ PNR එක මෙතනදී සේව් කරනවා
            // DB එකේ ID එක (14) සහ PNR එක ("K6ATPF") දෙකම අපි Payment එකට ගෙනියනවා
            localStorage.setItem("bookingIdForPayment", result.data.id);
            localStorage.setItem("currentBookingPNR", result.data.pnr);

            // Redirect to Payment
            window.location.href = "../Pages/Pyment.html";
        } else {
            alert(result.message || "Booking failed!");
        }
    } catch (err) {
        console.error("Booking Error:", err);
        alert("❌ Server not reachable!");
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
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", bookSeatAndProceed);
    }
});