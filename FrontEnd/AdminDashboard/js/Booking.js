// ================= BASE URL =================
const API_URL = "http://localhost:8080/api/v1/bookings";
let bookings = [];
let currentPNR = "";

// ================= NOTIFICATION =================
function showNotification(msg, isError = false) {
    const n = document.getElementById('notification');
    n.innerText = msg;
    n.style.backgroundColor = isError ? '#ef4444' : '#10b981';
    n.style.display = 'block';
    setTimeout(() => n.style.display = 'none', 3000);
}

// ================= RENDER TABLE =================
function renderTable() {
    const tbody = document.getElementById('booking-table-body');
    const countDisplay = document.getElementById('total-count');
    const revenueDisplay = document.getElementById('total-revenue');
    const seatDisplay = document.getElementById('active-seats');

    tbody.innerHTML = '';
    let totalRev = 0;

    bookings.forEach((booking, index) => {
        totalRev += booking.price;
        const paidBadge = booking.paid
            ? '<span class="status-badge bg-emerald-100 text-emerald-700">Paid</span>'
            : '<span class="status-badge bg-amber-100 text-amber-700">Unpaid</span>';

        const row = `
            <tr class="hover:bg-slate-50/80 transition-all group border-b border-slate-50">
                <td class="px-6 py-5">
                    <div class="flex flex-col">
                        <span class="font-mono font-black text-[#8A1538] text-sm tracking-tighter">${booking.pnr}</span>
                        <span class="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-widest">Flight: ${booking.flightNumber}</span>
                    </div>
                </td>
                <td class="px-6 py-5">
                    <div class="flex flex-col">
                        <span class="font-bold text-slate-800">${booking.passenger}</span>
                        <div class="flex items-center gap-1 text-[10px] text-slate-500 mt-1 font-semibold uppercase tracking-tighter">
                            <span>${booking.origin}</span>
                            <i class="fa-solid fa-arrow-right text-[8px] text-slate-300"></i>
                            <span>${booking.destination}</span>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-5">
                    <div class="flex flex-col">
                        <span class="text-xs font-bold text-slate-700">${booking.travelClass} Class | Seat ${booking.seat}</span>
                        <span class="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">Departs: ${booking.departureDate}</span>
                    </div>
                </td>
                <td class="px-6 py-5">
                    <div class="flex flex-col">
                        <span class="font-black text-slate-800 text-sm">$${booking.price.toFixed(2)}</span>
                        <div class="mt-1 flex items-center gap-2">
                            ${paidBadge}
                            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">${booking.status}</span>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-5 text-right">
                    <div class="flex justify-end gap-1">
                        <button class="p-2 text-slate-300 hover:text-[#8A1538] transition-colors"><i class="fa-solid fa-file-invoice"></i></button>
                        <button onclick="deleteBooking(${booking.id})" class="p-2 text-slate-300 hover:text-red-500 transition-colors"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });

    countDisplay.innerText = bookings.length;
    seatDisplay.innerText = bookings.length;
    revenueDisplay.innerText = `$${totalRev.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
}

// ================= GENERATE PNR =================
function generatePNR() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = 'CEY';
    for (let i = 0; i < 3; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    currentPNR = result;
    document.getElementById('pnr-display').innerText = result;
}

// ================= MODAL =================
function openModal() {
    document.getElementById('bookingModal').classList.remove('hidden');
    generatePNR();
    document.getElementById('m-departureDate').valueAsDate = new Date();
}

function closeModal() {
    document.getElementById('bookingModal').classList.add('hidden');
    ['m-passenger','m-origin','m-destination','m-flightNumber','m-seat','m-price'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('m-paid').checked = false;
}

// ================= SAVE BOOKING =================
async function saveBooking() {
    const bookingDate = new Date().toISOString().split('T')[0]; // Current date
    const data = {
        pnr: currentPNR,
        passenger: document.getElementById('m-passenger').value,
        flightNumber: document.getElementById('m-flightNumber').value,
        seat: document.getElementById('m-seat').value.toUpperCase(),
        bookingDate: bookingDate,
        departureDate: document.getElementById('m-departureDate').value,
        travelClass: document.getElementById('m-travelClass').value,
        price: parseFloat(document.getElementById('m-price').value) || 0,
        paid: document.getElementById('m-paid').checked,
        status: document.getElementById('m-paid').checked ? 'CONFIRMED' : 'PENDING',
        origin: document.getElementById('m-origin').value,
        destination: document.getElementById('m-destination').value
    };

    // Validation
    if (!data.passenger || !data.flightNumber || !data.seat || !data.departureDate || !data.origin || !data.destination) {
        showNotification("Please fill all required fields!", true);
        return;
    }

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (res.ok) {
            bookings.unshift(result.data);
            renderTable();
            closeModal();
            showNotification("Ticket Issued!");
        } else {
            showNotification(result.message || "Booking Failed", true);
        }
    } catch (err) {
        console.error(err);
        showNotification("Server Error", true);
    }
}

// ================= DELETE BOOKING =================
async function deleteBooking(id) {
    if(!confirm("Are you sure you want to VOID this booking?")) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (res.ok) {
            bookings = bookings.filter(b => b.id !== id);
            renderTable();
            showNotification("Booking Removed", true);
        } else {
            showNotification(result.message || "Failed to delete", true);
        }
    } catch(err) {
        console.error(err);
        showNotification("Server Error", true);
    }
}

// ================= FILTER TABLE =================
function filterTable() {
    const input = document.getElementById("searchInput").value.toUpperCase();
    const rows = document.getElementById("booking-table-body").getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const rowContent = rows[i].textContent.toUpperCase();
        rows[i].style.display = rowContent.indexOf(input) > -1 ? "" : "none";
    }
}

// ================= LOAD BOOKINGS ON PAGE LOAD =================
async function loadBookings() {
    try {
        const res = await fetch(API_URL);
        const result = await res.json();
        if(res.ok) {
            bookings = result.data || [];
            renderTable();
        } else {
            showNotification(result.message || "Failed to fetch bookings", true);
        }
    } catch(err) {
        console.error(err);
        showNotification("Server Error", true);
    }
}

window.onload = loadBookings;