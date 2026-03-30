/**
 * Ceylon Airlines - Dashboard Intelligence Logic
 * Final Functional Version (March 2026)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Backend API Base Configuration
    const BASE_URL = "http://localhost:8080/api/v1";

    // 2. UI Elements Selection
    const totalFlightsEl = document.getElementById('total-flights-count');
    const totalBookingsEl = document.getElementById('total-bookings-count');
    const totalRevenueEl = document.getElementById('total-revenue-text');
    const flightTableBody = document.getElementById('flight-table-body');
    const paxLoadCountEl = document.getElementById('pax-load-count');
    const clockEl = document.getElementById('dashboard-clock');

    /**
     * Live Clock Function
     * සිස්ටම් එකේ වෙලාව තත්පරයෙන් තත්පරයට යාවත්කාලීන කරයි.
     */
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

    /**
     * Dashboard Data Synchronizer
     * Backend API හරහා ගුවන් ගමන් සහ වෙන් කිරීම් දත්ත ලබා ගනී.
     */
    async function refreshDashboardData() {
        try {
            // --- 1. FETCH FLIGHTS ---
            const flightRes = await fetch(`${BASE_URL}/flights/getAllFlight`);
            if (!flightRes.ok) throw new Error('Flight API failed');
            const flightData = await flightRes.json();

            // API එකෙන් එන දත්ත වල code එක 200 නම් පමණක් ක්‍රියාත්මක වේ
            if (flightData.code === 200) {
                const flights = flightData.data || [];
                if (totalFlightsEl) totalFlightsEl.textContent = flights.length;
                renderFlightTable(flights);
            }

            // --- 2. FETCH BOOKINGS ---
            const bookingRes = await fetch(`${BASE_URL}/bookings`);
            if (!bookingRes.ok) throw new Error('Booking API failed');
            const bookingData = await bookingRes.json();

            // code හෝ status 200 දැයි පරීක්ෂා කරයි
            if (bookingData.code === 200 || bookingData.status === 200) {
                const bookings = bookingData.data || [];

                // අගයන් update කිරීම
                if (totalBookingsEl) totalBookingsEl.textContent = bookings.length.toLocaleString();
                if (paxLoadCountEl) paxLoadCountEl.textContent = bookings.length.toLocaleString();

                // මුළු ආදායම ගණනය කිරීම (Price අගයන් එකතු කිරීම)
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
            // Error එකක් ආවොත් Table එකේ පණිවිඩයක් පෙන්වීමට
            if (flightTableBody && flightTableBody.innerHTML.includes('Loading')) {
                flightTableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-red-400">Connection error with backend.</td></tr>`;
            }
        }
    }

    /**
     * Table Renderer
     * දත්ත පේළි 5ක් පමණක් ලස්සනට table එකට ඇතුළු කරයි.
     */
    function renderFlightTable(flights) {
        if (!flightTableBody) return;
        flightTableBody.innerHTML = '';

        // දත්ත නොමැති නම්
        if (flights.length === 0) {
            flightTableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-slate-400">No active flights found.</td></tr>`;
            return;
        }

        flights.slice(0, 5).forEach(flight => {
            const row = document.createElement('tr');
            row.className = "hover:bg-slate-50/80 transition-all cursor-pointer group border-b border-slate-100";

            // Status Badge Logic
            let statusClass = "status-on-time";
            let statusText = flight.status || "On Time";

            const lowerStatus = statusText.toLowerCase();
            if (lowerStatus === "delayed" || lowerStatus === "cancelled") statusClass = "status-delayed";
            else if (lowerStatus === "airborne" || lowerStatus === "departed") statusClass = "status-airborne";

            // Occupancy (ආසන පිරී ඇති ප්‍රතිශතය)
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

    /**
     * ISO Time Formatter
     */
    function formatTime(isoStr) {
        try {
            const d = new Date(isoStr);
            if (isNaN(d.getTime())) return "--:--";
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        } catch (e) {
            return "--:--";
        }
    }

    // 3. Execution (Initialize)
    updateClock();
    setInterval(updateClock, 1000); // සෑම තත්පරයකම ඔරලෝසුව update වේ

    refreshDashboardData(); // මුලින්ම දත්ත ලබා ගනී
    setInterval(refreshDashboardData, 30000); // සෑම තත්පර 30කට වරක් auto-refresh වේ
});