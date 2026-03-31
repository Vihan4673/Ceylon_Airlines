function getFlightState() {
    return JSON.parse(localStorage.getItem("selectedFlight")) || {};
}

function getPassenger() {
    return JSON.parse(
        localStorage.getItem("passengerInfo") ||
        localStorage.getItem("currentPassenger")
    ) || {};
}

function formatFullDate(dateStr) {
    if (!dateStr) return "Date not available";
    return new Date(dateStr).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value || "";
}

function updateFlightSummary() {
    const flight = getFlightState();
    const totalPriceFormatted = calculateTotalPrice(flight);

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

    setText("total-price", `LKR ${totalPriceFormatted}`);
    setText("total-price-display", totalPriceFormatted);
}

function calculateTotalPrice(flight) {
    const totalPassengers =
        (parseInt(flight.adults || 1)) +
        (parseInt(flight.children || 0)) +
        (parseInt(flight.infants || 0));

    const priceStr = flight.price ? flight.price.toString().replace(/[^0-9.-]+/g, "") : "0";
    const price = parseFloat(priceStr) || 0;

    const grandTotal = totalPassengers * price;

    return grandTotal.toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function updatePassengerDetails() {
    const passenger = getPassenger();
    const nameEl = document.querySelector(".card span.font-bold.text-blue-900") || document.querySelector(".font-900.text-lg.text-slate-800");

    if (nameEl)
        nameEl.innerText = `${passenger.title || ""} ${passenger.firstName || ""} ${passenger.lastName || ""}`.trim();

    const emailDiv = document.querySelector(".fa-envelope")?.parentElement;
    const phoneDiv = document.querySelector(".fa-phone")?.parentElement;

    const passportDiv = document.querySelector(".fa-id-card")?.parentElement || document.querySelector(".fa-passport")?.parentElement;

    if (emailDiv) emailDiv.innerHTML = `<i class="fa-solid fa-envelope mr-1"></i> ${passenger.email || "N/A"}`;
    if (phoneDiv) phoneDiv.innerHTML = `<i class="fa-solid fa-phone mr-1"></i> ${passenger.phoneNumber || passenger.mobile || "N/A"}`;

    if (passportDiv) {
        const passNo = passenger.passportNumber || passenger.documentNumber || passenger.passport || "N/A";
        passportDiv.innerHTML = `<i class="fa-solid fa-id-card mr-1"></i> ${passNo}`;
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

async function bookSeatAndProceed() {
    const flight = getFlightState();
    const passenger = getPassenger();

    if (!flight.flightNumber) return alert("Select flight first!");
    if (!flight.selectedSeat) return alert("Select seat first!");

    let rawDate = flight.departureDate || flight.date || flight.flightDate;
    if (!rawDate) return alert("Flight date missing!");

    let departureDate = (typeof rawDate === "string" && rawDate.includes("-"))
        ? rawDate
        : new Date(rawDate).toISOString().split("T")[0];

    const passengerName = `${passenger.title || ""} ${passenger.firstName || ""} ${passenger.lastName || ""}`.trim();
    const passportNo = passenger.passportNumber || passenger.documentNumber || passenger.passport || "N/A";

    const bookingDTO = {
        passenger: passengerName,
        email: passenger.email || "",
        passportNumber: passportNo,
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
            alert("Booking created successfully!");
            localStorage.setItem("bookingIdForPayment", result.data.id);
            localStorage.setItem("currentBookingPNR", result.data.pnr);
            window.location.href = "../Pages/Pyment.html";
        } else {
            alert(result.message || "Booking failed!");
        }
    } catch (err) {
        console.error("Booking Error:", err);
        alert("Server not reachable!");
    }
}

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