
const flightState = JSON.parse(localStorage.getItem("selectedFlight"));
const passenger = JSON.parse(localStorage.getItem("passengerInfo"));

let selectedSeat = null;
let occupiedSeats = [];

const API_URL = "http://localhost:8080/api/v1/seats";
const flightNumber = encodeURIComponent(flightState?.flightNumber || "");

function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function updateHeader() {

    if (!flightState) return;

    document.getElementById("header-flight-number").innerText =
        flightState.flightNumber || "N/A";

    document.getElementById("header-depart-date").innerText =
        formatDate(flightState.date || flightState.flightDate);

    document.getElementById("hero-text").innerText =
        `${flightState.from} → ${flightState.to}`;
}

function updateSeatCountUI(total, booked) {
    const el = document.getElementById("seat-count");
    if (el) el.innerText = `Booked Seats: ${booked} / ${total}`;
}

async function fetchOccupiedSeats() {

    if (!flightNumber) {
        console.error("No flight number");
        return;
    }

    try {

        const response = await fetch(`${API_URL}/flight-number/${flightNumber}`);

        if (!response.ok) {
            throw new Error("Server error: " + response.status);
        }

        const text = await response.text();

        if (!text) throw new Error("Empty response");

        const result = JSON.parse(text);

        if (result.status === 200 && result.data) {

            occupiedSeats = result.data
                .filter(s => s.booked)
                .map(s => s.seatId);

            updateSeatCountUI(result.data.length, occupiedSeats.length);
        }

    } catch (err) {
        console.error("Fetch error:", err);
        occupiedSeats = [];
    }

    renderSeatMap();
}

function renderSeatMap() {

    const container = document.getElementById("seat-container");
    if (!container) return;

    container.innerHTML = "";

    const rows = 30;
    const cols = ['A','B','C','D','E','F'];

    for (let i = 1; i <= rows; i++) {

        const rowDiv = document.createElement("div");
        rowDiv.className = "grid grid-cols-7 gap-1 items-center";

        cols.forEach((col, index) => {

            const seatId = `${i}${col}`;
            const isBooked = occupiedSeats.includes(seatId);
            const isXL = (i === 10);

            const seat = document.createElement("div");
            seat.className = "p-2 text-center border rounded cursor-pointer text-xs font-bold";

            if (isBooked) {
                seat.className += " bg-gray-300 cursor-not-allowed";
                seat.innerText = "X";
            } else {

                if (isXL) {
                    seat.className += " bg-[#002D72] text-white";
                } else {
                    seat.className += " bg-green-200";
                }

                seat.innerText = seatId;
                seat.onclick = () => selectSeat(seatId);
            }

            rowDiv.appendChild(seat);

            if (index === 2) {
                const gap = document.createElement("div");
                gap.innerText = i;
                gap.className = "text-[10px] text-gray-400 text-center";
                rowDiv.appendChild(gap);
            }
        });

        container.appendChild(rowDiv);
    }
}

function selectSeat(seatId) {

    if (occupiedSeats.includes(seatId)) return;

    selectedSeat = seatId;

    document.getElementById("footer-seat-id").innerText = seatId;

    const btn = document.getElementById("confirm-btn");
    if (btn) {
        btn.disabled = false;
        btn.classList.remove("bg-gray-300", "cursor-not-allowed");
        btn.classList.add("bg-[#8DC63F]", "text-white");
    }
}

function clearSelection() {
    selectedSeat = null;
    document.getElementById("footer-seat-id").innerText = "-";

    const btn = document.getElementById("confirm-btn");
    btn.disabled = true;
    btn.className = "bg-gray-300 text-gray-500 px-8 py-2 rounded font-bold cursor-not-allowed";
}

async function confirmBooking() {

    if (!selectedSeat) {
        alert("Select seat first");
        return;
    }

    const bookingData = {
        seatId: selectedSeat,
        flightNumber: decodeURIComponent(flightNumber),
        passengerName: `${passenger?.firstName || "Guest"}`
    };

    try {

        const res = await fetch(`${API_URL}/book`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData)
        });

        const result = await res.json();

        if (res.ok) {

            flightState.selectedSeat = selectedSeat;
            localStorage.setItem("selectedFlight", JSON.stringify(flightState));

            alert(`Seat ${selectedSeat} booked!`);

            window.location.href = "../Pages/Checkout page.html";

        } else {
            alert(result.message || "Booking failed");
        }

    } catch (err) {
        console.error("Booking error:", err);
        alert("Server error!");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateHeader();
    fetchOccupiedSeats();
    document.getElementById("confirm-btn")?.addEventListener("click", confirmBooking);
});