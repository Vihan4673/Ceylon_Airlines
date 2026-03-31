
const API_URL = "http://localhost:8080/api/v1/bookings";
const PASSENGER_API = "http://localhost:8080/api/v1/passengers";
const SEAT_API = "http://localhost:8080/api/v1/seats";

let bookings = [];
let occupiedSeats = [];
document.addEventListener("DOMContentLoaded", () => {
    loadBookings();

    document.getElementById('m-flightNumber').addEventListener('blur', (e) => {
        if(e.target.value) fetchOccupiedSeats(e.target.value);
    });
});

async function lookupPassenger() {
    const passport = document.getElementById('m-passport').value;
    const nameInput = document.getElementById('m-passenger');
    const emailInput = document.getElementById('m-email');

    if (!passport) {
        alert("Please enter a passport number!");
        return;
    }

    nameInput.placeholder = "Searching database...";

    try {

        const response = await fetch(`${PASSENGER_API}/passport/${passport}`);
        const result = await response.json();

        if (response.ok && result.data) {

            const fullName = `${result.data.title || ''} ${result.data.firstName || ''} ${result.data.lastName || ''}`.trim();
            nameInput.value = fullName;
            emailInput.value = result.data.email || "";
            console.log("Passenger found:", result.data);
        } else {
            alert("Passenger record not found. Please enter details manually.");
            nameInput.value = "";
            nameInput.placeholder = "Enter Full Name";
        }
    } catch (error) {
        console.error("Lookup error:", error);
        alert("Could not connect to Passenger Service.");
    }
}

async function fetchOccupiedSeats(flightNo) {
    if (!flightNo) return;

    try {
        const response = await fetch(`${SEAT_API}/flight-number/${encodeURIComponent(flightNo)}`);
        const result = await response.json();

        if (result.status === 200 && result.data) {
            occupiedSeats = result.data
                .filter(s => s.booked === true)
                .map(s => s.seatId);
        } else {
            occupiedSeats = [];
        }
    } catch (err) {
        console.error("Seat fetch error:", err);
        occupiedSeats = [];
    }
    initSeatMap();
}

function initSeatMap() {
    const grid = document.getElementById('seat-grid');
    if(!grid) return;
    grid.innerHTML = '';

    const cols = ['A', 'B', 'C', 'D'];
    const rows = 10;

    for (let i = 1; i <= rows; i++) {
        cols.forEach(col => {
            const seatId = `${i}${col}`;
            const isBooked = occupiedSeats.includes(seatId);

            const seatDiv = document.createElement('div');
            seatDiv.className = `seat-btn w-10 h-10 rounded-xl border-2 flex items-center justify-center text-[10px] font-black transition-all cursor-pointer 
                ${isBooked ? 'bg-slate-200 text-slate-400 border-slate-100 cursor-not-allowed' : 'bg-white text-slate-900 border-slate-100 hover:border-[#8A1538] hover:text-[#8A1538]'}`;

            seatDiv.innerText = seatId;

            if (!isBooked) {
                seatDiv.onclick = () => selectSeat(seatId, seatDiv);
            }
            grid.appendChild(seatDiv);
        });
    }
}

function selectSeat(id, element) {
    document.querySelectorAll('.seat-btn').forEach(el => {
        if(!el.classList.contains('bg-slate-200')) {
            el.classList.remove('bg-[#8A1538]', 'text-white', 'border-[#8A1538]');
            el.classList.add('bg-white', 'text-slate-900', 'border-slate-100');
        }
    });
    element.classList.remove('bg-white', 'text-slate-900');
    element.classList.add('bg-[#8A1538]', 'text-white', 'border-[#8A1538]');

    document.getElementById('m-seat').value = id;
    document.getElementById('selected-seat-label').innerText = `SEAT: ${id}`;
}


async function loadBookings() {
    try {
        const res = await fetch(API_URL);
        const result = await res.json();
        if (res.ok) {
            bookings = result.data || [];
            renderTable();
        }
    } catch (err) {
        console.error("Load bookings error:", err);
    }
}

async function saveBooking() {
    const pnr = document.getElementById('pnr-display').innerText;
    const seatId = document.getElementById('m-seat').value;
    const flightNo = document.getElementById('m-flightNumber').value;
    const isPaid = document.getElementById('m-paid').checked;

    const data = {
        pnr: pnr,
        passenger: document.getElementById('m-passenger').value,
        email: document.getElementById('m-email').value,
        flightNumber: flightNo,
        origin: document.getElementById('m-origin').value,
        destination: document.getElementById('m-destination').value,
        departureDate: document.getElementById('m-departureDate').value,
        travelClass: document.getElementById('m-travelClass').value,
        seat: seatId,
        price: parseFloat(document.getElementById('m-price').value) || 0,
        paid: isPaid,
        status: "CONFIRMED",
        bookingDate: new Date().toISOString().split('T')[0]
    };

    if (!data.passenger || !data.seat || !data.flightNumber) {
        alert("Required: Name, Flight Number and Seat Selection!");
        return;
    }

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            await fetch(`${SEAT_API}/book`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    seatId: seatId,
                    flightNumber: flightNo,
                    passengerName: data.passenger
                })
            });

            alert("Ticket Issued Successfully!");
            closeModal();
            loadBookings();
        } else {
            alert("Failed to save booking. Check console for details.");
        }
    } catch (err) {
        console.error("Save error:", err);
        alert("Server error. Connection failed.");
    }
}

async function deleteBooking(id) {
    if (!confirm("Void this ticket? This action cannot be undone.")) return;
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert("Booking removed from registry.");
            loadBookings();
        }
    } catch (err) {
        alert("Delete failed.");
    }
}

function renderTable() {
    const tbody = document.getElementById('booking-table-body');
    if(!tbody) return;
    tbody.innerHTML = '';

    let totalRevenue = 0;

    bookings.forEach(b => {
        totalRevenue += b.price;
        const row = `
            <tr class="hover:bg-slate-50 transition-all">
                <td class="px-10 py-6">
                    <span class="font-mono font-black text-[#8A1538] text-lg">${b.pnr}</span><br>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${b.flightNumber}</span>
                </td>
                <td class="px-10 py-6">
                    <span class="font-black text-slate-800">${b.passenger}</span><br>
                    <span class="text-[10px] text-slate-400 font-medium">${b.email}</span>
                </td>
                <td class="px-10 py-6">
                    <span class="text-xs font-black text-slate-600">${b.origin} ✈ ${b.destination}</span><br>
                    <span class="text-[9px] font-black text-[#8A1538] uppercase">${b.travelClass} • SEAT ${b.seat}</span>
                </td>
                <td class="px-10 py-6">
                    <span class="px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${b.paid ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}">
                        ${b.paid ? 'PAID' : 'PENDING'}
                    </span>
                </td>
                <td class="px-10 py-6 text-right">
                    <button onclick="deleteBooking(${b.id})" class="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    document.getElementById('total-revenue').innerText = `$${totalRevenue.toLocaleString()}`;
    document.getElementById('total-count').innerText = bookings.length;
    document.getElementById('active-seats').innerText = bookings.length;
}

function openModal() {
    document.getElementById('bookingModal').classList.remove('hidden');
    generatePNR();

    const flight = document.getElementById('m-flightNumber').value;
    if(flight) fetchOccupiedSeats(flight);
    else initSeatMap();
}

function closeModal() {
    document.getElementById('bookingModal').classList.add('hidden');
    const fields = ['m-passenger', 'm-email', 'm-flightNumber', 'm-origin', 'm-destination', 'm-departureDate', 'm-seat', 'm-price', 'm-passport'];
    fields.forEach(f => {
        const el = document.getElementById(f);
        if(el) el.value = '';
    });
    document.getElementById('m-paid').checked = false;
    document.getElementById('selected-seat-label').innerText = "No Seat Selected";
}

function generatePNR() {
    const pnr = "CEY-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    document.getElementById('pnr-display').innerText = pnr;
}

function filterTable() {
    const q = document.getElementById('table-search').value.toUpperCase();
    document.querySelectorAll("#booking-table-body tr").forEach(tr => {
        tr.style.display = tr.innerText.toUpperCase().includes(q) ? "" : "none";
    });
}