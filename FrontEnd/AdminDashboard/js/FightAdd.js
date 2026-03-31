let currentEditFlightId = null;

function toggleModal(id, show) {
    const modal = document.getElementById(id);
    if (!modal) return;
    if (show === true) modal.classList.remove('hidden');
    else if (show === false) {
        modal.classList.add('hidden');
        currentEditFlightId = null;
        clearFlightForm();
    } else modal.classList.toggle('hidden');
}

function showToast(title, msg, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    const titleEl = document.getElementById('toast-title');
    const msgEl = document.getElementById('toast-msg');
    if (titleEl) titleEl.innerText = title;
    if (msgEl) msgEl.innerText = msg;

    const icon = toast.querySelector('div.w-8');
    if (icon) {
        icon.classList.toggle('bg-emerald-500', !isError);
        icon.classList.toggle('bg-red-500', isError);
    }

    toast.classList.remove('translate-y-32', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-32', 'opacity-0'), 3000);
}

function calculateDuration() {
    const depTime = document.getElementById('departureTime').value;
    const arrTime = document.getElementById('arrivalTime').value;
    const durationEl = document.getElementById('duration');

    if (!depTime || !arrTime) {
        durationEl.value = '';
        return '';
    }

    const [depH, depM] = depTime.split(':').map(Number);
    const [arrH, arrM] = arrTime.split(':').map(Number);

    let depMinutes = depH * 60 + depM;
    let arrMinutes = arrH * 60 + arrM;

    if (arrMinutes < depMinutes) arrMinutes += 24 * 60;

    const diff = arrMinutes - depMinutes;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    durationEl.value = `${hours}h ${minutes}m`;
    return durationEl.value;
}

function convertDateTimeToISO(dateStr, timeStr) {
    if (!dateStr || !timeStr) return null;
    const [hours, minutes] = timeStr.split(':').map(Number);
    const dt = new Date(dateStr);
    dt.setHours(hours, minutes, 0, 0);
    return dt.toISOString();
}

function formatDateForInput(isoStr) {
    if (!isoStr) return '';
    return isoStr.split('T')[0];
}

function formatTimeForInput(isoStr) {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    return d.toTimeString().slice(0, 5);
}

function clearFlightForm() {
    ['flightNumber','totalSeats','economyFare','businessFare','departure','arrival','departureTime','arrivalTime','flightDate','duration']
        .forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    currentEditFlightId = null;
    const modalTitle = document.querySelector('#flight-modal h3');
    if (modalTitle) modalTitle.innerText = 'Schedule New Flight';
}

async function editFlight(id) {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/flights/searchFlight/${id}`);
        const result = await response.json();

        if (response.ok && result.data) {
            const flight = result.data;
            currentEditFlightId = flight.id;
            document.getElementById('flightNumber').value = flight.flightNumber;
            document.getElementById('totalSeats').value = flight.totalSeats;
            document.getElementById('economyFare').value = flight.economyFare;
            document.getElementById('businessFare').value = flight.businessFare;
            document.getElementById('departure').value = flight.departure;
            document.getElementById('arrival').value = flight.arrival;
            document.getElementById('flightDate').value = formatDateForInput(flight.flightDate);
            document.getElementById('departureTime').value = formatTimeForInput(flight.departureTime);
            document.getElementById('arrivalTime').value = formatTimeForInput(flight.arrivalTime);
            document.getElementById('duration').value = flight.duration;

            const modalTitle = document.querySelector('#flight-modal h3');
            if (modalTitle) modalTitle.innerText = 'Update Flight Details';

            toggleModal('flight-modal', true);
        }
    } catch (err) {
        console.error(err);
        showToast('Error', 'Could not fetch flight details.', true);
    }
}

async function handleSubmitFlight() {
    const flightNumberEl = document.getElementById('flightNumber');
    const totalSeatsEl = document.getElementById('totalSeats');
    const economyFareEl = document.getElementById('economyFare');
    const businessFareEl = document.getElementById('businessFare');
    const departureEl = document.getElementById('departure');
    const arrivalEl = document.getElementById('arrival');
    const departureTimeEl = document.getElementById('departureTime');
    const arrivalTimeEl = document.getElementById('arrivalTime');
    const flightDateEl = document.getElementById('flightDate');
    const durationEl = document.getElementById('duration');

    const duration = calculateDuration();

    const data = {
        id: currentEditFlightId,
        flightNumber: flightNumberEl.value.trim(),
        bookedSeats: 0,
        totalSeats: parseInt(totalSeatsEl.value) || 0,
        economyFare: parseFloat(economyFareEl.value) || 0,
        businessFare: parseFloat(businessFareEl.value) || 0,
        departure: departureEl.value.trim().toUpperCase(),
        arrival: arrivalEl.value.trim().toUpperCase(),
        flightDate: flightDateEl.value,
        departureTime: convertDateTimeToISO(flightDateEl.value, departureTimeEl.value),
        arrivalTime: convertDateTimeToISO(flightDateEl.value, arrivalTimeEl.value),
        duration: duration,
        status: 'On Time'
    };

    if (!data.flightNumber || !data.departure || !data.arrival || !data.totalSeats) {
        showToast('Validation Error', 'Please fill all required fields.', true);
        return;
    }

    const url = currentEditFlightId
        ? 'http://localhost:8080/api/v1/flights/updateFlight'
        : 'http://localhost:8080/api/v1/flights/saveFlight';

    const method = currentEditFlightId ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            toggleModal('flight-modal', false);
            showToast('Success', `Flight ${currentEditFlightId ? 'updated' : 'added'} successfully.`);
            await loadFlights();
            clearFlightForm();
        } else {
            const result = await response.json();
            showToast('Error', result?.message || `Error: ${response.status}`, true);
        }
    } catch (err) {
        console.error(err);
        showToast('Network Error', 'Could not connect to server.', true);
    }
}

async function loadFlights() {
    try {
        const response = await fetch('http://localhost:8080/api/v1/flights/getAllFlight');
        const result = await response.json();

        const tbody = document.querySelector('#flight-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        result.data.forEach(flight => {
            const booked = flight.bookedSeats || 0;
            const total = flight.totalSeats || 0;
            const progress = total ? ((booked / total) * 100).toFixed(1) : 0;

            const row = document.createElement('tr');
            row.className = 'hover:bg-slate-50/50 transition-all group';
            row.innerHTML = `
                <td class="px-8 py-5 font-black text-[#8A1538]">${flight.flightNumber}</td>
                <td class="px-6 py-5">
                    <div class="flex items-center gap-3">
                        <span class="font-bold text-slate-700">${flight.departure}</span>
                        <i class="fas fa-long-arrow-alt-right text-slate-300"></i>
                        <span class="font-bold text-slate-700">${flight.arrival}</span>
                    </div>
                    <p class="text-[10px] text-slate-400 mt-1 uppercase">${flight.departure} to ${flight.arrival} | ${flight.duration || '0h 0m'}</p>
                </td>
                <td class="px-6 py-5">
                    <div class="text-xs font-bold text-slate-600">${formatTime(flight.departureTime)}</div>
                    <div class="text-[10px] text-slate-400">${formatTime(flight.arrivalTime)}</div>
                </td>
                <td class="px-6 py-5">
                    <div class="space-y-1.5">
                        <div class="flex items-center gap-2 text-slate-700">
                            <i class="fas fa-user-check text-[10px] text-slate-400"></i>
                            <span class="font-bold text-xs"><span class="text-[#8A1538]">${booked}</span> / ${total}</span>
                        </div>
                        <div class="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div class="bg-[#8A1538] h-full" style="width: ${progress}%"></div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-5">
                    <span class="px-3 py-1 ${flight.status === 'On Time' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'} rounded-full text-[10px] font-bold uppercase tracking-wider">${flight.status || 'On Time'}</span>
                </td>
                <td class="px-8 py-5 text-right">
                    <div class="flex justify-end gap-2">
                        <button onclick="editFlight(${flight.id})" class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                            <i class="fas fa-edit text-xs"></i>
                        </button>
                        <button onclick="deleteFlight(${flight.id})" class="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all">
                            <i class="fas fa-trash text-xs"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error(err);
        showToast('Error', 'Could not load flights.', true);
    }
}

function formatTime(isoStr) {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    return d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

async function deleteFlight(id) {
    if (!confirm('Are you sure you want to delete this flight?')) return;
    try {
        const response = await fetch(`http://localhost:8080/api/v1/flights/deleteFlight/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showToast('Deleted', 'Flight removed successfully.');
            await loadFlights();
        }
    } catch (err) {
        console.error(err);
        showToast('Network Error', 'Could not connect to server.', true);
    }
}

function filterFlights() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('#flight-table-body tr').forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? '' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadFlights();
    window.onclick = (e) => {
        if(e.target.id === 'flight-modal') toggleModal('flight-modal', false);
    }
});