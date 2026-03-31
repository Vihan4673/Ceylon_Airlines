document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = "http://localhost:8080/api/v1";

    const totalFlightsEl = document.getElementById('total-flights-count');
    const totalBookingsEl = document.getElementById('total-bookings-count');
    const totalRevenueEl = document.getElementById('total-revenue-text');
    const flightTableBody = document.getElementById('flight-table-body');
    const paxLoadCountEl = document.getElementById('pax-load-count');
    const clockEl = document.getElementById('dashboard-clock');

    function updateClock() {
        if (clockEl) {
            const now = new Date();
            clockEl.textContent = now.toLocaleString('en-US', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).toUpperCase();
        }
    }

    async function refreshDashboardData() {
        try {
            const flightRes = await fetch(`${BASE_URL}/flights/getAllFlight`);
            if (!flightRes.ok) throw new Error('Flight API failed');
            const flightData = await flightRes.json();

            if (flightData.code === 200) {
                const flights = flightData.data || [];
                if (totalFlightsEl) totalFlightsEl.textContent = flights.length;
                renderFlightTable(flights);
            }

            const bookingRes = await fetch(`${BASE_URL}/bookings`);
            if (!bookingRes.ok) throw new Error('Booking API failed');
            const bookingData = await bookingRes.json();

            if (bookingData.code === 200 || bookingData.status === 200) {
                const bookings = bookingData.data || [];

                if (totalBookingsEl) totalBookingsEl.textContent = bookings.length.toLocaleString();
                if (paxLoadCountEl) paxLoadCountEl.textContent = bookings.length.toLocaleString();

                const totalRev = bookings.reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0);

                if (totalRevenueEl) {
                    if (totalRev >= 1000000) {
                        totalRevenueEl.textContent = `$${(totalRev / 1000000).toFixed(2)}M`;
                    } else {
                        totalRevenueEl.textContent = `$${totalRev.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
                    }
                }
            }
        } catch (error) {
            console.error("Dashboard Sync Error:", error.message);
            if (flightTableBody && flightTableBody.innerHTML.includes('Loading')) {
                flightTableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-red-400">Connection error with backend.</td></tr>`;
            }
        }
    }


    function renderFlightTable(flights) {
        if (!flightTableBody) return;
        flightTableBody.innerHTML = '';

        if (flights.length === 0) {
            flightTableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-slate-400">No active flights found.</td></tr>`;
            return;
        }

        flights.slice(0, 5).forEach(flight => {
            const row = document.createElement('tr');
            row.className = "hover:bg-slate-50/80 transition-all cursor-pointer group border-b border-slate-100";

            let statusClass = "status-on-time";
            let statusText = flight.status || "On Time";

            const lowerStatus = statusText.toLowerCase();
            if (lowerStatus === "delayed" || lowerStatus === "cancelled") statusClass = "status-delayed";
            else if (lowerStatus === "airborne" || lowerStatus === "departed") statusClass = "status-airborne";

            const booked = flight.bookedSeats || 0;
            const total = flight.totalSeats || 100;
            const occupancy = Math.round((booked / total) * 100);

            row.innerHTML = `
                <td class="px-6 py-5">
                    <div class="flex flex-col">
                        <span class="font-bold text-[#8A1538]">${flight.flightNumber}</span>
                        <span class="text-[10px] text-slate-400 font-bold uppercase">${flight.aircraftType || 'A320neo'}</span>
                    </div>
                </td>
                <td class="px-6 py-5">
                    <div class="flex items-center gap-3">
                        <span class="font-bold text-slate-700">${flight.departure || 'CMB'}</span>
                        <i class="fas fa-arrow-right text-[10px] text-slate-300"></i>
                        <span class="font-bold text-slate-700">${flight.arrival || '---'}</span>
                    </div>
                </td>
                <td class="px-6 py-5">
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-slate-600">${occupancy}%</span>
                        <div class="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div class="bg-[#8A1538] h-full transition-all duration-700" style="width: ${occupancy}%"></div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-5 text-sm font-semibold text-slate-600">
                    ${flight.departureTime ? formatTime(flight.departureTime) : '--:--'}
                </td>
                <td class="px-6 py-5">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </td>
            `;
            flightTableBody.appendChild(row);
        });
    }

    function formatTime(isoStr) {
        try {
            const d = new Date(isoStr);
            if (isNaN(d.getTime())) return "--:--";
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        } catch (e) {
            return "--:--";
        }
    }

    updateClock();
    setInterval(updateClock, 1000);

    refreshDashboardData();
    setInterval(refreshDashboardData, 30000);
});