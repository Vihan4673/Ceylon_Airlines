// flight.js

// Toggle modal visibility
function toggleModal(id) {
    document.getElementById(id).classList.toggle('hidden');
}

// Show toast notification
function showToast(title, msg, isError = false) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-title').innerText = title;
    document.getElementById('toast-msg').innerText = msg;

    const icon = toast.querySelector('div.w-8');
    if (isError) icon.classList.replace('bg-emerald-500', 'bg-red-500');
    else icon.classList.replace('bg-red-500', 'bg-emerald-500');

    toast.classList.remove('translate-y-32', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-32', 'opacity-0');
    }, 3000);
}

// Submit new flight
async function handleSubmitFlight() {
    const data = {
        flightNumber: document.getElementById('flightNumber').value.trim(),
        bookedSeats: parseInt(document.getElementById('bookedSeats').value) || 0,
        totalSeats: parseInt(document.getElementById('totalSeats').value) || 0,
        departure: document.getElementById('departure').value.trim(),
        arrival: document.getElementById('arrival').value.trim(),
        departureTime: document.getElementById('departureTime').value,
        arrivalTime: document.getElementById('arrivalTime').value
    };

    // Validation
    if (!data.flightNumber || !data.departure || !data.arrival || !data.totalSeats) {
        showToast('Validation Error', 'Please fill all required fields.', true);
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/v1/flights/saveFlight', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            toggleModal('flight-modal');
            showToast('Flight Scheduled', `Flight ${data.flightNumber} added successfully.`);
            await loadFlights();
        } else {
            showToast('Error', result.message || 'Failed to save flight.', true);
            console.error(result);
        }
    } catch (err) {
        showToast('Network Error', 'Could not connect to server.', true);
        console.error(err);
    }
}

// Load flights dynamically into table
async function loadFlights() {
    try {
        const response = await fetch('http://localhost:8080/api/v1/flights/getAllFlight');
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || 'Failed to fetch flights');

        const tbody = document.querySelector('table tbody');
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
                    <p class="text-[10px] text-slate-400 mt-1 uppercase">${flight.departure} to ${flight.arrival}</p>
                </td>
                <td class="px-6 py-5">
                    <div class="text-xs font-bold text-slate-600">${flight.departureTime}</div>
                    <div class="text-[10px] text-slate-400">${flight.arrivalTime}</div>
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
                        <button class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><i class="fas fa-edit text-xs"></i></button>
                        <button onclick="deleteFlight(${flight.id})" class="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"><i class="fas fa-trash text-xs"></i></button>
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

// Delete flight
async function deleteFlight(id) {
    if (!confirm('Are you sure you want to delete this flight?')) return;
    try {
        const response = await fetch(`http://localhost:8080/api/v1/flights/deleteFlight/${id}`, { method: 'DELETE' });
        const result = await response.json();

        if (response.ok) {
            showToast('Deleted', 'Flight removed successfully.');
            await loadFlights();
        } else {
            showToast('Error', result.message || 'Failed to delete flight.', true);
        }
    } catch (err) {
        console.error(err);
        showToast('Network Error', 'Could not connect to server.', true);
    }
}

// Load flights on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFlights();
    window.onclick = (e) => { if(e.target.id === 'flight-modal') toggleModal('flight-modal'); }
});