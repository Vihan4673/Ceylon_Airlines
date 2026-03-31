const API_URL = "http://localhost:8080/api/v1/flights/getAllFlight";

const params = new URLSearchParams(window.location.search);

const searchFrom = params.get("from");
const searchTo = params.get("to");
const searchDate = params.get("dep");
const searchReturn = params.get("ret");


function checkAuth() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first!");
        window.location.href = "../Pages/LoginPage.html";
    }
}

let state = {
    adults: parseInt(params.get("adults")) || 1,
    children: parseInt(params.get("children")) || 0,
    infants: parseInt(params.get("infants")) || 0,
    cabin: params.get("cabin") || "Economy",
    selectedDate: searchDate || null,
    selectedFlight: null
};

function generateDateCarousel() {
    const container = document.getElementById("date-selector");
    if (!container) return;

    container.innerHTML = "";

    const baseDate = new Date(searchDate || new Date());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let offset = -3; offset <= 3; offset++) {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + offset);

        const isoDate = date.toISOString().split("T")[0];

        const card = document.createElement("div");
        card.className = "date-card flex-1 p-4 text-center cursor-pointer hover:bg-slate-50";
        card.dataset.date = isoDate;

        const dayNumber = date.getDate();
        const dayName = date.toLocaleDateString("en-GB", { weekday: "short" });

        card.innerHTML = `
            <p class="text-[10px] font-bold">LKR 128,725</p>
            <p class="text-sm font-bold">${dayName} ${dayNumber}</p>
        `;

        if (date < today) {
            card.classList.add("disabled", "text-gray-400", "cursor-not-allowed");
        } else {
            card.onclick = () => selectDate(card);
        }

        if (isoDate === state.selectedDate && date >= today) {
            card.classList.add("active");
        }

        container.appendChild(card);
    }

    updateHeaderDate(state.selectedDate);
}

function updateHeaderDate(date) {
    const header = document.getElementById("current-date-display");
    if (!header || !date) return;

    const d = new Date(date);
    header.innerText = d.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function selectDate(el) {
    if (el.classList.contains("disabled")) return;

    document.querySelectorAll("#date-selector .date-card")
        .forEach(card => card.classList.remove("active"));

    el.classList.add("active");
    state.selectedDate = el.dataset.date;
    updateHeaderDate(state.selectedDate);

    loadFlights();
}

function updateNavbar() {
    const totalPassengers = state.adults + state.children + state.infants;

    if (searchFrom) {
        const el = document.getElementById("navFromCode");
        const el2 = document.getElementById("navFromCity");
        if (el) el.innerText = searchFrom;
        if (el2) el2.innerText = searchFrom;
    }

    if (searchTo) {
        const el = document.getElementById("navToCode");
        const el2 = document.getElementById("navToCity");
        if (el) el.innerText = searchTo;
        if (el2) el2.innerText = searchTo;
    }

    if (searchDate) {
        const el = document.getElementById("navDepart");
        if (el) el.innerText = formatDate(searchDate);
    }

    const returnEl = document.getElementById("navReturn");
    if (returnEl) {
        returnEl.innerText = searchReturn ? formatDate(searchReturn) : "-";
    }

    const passengersEl = document.getElementById("navPassengers");
    if (passengersEl) {
        passengersEl.innerText = `${totalPassengers} Traveler${totalPassengers > 1 ? "s" : ""}`;
    }
}

function updateHeroRoute() {
    const heroTitle = document.getElementById("heroRoute");
    if (!heroTitle) return;

    if (searchFrom && searchTo) {
        heroTitle.innerText = `${searchFrom} to ${searchTo}`;
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short"
    });
}

async function loadFlights() {
    try {
        const res = await fetch(API_URL);
        const result = await res.json();

        if (result.status === 200 && result.data) {
            let flights = result.data.map(f => ({
                flightNumber: f.flightNumber,
                departureCode: f.departure,
                arrivalCode: f.arrival,
                departureTime: f.departureTime,
                arrivalTime: f.arrivalTime,
                duration: f.duration,
                economyFare: f.economyFare,
                businessFare: f.businessFare,
                flightDate: f.flightDate ? f.flightDate.split("T")[0] : null
            }));

            if (state.selectedDate) {
                flights = flights.filter(f => f.flightDate === state.selectedDate);
            }

            renderFlights(flights);
        }
    } catch (err) {
        console.error("Flight load error", err);
    }
}

function renderFlights(flights) {
    const container = document.getElementById("flights-container");
    if (!container) return;

    container.innerHTML = "";

    if (flights.length === 0) {
        container.innerHTML = `<div class="text-center p-10 text-gray-500">No flights available for this date</div>`;
        return;
    }

    flights.forEach(f => {
        const card = document.createElement("div");
        card.className = "flight-card shadow-sm flex flex-col md:flex-row p-4 border rounded mb-4";

        card.innerHTML = `
        <div class="flex justify-between items-center w-full">
            <div>
                <p class="font-bold">${f.departureCode} → ${f.arrivalCode}</p>
                <p class="text-sm text-gray-500">${f.flightNumber}</p>
            </div>
            <div>
                <p class="text-xs text-gray-400">${f.duration || ""}</p>
            </div>
        </div>
        <div class="flex mt-3 gap-2">
            <div class="fare-box p-2 border rounded cursor-pointer flex-1 text-center"
            onclick="selectFare(this,'Economy','${f.economyFare}','${f.flightNumber}','${f.departureCode}','${f.arrivalCode}')">
            Economy<br>LKR ${f.economyFare}
            </div>
            <div class="fare-box p-2 border rounded cursor-pointer flex-1 text-center"
            onclick="selectFare(this,'Business','${f.businessFare}','${f.flightNumber}','${f.departureCode}','${f.arrivalCode}')">
            Business<br>LKR ${f.businessFare}
            </div>
        </div>`;
        container.appendChild(card);
    });
}

function selectFare(el, type, price, flightNumber, from, to, flightDate) {
    document.querySelectorAll(".fare-box").forEach(b => b.classList.remove("selected"));
    el.classList.add("selected");

    state.selectedFlight = {
        flightNumber,
        type,
        price,
        from,
        to,
        flightDate: flightDate || state.selectedDate,
        adults: state.adults,
        children: state.children,
        infants: state.infants,
        cabin: state.cabin,
        selectedSeat: null
    };

    localStorage.setItem("selectedFlight", JSON.stringify(state.selectedFlight));

    const flightText = document.getElementById("selected-flight-text");
    const priceText = document.getElementById("total-price-display");
    const footer = document.getElementById("footer-summary");

    if (flightText) flightText.innerText = `${from} → ${to} • ${type}`;
    if (priceText) priceText.innerText = price;
    if (footer) footer.classList.remove("hidden");
}

function updateSummary() {
    const total = state.adults + state.children + state.infants;
    const el = document.getElementById("passengerSummary");
    if (!el) return;

    el.innerText = `${total} Traveler${total > 1 ? "s" : ""}, ${state.cabin}`;
}

document.addEventListener("DOMContentLoaded", () => {

    checkAuth();

    updateNavbar();
    updateHeroRoute();
    generateDateCarousel();
    loadFlights();
    updateSummary();
});

document.getElementById('footer-summary')?.querySelector('button')?.addEventListener('click', () => {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login before booking!");
        window.location.href = "../Pages/LoginPage.html";
        return;
    }

    if (!state.selectedFlight) {
        alert("Please select a flight first!");
        return;
    }

    window.location.href = "../Pages/PassengerDetails(3).html";
});