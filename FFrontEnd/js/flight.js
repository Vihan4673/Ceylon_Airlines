// flight.js

// Toggle modal visibility
function toggleModal(id) {
    document.getElementById(id).classList.toggle('hidden');
}

// Show toast notification
function showToast(title, msg, isError = false) {
    const t = document.getElementById('toast');
    document.getElementById('toast-title').innerText = title;
    document.getElementById('toast-msg').innerText = msg;

    // Change icon color for error
    const icon = t.querySelector('div.w-8');
    if (isError) icon.classList.replace('bg-emerald-500', 'bg-red-500');
    else icon.classList.replace('bg-red-500', 'bg-emerald-500');

    t.classList.remove('translate-y-32', 'opacity-0');
    setTimeout(() => {
        t.classList.add('translate-y-32', 'opacity-0');
    }, 3000);
}

// Handle Flight Form Submission
async function handleSubmitFlight() {
    const data = {
        flightNumber: document.getElementById('flightNumber').value.trim(),
        departure: document.getElementById('departure').value.trim(),
        arrival: document.getElementById('arrival').value.trim(),
        departureTime: document.getElementById('departureTime').value,
        arrivalTime: document.getElementById('arrivalTime').value
    };

    // Validate mandatory fields
    if (!data.flightNumber || !data.departure || !data.arrival) {
        showToast('Validation Error', 'Please fill all mandatory fields.', true);
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
            console.log('Backend response:', result);
            // Refresh flight table after adding
            await loadFlights();
        } else {
            showToast('Error', result.message || 'Failed to save flight.', true);
            console.error('Backend error:', result);
        }
    } catch (err) {
        showToast('Network Error', 'Could not connect to server.', true);
        console.error('Fetch error:', err);
    }
}

// Load all flights and populate table
async function loadFlights() {
    try {
        const response = await fetch('http://localhost:8080/api/v1/flights/getAllFlight');
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || 'Failed to fetch flights');

        const tbody = document.querySelector('table tbody');
        tbody.innerHTML = ''; // Clear existing rows

        result.data.forEach(flight => {
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
                </td>
                <td class="px-6 py-5">
                    <div class="text-xs font-bold text-slate-600">${flight.departureTime}</div>
                    <div class="text-[10px] text-slate-400">${flight.arrivalTime}</div>
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

// Delete a flight
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

// Initial load of flights on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFlights();
    // Close modal on backdrop click
    window.onclick = (e) => { if(e.target.id === 'flight-modal') toggleModal('flight-modal'); }
});