const API_BASE = "http://localhost:8080/api/v1/baggages";
const BOOKING_API = "http://localhost:8080/api/v1/bookings";
let allBaggages = [];
let activeFilter = "All";

async function fetchBaggages() {
    try {
        const res = await fetch(`${API_BASE}/all`);
        if (!res.ok) throw new Error("Failed to fetch baggages");
        allBaggages = await res.json();
        renderBaggages();
        updateStats();
    } catch (err) {
        console.error("Failed to fetch baggages:", err);
    }
}
window.renderBaggages = () => {
    const list = document.getElementById("baggageList");
    const searchInput = document.getElementById("searchInput");
    const search = searchInput ? searchInput.value.toLowerCase() : "";

    let filtered = activeFilter === "All" ? allBaggages : allBaggages.filter(b => b.flightNo === activeFilter);

    if (search) {
        filtered = filtered.filter(b =>
            (b.passenger || '').toLowerCase().includes(search) ||
            (b.passportNo || '').toLowerCase().includes(search) ||
            (b.tagId || '').toLowerCase().includes(search)
        );
    }

    if (filtered.length === 0) {
        list.innerHTML = `<div class="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
            <p class="text-gray-400">No matching records found.</p></div>`;
        return;
    }

    list.innerHTML = filtered.map(b => `
        <div class="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm card-hover relative group">
            <button onclick="deleteItem(${b.id})" class="absolute top-8 right-8 text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                <i class="fas fa-trash-alt"></i>
            </button>
            <div class="flex items-start gap-4 mb-6">
                <div class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl">
                    <i class="fas fa-passport text-gray-400"></i>
                </div>
                <div>
                    <h4 class="text-xl font-black text-gray-800 tracking-tight">${b.passenger || 'N/A'}</h4>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Passport:</span>
                        <span class="text-xs font-bold text-[#8b1d41]">${b.passportNo || 'N/A'}</span>
                    </div>
                </div>
            </div>
            <div class="flex flex-wrap gap-3 mb-8">
                <div class="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                    <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Flight No</p>
                    <p class="text-xs font-black text-gray-700">${b.flightNo || 'N/A'}</p>
                </div>
                <div class="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                    <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Tag ID</p>
                    <p class="text-xs font-black text-gray-700">${b.tagId || 'N/A'}</p>
                </div>
            </div>
            <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Current Status</p>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    ${['Checked', 'Scanning', 'Loaded', 'Arrived'].map(s => `
                        <div onclick="updateStatus(${b.id}, '${s}')"
                             class="status-pill px-3 py-3 rounded-2xl border border-gray-100 text-[10px] font-bold text-center uppercase tracking-tighter ${b.status === s ? 'active' : 'bg-gray-50/50 text-gray-400'}">
                            ${s}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');

    renderFilterButtons();
};

function renderFilterButtons() {
    const flights = [...new Set(allBaggages.map(b => b.flightNo).filter(f => f))];
    const container = document.getElementById("dynamicFilters");
    if(!container) return;

    container.innerHTML = flights.map(f => `
        <button onclick="setFilter('${f}')" id="f-${f}" class="filter-btn px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeFilter === f ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'}">
            ${f}
        </button>
    `).join('');
}

window.setFilter = (f) => {
    activeFilter = f;
    renderBaggages();
};

function updateStats() {
    const total = document.getElementById("statTotal");
    const scan = document.getElementById("statScan");
    const load = document.getElementById("statLoad");
    const arrived = document.getElementById("statArrived");

    if(total) total.innerText = allBaggages.length;
    if(scan) scan.innerText = allBaggages.filter(b => b.status === "Scanning").length;
    if(load) load.innerText = allBaggages.filter(b => b.status === "Loaded").length;
    if(arrived) arrived.innerText = allBaggages.filter(b => b.status === "Arrived").length;
}

window.updateStatus = async (id, status) => {
    try {
        const res = await fetch(`${API_BASE}/status/${id}?status=${status}`, { method: "PATCH" });
        if(res.ok) await fetchBaggages();
    } catch (err) {
        console.error("Status update failed:", err);
    }
};

window.deleteItem = async (id) => {
    if (!confirm("Delete this baggage record permanently?")) return;
    try {
        const res = await fetch(`${API_BASE}/delete/${id}`, { method: "DELETE" });
        if(res.ok) await fetchBaggages();
    } catch (err) {
        console.error("Delete failed:", err);
    }
};


window.openModal = () => document.getElementById("modal").classList.remove("hidden");
window.closeModal = () => {
    document.getElementById("modal").classList.add("hidden");
    const form = document.getElementById("baggageForm");
    if(form) form.reset();
};

// ================= PNR  =================
window.handlePNRLookup = async (pnr) => {
    const loader = document.getElementById("pnrLoader");
    const nameInput = document.getElementById("fName");
    const passportInput = document.getElementById("fPassport");
    const flightInput = document.getElementById("fFlight");
    const tagInput = document.getElementById("fTag");

    if (pnr.length < 3) {
        [nameInput, passportInput, flightInput, tagInput].forEach(i => i.value = '');
        return;
    }

    loader.classList.remove("hidden");
    try {
        const res = await fetch(`${BOOKING_API}/pnr/${pnr}`);
        if (!res.ok) throw new Error("PNR not found");

        const responseData = await res.json();
        const booking = responseData.data || responseData;

        const dbPassport = booking.passportNumber || booking.passportNo || '';

        nameInput.value = booking.passenger || '';
        flightInput.value = booking.flightNumber || '';
        passportInput.value = dbPassport;

        if(flightInput.value && passportInput.value) {
            tagInput.value = generateTag(passportInput.value, flightInput.value);
        }

    } catch (err) {
        console.error("PNR lookup failed:", err);
        [nameInput, passportInput, flightInput, tagInput].forEach(i => i.value = '');
    } finally {
        loader.classList.add("hidden");
    }
};

// ================= BAG TAG GENERATION =================
function generateTag(passport, flight) {
    if (!passport || !flight) return '';
    const random = Math.floor(1000 + Math.random() * 9000);
    const flightPart = flight.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const passPart = passport.toString().slice(-4).toUpperCase();
    return `${flightPart}-${passPart}-${random}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("baggageForm");
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();

            const data = {
                pnr: document.getElementById("fPNR").value.trim().toUpperCase(),
                passportNo: document.getElementById("fPassport").value.trim(),
                passenger: document.getElementById("fName").value.trim(),
                flightNo: document.getElementById("fFlight").value.trim(),
                tagId: document.getElementById("fTag").value.trim(),
                bagCount: parseInt(document.getElementById("fBagCount").value) || 1,
                status: "Checked"
            };

            if(!data.pnr || !data.passportNo || !data.flightNo) {
                alert("Please perform a valid PNR lookup first!");
                return;
            }

            try {
                const res = await fetch(`${API_BASE}/save`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                if (res.ok) {
                    closeModal();
                    fetchBaggages();
                } else {
                    const errorText = await res.text();
                    alert("Error: " + errorText);
                }
            } catch (err) {
                console.error("Submission error:", err);
            }
        };
    }

    fetchBaggages();
});