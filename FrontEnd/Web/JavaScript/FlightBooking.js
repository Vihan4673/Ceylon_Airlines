// =====================================================
// API URL
// =====================================================
const API_URL = "http://localhost:8080/api/v1/flights/getAllFlight";

// =====================================================
// READ URL PARAMETERS
// =====================================================
const params = new URLSearchParams(window.location.search);
const searchFrom = params.get("from");
const searchTo = params.get("to");
const searchDate = params.get("dep");
const searchReturn = params.get("ret");

// =====================================================
// SINGLE STATE OBJECT
// =====================================================
let state = {
    adults: parseInt(params.get("adults")) || 1,
    children: parseInt(params.get("children")) || 0,
    infants: parseInt(params.get("infants")) || 0,
    cabin: params.get("cabin") || "Economy",
    selectedDate: searchDate || null,
    selectedFlight: null
};

// =====================================================
// UPDATE NAVBAR
// =====================================================
function updateNavbar() {
    const totalPassengers = state.adults + state.children + state.infants;

    if (searchFrom) {
        document.getElementById("navFromCode").innerText = searchFrom;
        document.getElementById("navFromCity").innerText = searchFrom;
    }
    if (searchTo) {
        document.getElementById("navToCode").innerText = searchTo;
        document.getElementById("navToCity").innerText = searchTo;
    }
    if (searchDate) {
        document.getElementById("navDepart").innerText = formatDate(searchDate);
    }
    document.getElementById("navReturn").innerText =
        searchReturn ? formatDate(searchReturn) : "-";

    document.getElementById("navPassengers").innerText =
        `${totalPassengers} Traveler${totalPassengers > 1 ? "s" : ""}`;
}

// =====================================================
// UPDATE HERO ROUTE TITLE
// =====================================================
function updateHeroRoute() {
    const heroTitle = document.getElementById("heroRoute");
    if (!heroTitle) return;
    if (searchFrom && searchTo) {
        heroTitle.innerText = `${searchFrom} to ${searchTo}`;
    }
}

// =====================================================
// FORMAT DATE
// =====================================================
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short"
    });
}

// =====================================================
// LOAD FLIGHTS
// =====================================================
async function loadFlights() {
    try {
        const res = await fetch(API_URL);
        const result = await res.json();

        if (result.status === 200 && result.data) {
            const flights = result.data.map(f => ({
                flightNumber: f.flightNumber,
                airline: f.airlineName,
                departureCode: f.departureCode,
                arrivalCode: f.arrivalCode,
                departureAirport: f.departureAirport,
                arrivalAirport: f.arrivalAirport,
                departureTime: f.departureTime,
                arrivalTime: f.arrivalTime,
                duration: f.duration,
                stops: f.stops,
                economyFare: f.economyFare,
                businessFare: f.businessFare,
                economySeats: f.economySeats
            }));
            renderFlights(flights);
        } else {
            console.error("No flights found");
        }
    } catch (err) {
        console.error("Error fetching flights:", err);
    }
}

// =====================================================
// RENDER FLIGHTS
// =====================================================
function renderFlights(flights) {
    const container = document.getElementById('flights-container');
    container.innerHTML = '';

    flights.forEach(f => {
        const card = document.createElement('div');
        card.className = 'flight-card shadow-sm flex flex-col md:flex-row p-4 border rounded mb-4';

        card.innerHTML = `
            <div class="flex justify-between items-center w-full">
                <div>
                    <p class="font-bold">${f.departureCode} → ${f.arrivalCode}</p>
                    <p class="text-sm text-gray-500">${f.flightNumber} • ${f.airline}</p>
                </div>
                <div>
                    <p class="text-xs text-gray-400">${f.duration} | ${f.stops > 0 ? f.stops + ' stops' : 'nonstop'}</p>
                </div>
            </div>
            <div class="flex mt-3 gap-2">
                <div class="fare-box p-2 border rounded cursor-pointer flex-1 text-center"
                     onclick="selectFare(this,'Economy','${f.economyFare}','${f.flightNumber}','${f.departureCode}','${f.arrivalCode}')">
                    Economy<br>${f.economyFare}<br>(${f.economySeats} seats)
                </div>
                <div class="fare-box p-2 border rounded cursor-pointer flex-1 text-center"
                     onclick="selectFare(this,'Business','${f.businessFare}','${f.flightNumber}','${f.departureCode}','${f.arrivalCode}')">
                    Business<br>${f.businessFare}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// =====================================================
// SELECT FARE
// =====================================================
function selectFare(el, type, price, flightNumber, from, to) {
    document.querySelectorAll('.fare-box').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');

    state.selectedFlight = {
        flightNumber,
        type,
        price,
        from,
        to,
        adults: state.adults,
        children: state.children,
        infants: state.infants,
        cabin: state.cabin
    };
    localStorage.setItem('selectedFlight', JSON.stringify(state));

    document.getElementById('selected-flight-text').innerText = `${from} → ${to} • ${type}`;
    document.getElementById('total-price-display').innerText = price;

    document.getElementById('footer-summary').classList.remove('hidden');
}

// =====================================================
// PASSENGER & CABIN MANAGEMENT
// =====================================================
function updateCount(type, delta) {
    const total = state.adults + state.children + state.infants + delta;
    if (total > 9 || state[type] + delta < 0) return;
    if (type === 'adults' && state.adults + delta < 1) return;

    state[type] += delta;
    document.getElementById(`${type}Count`).innerText = state[type];
    updateSummary();
}

function updateClass(cabin) {
    state.cabin = cabin;
    updateSummary();
}

function updateSummary() {
    const total = state.adults + state.children + state.infants;
    document.getElementById('passengerSummary').innerText = `${total} Traveler${total > 1 ? 's' : ''}, ${state.cabin}`;
}

// =====================================================
// CONTINUE BUTTON
// =====================================================
document.getElementById('footer-summary')?.querySelector('button')?.addEventListener('click', () => {
    if (!state.selectedFlight) {
        alert("Please select a flight first!");
        return;
    }
    window.location.href = "../Pages/PassengerDetails(3).html";
});

// =====================================================
// INITIALIZE
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    updateHeroRoute();
    loadFlights();
    updateSummary();
});