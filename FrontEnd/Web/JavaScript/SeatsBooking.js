// API Base URL (ඔබේ Backend URL එක මෙහි යොදන්න)
const API_URL = "http://localhost:8080/api/v1/flights";

const rows = [6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];
const colsLeft = ['A', 'B', 'C'];
const colsRight = ['D', 'E', 'F'];

let selectedSeat = null;
let occupiedSeats = []; // Backend එකෙන් එන දත්ත මෙහි ගබඩා වේ
let currentFlightId = 1; // දැනට තෝරාගෙන ඇති Flight ID එක (මෙය localStorage එකෙන් හෝ URL එකෙන් ලබාගත හැක)

// 1. Backend එකෙන් වෙන්කර ඇති අසුන් ලබා ගැනීම
async function fetchOccupiedSeats() {
    try {
        // මෙහිදී මුලින්ම ගුවන් ගමනේ දත්ත ලබා ගනී
        const response = await fetch(`${API_URL}/searchFlight/${currentFlightId}`);
        const result = await response.json();

        if (result.status === 200 && result.data) {
            // උපකල්පනය: Backend එකේ FlightDTO තුළ 'bookedSeats' නම් String Array එකක් ඇත
            // උදා: ["6A", "7C", "10B"]
            occupiedSeats = result.data.bookedSeats || [];
        }
    } catch (error) {
        console.error("Error fetching seats:", error);
        // API එක වැඩ නොකරන්නේ නම් Placeholder දත්ත භාවිතා කරයි
        occupiedSeats = ['6A', '6B', '11F'];
    }

    // දත්ත ලැබුණු පසු Seat Map එක අඳින්න
    renderSeatMap();
}

// 2. Seat Map එක නිර්මාණය කිරීම
function renderSeatMap() {
    const container = document.getElementById('seat-container');
    container.innerHTML = ''; // පැරණි දත්ත ඉවත් කිරීම

    rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'grid grid-cols-7 items-center gap-1';

        // වම් පස අසුන් (A, B, C)
        colsLeft.forEach(col => rowDiv.appendChild(createSeatElement(row, col)));

        // මැද අංකය (Aisle)
        const aisle = document.createElement('div');
        aisle.className = 'text-[10px] font-bold text-gray-400 text-center';
        aisle.innerText = row;
        rowDiv.appendChild(aisle);

        // දකුණු පස අසුන් (D, E, F)
        colsRight.forEach(col => rowDiv.appendChild(createSeatElement(row, col)));

        container.appendChild(rowDiv);
    });
}

// 3. එක් එක් අසුන නිර්මාණය කිරීම
function createSeatElement(row, col) {
    const seatId = `${row}${col}`;
    const isOccupied = occupiedSeats.includes(seatId);
    const isXL = row === 10;

    const btn = document.createElement('div');
    btn.id = `seat-${seatId}`;
    btn.className = `h-9 flex items-center justify-center rounded transition-all cursor-pointer border-2 `;

    if (isOccupied) {
        // දැනටමත් වෙන්කර ඇති අසුන් (Disabled)
        btn.className += 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-300';
        btn.innerHTML = '<i class="fas fa-times text-xs"></i>';
    } else {
        // ලබාගත හැකි අසුන්
        if (isXL) {
            btn.className += 'bg-[#002D72] border-[#002D72] text-white hover:opacity-80';
        } else {
            btn.className += 'bg-[#E8F5E9] border-[#8DC63F] text-[#8DC63F] hover:bg-[#8DC63F] hover:text-white';
        }
        btn.innerHTML = '<i class="fas fa-couch text-sm"></i>';
        btn.onclick = () => selectSeat(seatId);
    }

    return btn;
}

// 4. අසුනක් තෝරා ගැනීම (Selection Logic)
function selectSeat(seatId) {
    if (selectedSeat) {
        // කලින් තෝරාගත් අසුන සාමාන්‍ය තත්වයට පත් කිරීම
        const prev = document.getElementById(`seat-${selectedSeat}`);
        if (prev) {
            const rowNum = parseInt(selectedSeat);
            if (rowNum === 10) {
                prev.className = 'h-9 flex items-center justify-center rounded transition-all cursor-pointer border-2 bg-[#002D72] border-[#002D72] text-white';
            } else {
                prev.className = 'h-9 flex items-center justify-center rounded transition-all cursor-pointer border-2 bg-[#E8F5E9] border-[#8DC63F] text-[#8DC63F]';
            }
        }
    }

    if (selectedSeat === seatId) {
        selectedSeat = null;
    } else {
        selectedSeat = seatId;
        const current = document.getElementById(`seat-${seatId}`);
        current.className = 'h-9 flex items-center justify-center rounded transition-all cursor-pointer border-2 bg-[#4D4D4D] border-[#4D4D4D] text-white scale-110 shadow-md';
    }

    updateUI();
}

// 5. UI එක යාවත්කාලීන කිරීම
function updateUI() {
    const label = document.getElementById('selected-seat-label');
    const footerId = document.getElementById('footer-seat-id');
    const statusIcon = document.getElementById('passenger-status-icon');
    const confirmBtn = document.getElementById('confirm-btn');

    if (selectedSeat) {
        label.innerText = `Seat: ${selectedSeat}`;
        footerId.innerText = selectedSeat;
        statusIcon.innerHTML = '<i class="fas fa-check"></i>';
        statusIcon.className = 'w-10 h-10 rounded bg-blue-600 flex items-center justify-center text-white font-bold';

        confirmBtn.disabled = false;
        confirmBtn.className = 'bg-[#8DC63F] text-white px-8 py-2 rounded font-bold shadow-lg hover:bg-[#7ab334] transition-all cursor-pointer';
    } else {
        label.innerText = 'Seat ekak thora natha (No seat selected)';
        footerId.innerText = '-';
        statusIcon.innerHTML = '-';
        statusIcon.className = 'w-10 h-10 rounded bg-[#00AEEF] flex items-center justify-center text-white font-bold';

        confirmBtn.disabled = true;
        confirmBtn.className = 'bg-gray-300 text-gray-500 px-8 py-2 rounded font-bold cursor-not-allowed';
    }
}

// 6. අසුන වෙන් කිරීම (Save to Backend)
async function confirmBooking() {
    if (!selectedSeat) return;

    // Backend එකට යැවිය යුතු අලුත් දත්ත සකස් කිරීම
    // ඔබ ලබා දී ඇති Controller එක අනුව මෙහිදී FlightDTO එකක් update කළ යුතුය
    const updatedBookedSeats = [...occupiedSeats, selectedSeat];

    const flightUpdateData = {
        id: currentFlightId,
        // මෙහි ඔබේ FlightDTO එකට අවශ්‍ය අනෙකුත් සියලුම fields ඇතුළත් කරන්න
        bookedSeats: updatedBookedSeats
    };

    try {
        const response = await fetch(`${API_URL}/updateFlight`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(flightUpdateData)
        });

        if (response.ok) {
            alert(`Seat ${selectedSeat} successfully booked!`);
            // නැවත අලුත් දත්ත ලබාගෙන Map එක update කිරීම
            fetchOccupiedSeats();
            selectedSeat = null;
            updateUI();
        } else {
            alert("Failed to book seat. Please try again.");
        }
    } catch (error) {
        console.error("Error updating flight:", error);
        alert("Server error occurred!");
    }
}

// 7. Clear Selection
function clearSelection() {
    if (selectedSeat) {
        selectSeat(selectedSeat);
    }
}

// Initializing
window.onload = () => {
    fetchOccupiedSeats();

    // Confirm button එකට event listener එකක් එක් කිරීම
    const confirmBtn = document.getElementById('confirm-btn');
    confirmBtn.addEventListener('click', confirmBooking);
};