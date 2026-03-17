// =====================================================
// GET DATA FROM LOCAL STORAGE
// =====================================================
const flightState = JSON.parse(localStorage.getItem("selectedFlight"));
const passenger = JSON.parse(localStorage.getItem("passengerInfo"));

// =====================================================
// SEAT CONFIGURATION
// =====================================================
const rows = [6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];
const colsLeft = ['A', 'B', 'C'];
const colsRight = ['D', 'E', 'F'];

let selectedSeat = null;
let occupiedSeats = [];
let currentFlightId = flightState?.id || 1;

const API_URL = "http://localhost:8080/api/v1/seats";

// =====================================================
// FORMAT DATE
// =====================================================
function formatDateShort(dateStr) {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short"
    });
}

// =====================================================
// CALCULATE TOTAL PRICE
// =====================================================
function calculateTotalPrice(flight) {
    if (!flight) return "0";
    const adults = parseInt(flight.adults || 0);
    const children = parseInt(flight.children || 0);
    const infants = parseInt(flight.infants || 0);
    const pricePerPerson = parseFloat(flight.price?.replace(/[^0-9.-]+/g, "")) || 0;
    const total = (adults + children + infants) * pricePerPerson;
    return total.toLocaleString("en-LK");
}

// =====================================================
// UPDATE HEADER & HERO
// =====================================================
function updateHeaderAndHero() {
    if (!flightState) return;

    const heroTextEl = document.getElementById("hero-text");
    const headerRouteEl = document.getElementById("header-route-info");
    const headerPriceEl = document.getElementById("header-price");

    const totalPassengers = (flightState.adults || 0) + (flightState.children || 0) + (flightState.infants || 0);
    const dateFormatted = formatDateShort(flightState.date || flightState.flightDate);

    if (heroTextEl) heroTextEl.innerText = `${flightState.from} → ${flightState.to}`;

    if (headerRouteEl) {
        headerRouteEl.innerHTML = `
            <div>
                <p class="text-xs opacity-70 uppercase">${flightState.from}</p>
                <p class="font-bold">${flightState.fromCity || flightState.from}</p>
            </div>
            <div class="flex items-center text-xs opacity-50">✈</div>
            <div>
                <p class="text-xs opacity-70 uppercase">${flightState.to}</p>
                <p class="font-bold">${flightState.toCity || flightState.to}</p>
            </div>
            <div class="hidden md:block border-l border-white/20 pl-8">
                <p class="text-xs opacity-70">Flight</p>
                <p class="font-bold">${flightState.flightNumber || "N/A"}</p>
            </div>
            <div class="hidden md:block border-l border-white/20 pl-8">
                <p class="text-xs opacity-70">Depart</p>
                <p class="font-bold">${dateFormatted}</p>
            </div>
            <div class="hidden md:block border-l border-white/20 pl-8">
                <p class="text-xs opacity-70">Passenger</p>
                <p class="font-bold"><i class="fas fa-users mr-1"></i> ${totalPassengers}</p>
            </div>
        `;
    }

    if (headerPriceEl) {
        const totalPrice = calculateTotalPrice(flightState);
        headerPriceEl.innerHTML = `
            <p class="text-xs opacity-70">🛒 LKR</p>
            <p class="text-xl font-bold">${totalPrice}</p>
        `;
    }
}

// =====================================================
// FETCH OCCUPIED SEATS FOR CURRENT FLIGHT ONLY
// =====================================================
async function fetchOccupiedSeats() {
    if (!currentFlightId) return;

    try {
        const response = await fetch(`${API_URL}/flight/${currentFlightId}`);
        const result = await response.json();

        if (result.status === 200 && result.data) {
            occupiedSeats = result.data
                .filter(seat => seat.booked)
                .map(seat => seat.seatId);
        }
    } catch (error) {
        console.error("Error fetching seats:", error);
        occupiedSeats = []; // fallback empty
    }

    renderSeatMap();
}

// =====================================================
// RENDER SEAT MAP
// =====================================================
function renderSeatMap() {
    const container = document.getElementById('seat-container');
    if (!container) return;
    container.innerHTML = '';

    rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'grid grid-cols-7 items-center gap-1';

        colsLeft.forEach(col => rowDiv.appendChild(createSeatElement(row, col)));

        const aisle = document.createElement('div');
        aisle.className = 'text-[10px] font-bold text-gray-400 text-center';
        aisle.innerText = row;
        rowDiv.appendChild(aisle);

        colsRight.forEach(col => rowDiv.appendChild(createSeatElement(row, col)));

        container.appendChild(rowDiv);
    });
}

// =====================================================
// CREATE SEAT ELEMENT
// =====================================================
function createSeatElement(row, col) {
    const seatId = `${row}${col}`;
    const isOccupied = occupiedSeats.includes(seatId);
    const isXL = row === 10;

    const btn = document.createElement('div');
    btn.id = `seat-${seatId}`;
    btn.className = 'h-9 flex items-center justify-center rounded transition-all cursor-pointer border-2';

    if (isOccupied) {
        btn.className += ' bg-gray-100 border-gray-200 cursor-not-allowed text-gray-300';
        btn.innerHTML = '<i class="fas fa-times text-xs"></i>';
    } else {
        if (isXL) btn.className += ' bg-[#002D72] border-[#002D72] text-white hover:opacity-80';
        else btn.className += ' bg-[#E8F5E9] border-[#8DC63F] text-[#8DC63F] hover:bg-[#8DC63F] hover:text-white';
        btn.innerHTML = '<i class="fas fa-couch text-sm"></i>';
        btn.onclick = () => selectSeat(seatId);
    }

    return btn;
}

// =====================================================
// SELECT SEAT
// =====================================================
function selectSeat(seatId) {
    if (occupiedSeats.includes(seatId)) return; // cannot select booked

    if (selectedSeat) {
        const prev = document.getElementById(`seat-${selectedSeat}`);
        if (prev) {
            const rowNum = parseInt(selectedSeat);
            if (rowNum === 10) prev.className = 'h-9 flex items-center justify-center rounded transition-all cursor-pointer border-2 bg-[#002D72] border-[#002D72] text-white';
            else prev.className = 'h-9 flex items-center justify-center rounded transition-all cursor-pointer border-2 bg-[#E8F5E9] border-[#8DC63F] text-[#8DC63F]';
        }
    }

    if (selectedSeat === seatId) selectedSeat = null;
    else {
        selectedSeat = seatId;
        const current = document.getElementById(`seat-${seatId}`);
        if (current) current.className = 'h-9 flex items-center justify-center rounded transition-all cursor-pointer border-2 bg-[#4D4D4D] border-[#4D4D4D] text-white scale-110 shadow-md';
    }

    updateSeatFooter();
}

// =====================================================
// UPDATE FOOTER SUMMARY
// =====================================================
function updateSeatFooter() {
    const label = document.getElementById('selected-seat-label');
    const footerId = document.getElementById('footer-seat-id');
    const statusIcon = document.getElementById('passenger-status-icon');
    const confirmBtn = document.getElementById('confirm-btn');

    if (!label || !footerId || !statusIcon || !confirmBtn) return;

    if (selectedSeat) {
        label.innerText = `Seat: ${selectedSeat}`;
        footerId.innerText = selectedSeat;
        statusIcon.innerHTML = '<i class="fas fa-check"></i>';
        statusIcon.className = 'w-10 h-10 rounded bg-blue-600 flex items-center justify-center text-white font-bold';
        confirmBtn.disabled = false;
        confirmBtn.className = 'bg-[#8DC63F] text-white px-8 py-2 rounded font-bold shadow-lg hover:bg-[#7ab334] transition-all cursor-pointer';
    } else {
        label.innerText = 'No seat selected';
        footerId.innerText = '-';
        statusIcon.innerHTML = '-';
        statusIcon.className = 'w-10 h-10 rounded bg-[#00AEEF] flex items-center justify-center text-white font-bold';
        confirmBtn.disabled = true;
        confirmBtn.className = 'bg-gray-300 text-gray-500 px-8 py-2 rounded font-bold cursor-not-allowed';
    }
}

// =====================================================
// CONFIRM BOOKING
// =====================================================
async function confirmBooking() {
    if (!selectedSeat) return;

    const bookingData = {
        seatId: selectedSeat,
        flightId: currentFlightId,
        passengerName: `${passenger?.firstName || "Guest"} ${passenger?.lastName || ""}`.trim()
    };

    try {
        const response = await fetch(`${API_URL}/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(`Seat ${selectedSeat} successfully booked for Flight ${flightState.flightNumber}!`);
            fetchOccupiedSeats(); // refresh seat map
            selectedSeat = null;
            updateSeatFooter();
        } else {
            alert(`Booking failed: ${result.message}`);
        }
    } catch (error) {
        console.error("Error booking seat:", error);
        alert("Server error occurred!");
    }
}

// =====================================================
// INITIALIZE PAGE
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
    updateHeaderAndHero();
    fetchOccupiedSeats();
    document.getElementById('confirm-btn')?.addEventListener('click', confirmBooking);
});