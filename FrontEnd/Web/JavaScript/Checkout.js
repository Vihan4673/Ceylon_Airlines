// ============================================
// GET DATA FROM LOCAL STORAGE
// ============================================
const flightState = JSON.parse(localStorage.getItem("selectedFlight"));
const passenger = JSON.parse(localStorage.getItem("passengerInfo"));

// දත්ත නොමැති නම් දැනුම් දීමක් සිදු කරයි
if (!flightState || !flightState.selectedFlight) {
    console.error("No flight data found in localStorage!");
}

const flight = flightState?.selectedFlight;

// ============================================
// FORMAT FULL DATE
// ============================================
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

// ============================================
// HERO TITLE (Banner එක යාවත්කාලීන කිරීම)
// ============================================
function updateHero() {
    const hero = document.querySelector(".hero-banner div");
    if (!hero || !flight) return;
    hero.innerText = `${flight.from} to ${flight.to}`;
}

// ============================================
// FLIGHT DETAILS (ගුවන් ගමන් විස්තර)
// ============================================
function updateFlightDetails() {
    if (!flight) return;

    // ප්‍රධාන මාතෘකාව සහ දිනය
    const routeTitle = document.querySelector(".card h3");
    if (routeTitle) {
        routeTitle.innerHTML = `${flight.from} to ${flight.to} <span class="font-normal text-gray-500">- ${formatFullDate(flightState.selectedDate)}</span>`;
    }

    // ගුවන්තොටුපල කේත (CMB, AUH වැනි)
    const codes = document.querySelectorAll(".font-bold.text-blue-900.text-sm");
    if (codes.length >= 2) {
        codes[0].innerText = flight.from;
        codes[1].innerText = flight.to;
    }
}

// ============================================
// CABIN CLASS (ගමන් පන්තිය)
// ============================================
function updateCabin() {
    const cabinContainer = document.querySelector(".fa-ribbon")?.parentElement;
    if (!cabinContainer || !flight) return;

    cabinContainer.innerHTML = `
        <i class="fa-solid fa-ribbon mr-2 text-red-600"></i>
        ${flight.type.toUpperCase()} FLEX
    `;
}

// ============================================
// CALCULATE PRICE (මුළු මුදල ගණනය කිරීම)
// ============================================
function calculateTotalPrice() {
    if (!flight) return 0;

    const adults = parseInt(flightState.adults) || 0;
    const children = parseInt(flightState.children) || 0;
    const infants = parseInt(flightState.infants) || 0;

    const totalPassengers = adults + children + infants;
    const pricePerPerson = parseFloat(flight.price.replace(/[^0-9.-]+/g, "")) || 0;

    return totalPassengers * pricePerPerson;
}

// ============================================
// UPDATE PRICE UI (මිල ගණන් ප්‍රදර්ශනය කිරීම)
// ============================================
function updatePrice() {
    const total = calculateTotalPrice();
    const formattedPrice = total.toLocaleString('en-LK');

    // කාඩ් එකේ පහළ ඇති මිල
    const subTotalEl = document.querySelector(".text-blue-900.font-bold.text-lg");
    if (subTotalEl) {
        subTotalEl.innerText = `LKR ${formattedPrice}`;
    }

    // අවසාන Checkout මිල
    const finalPriceEl = document.querySelector(".text-2xl.font-bold");
    if (finalPriceEl) {
        finalPriceEl.innerText = formattedPrice;
    }
}

// ============================================
// PASSENGER DETAILS (මගියාගේ විස්තර)
// ============================================
function updatePassenger() {
    if (!passenger) return;

    // නම සැකසීම
    const fullName = `${passenger.title || ""} ${passenger.firstName || ""} ${passenger.lastName || ""}`;
    const nameEl = document.querySelector(".font-bold.text-blue-900:not(.text-sm)");

    // මගියාගේ නම ඇති Span එක සොයා ගැනීම
    const passengerNameSpan = document.querySelector(".card span.font-bold.text-blue-900");
    if (passengerNameSpan) passengerNameSpan.innerText = fullName;

    // Email, Phone සහ Type විස්තර
    const infoDetails = document.querySelectorAll(".text-xs.text-gray-500");
    if (infoDetails.length >= 3) {
        infoDetails[0].innerText = passenger.email || "N/A";
        infoDetails[1].innerText = passenger.phoneNumber || "N/A";
        infoDetails[2].innerText = "Adult"; // අවශ්‍ය නම් මෙය dynamic කළ හැක
    }
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    // දත්ත තිබේ නම් පමණක් ක්‍රියාත්මක කරන්න
    if (flightState && flight) {
        updateHero();
        updateFlightDetails();
        updateCabin();
        updatePrice();
    }

    if (passenger) {
        updatePassenger();
    }

    // Checkout බොත්තම ක්ලික් කළ විට ක්‍රියාවලිය
    const checkoutBtn = document.querySelector(".btn-primary");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            alert("Proceeding to payment...");
            // මෙතනින් Payment page එකට redirect කළ හැක
        });
    }
});