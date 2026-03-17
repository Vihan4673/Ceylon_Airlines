// =====================================================
// GET DATA FROM LOCAL STORAGE
// =====================================================
const passenger = JSON.parse(localStorage.getItem("passengerInfo"));
const flightState = JSON.parse(localStorage.getItem("selectedFlight"));

// =====================================================
// FORMAT FULL DATE
// =====================================================
function formatFullDate(dateStr) {
    if (!dateStr) return "Date not available";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

// =====================================================
// UPDATE FLIGHT SUMMARY SECTION
// =====================================================
function updateFlightSummary() {
    if (!flightState) return;

    const flight = flightState;

    // Route & Date
    const routeEl = document.getElementById("flight-route");
    if (routeEl) {
        routeEl.innerHTML = `${flight.from} to ${flight.to} <span class="font-normal text-gray-500">- ${formatFullDate(flight.date || flight.flightDate)}</span>`;
    }

    // Departure / Arrival Codes & Airports
    const depCodeEl = document.getElementById("departure-code");
    const arrCodeEl = document.getElementById("arrival-code");
    const depTimeEl = document.getElementById("departure-time");
    const arrTimeEl = document.getElementById("arrival-time");
    const depAirportEl = document.getElementById("departure-airport");
    const arrAirportEl = document.getElementById("arrival-airport");
    const stopsEl = document.getElementById("flight-stops");
    const durationEl = document.getElementById("flight-duration");
    const flightNumberEl = document.getElementById("flight-number-info");
    const fareClassEl = document.getElementById("fare-class");
    const totalPriceEl = document.getElementById("total-price");

    if (depCodeEl) depCodeEl.innerText = flight.from;
    if (arrCodeEl) arrCodeEl.innerText = flight.to;
    if (depTimeEl) depTimeEl.innerText = flight.departureTime || "";
    if (arrTimeEl) arrTimeEl.innerText = flight.arrivalTime || "";
    if (depAirportEl) depAirportEl.innerText = flight.departureAirport || flight.from;
    if (arrAirportEl) arrAirportEl.innerText = flight.arrivalAirport || flight.to;
    if (stopsEl) stopsEl.innerText = flight.stops || "Non-stop";
    if (durationEl) durationEl.innerText = flight.duration || "";

    if (flightNumberEl) {
        flightNumberEl.innerHTML = `<strong>${flight.flightNumber}</strong> operated by ${flight.airline || "Airline"}`;
    }

    if (fareClassEl) {
        fareClassEl.innerHTML = `<i class="fa-solid fa-ribbon mr-2 text-red-600"></i> ${flight.type?.toUpperCase() || "ECO"} FLEX`;
    }

    if (totalPriceEl) {
        totalPriceEl.innerText = `LKR ${calculateTotalPrice(flight)}`;
    }
}

// =====================================================
// CALCULATE TOTAL PRICE
// =====================================================
function calculateTotalPrice(flight) {
    if (!flight) return "0";

    const adults = parseInt(flight.adults || 0);
    const children = parseInt(flight.children || 0);
    const infants = parseInt(flight.infants || 0);

    const totalPassengers = adults + children + infants;
    const pricePerPerson = parseFloat(flight.price?.toString().replace(/[^0-9.-]+/g, "")) || 0;

    const total = totalPassengers * pricePerPerson;
    return total.toLocaleString("en-LK");
}

// =====================================================
// UPDATE PASSENGER DETAILS
// =====================================================
function updatePassengerDetails() {
    if (!passenger) return;

    const nameEl = document.querySelector(".card span.font-bold.text-blue-900");
    if (nameEl) {
        const fullName = `${passenger.title || ""} ${passenger.firstName || ""} ${passenger.lastName || ""}`.trim();
        nameEl.innerText = fullName;
    }

    const infoDetails = document.querySelectorAll(".text-xs.text-gray-500");
    if (infoDetails.length >= 3) {
        infoDetails[0].innerText = passenger.email || "N/A";
        infoDetails[1].innerText = passenger.phoneNumber || "N/A";
        infoDetails[2].innerText = passenger.type || "Adult";
    }
}

// =====================================================
// TEMPORARY PNR GENERATOR
// =====================================================
function generatePNR() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let pnr = "";
    for (let i = 0; i < 6; i++) {
        pnr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pnr;
}

// =====================================================
// INIT CHECKOUT BUTTON
// =====================================================
function initCheckoutButton() {
    const checkoutBtn = document.querySelector(".btn-primary");
    if (!checkoutBtn) return;

    checkoutBtn.addEventListener("click", async () => {
        if (!flightState || !passenger) {
            alert("Please select flight and passenger details first!");
            return;
        }

        if (!flightState.id) {
            alert("Flight ID is missing! Please re-select your flight.");
            return;
        }

        const bookingDTO = {
            pnr: generatePNR(),
            passenger: `${passenger.title || ""} ${passenger.firstName || ""} ${passenger.lastName || ""}`.trim(),
            flightId: flightState.id,  // Ensure flight ID exists
            seat: flightState.selectedSeat || "Not assigned",
            bookingDate: new Date().toISOString().split("T")[0],
            departureDate: flightState.date || flightState.flightDate,
            travelClass: flightState.type || "Economy",
            price: parseFloat(flightState.price?.toString().replace(/[^0-9.-]+/g, "")) || 0,
            paid: false,
            status: "CONFIRMED",
            from: flightState.from,
            to: flightState.to
        };

        try {
            const response = await fetch("http://localhost:8080/api/v1/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingDTO)
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Booking confirmed! Your PNR: ${data.data.pnr}`);
                window.location.href = "../Pages/BookingConfirmation.html";
            } else {
                alert("Failed to create booking: " + data.message);
                console.error(data);
            }
        } catch (err) {
            console.error(err);
            alert("Error connecting to server!");
        }
    });
}

// =====================================================
// UPDATE HERO SECTION
// =====================================================
function updateHero() {
    if (!flightState) return;
    const heroTextEl = document.getElementById("hero-text");
    if (!heroTextEl) return;
    heroTextEl.innerText = `${flightState.from} to ${flightState.to}`;
}

// =====================================================
// INITIALIZE ON PAGE LOAD
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
    updateHero();
    updateFlightSummary();
    updatePassengerDetails();
    initCheckoutButton();
});