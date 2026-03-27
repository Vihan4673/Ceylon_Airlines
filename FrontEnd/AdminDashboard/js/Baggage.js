
const API_BASE = "http://localhost:8080/api/v1/baggages"; // your Spring Boot API base
let allBaggages = [];
let activeFilter = "All";


async function fetchBaggages() {
    try {
        const res = await fetch(`${API_BASE}/all`);
        allBaggages = await res.json();
        renderBaggages();
        updateStats();
    } catch (err) {
        console.error("Failed to fetch baggages:", err);
    }
}

window.renderBaggages = () => {
    const list = document.getElementById("baggageList");
    const search = document.getElementById("searchInput").value.toLowerCase();

    let filtered = activeFilter === "All" ? allBaggages : allBaggages.filter(b => b.flightNo === activeFilter);

    if (search) {
        filtered = filtered.filter(b =>
            b.passenger.toLowerCase().includes(search) ||
            b.passportNo.toLowerCase().includes(search)
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
                    <h4 class="text-xl font-black text-gray-800 tracking-tight">${b.passenger}</h4>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Passport:</span>
                        <span class="text-xs font-bold text-[#8b1d41]">${b.passportNo}</span>
                    </div>
                </div>
            </div>
            <div class="flex flex-wrap gap-3 mb-8">
                <div class="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                    <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Flight No</p>
                    <p class="text-xs font-black text-gray-700">${b.flightNo}</p>
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
    const flights = [...new Set(allBaggages.map(b => b.flightNo))];
    const container = document.getElementById("dynamicFilters");
    container.innerHTML = flights.map(f => `
        <button onclick="setFilter('${f}')" id="f-${f}" class="filter-btn px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeFilter === f ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'}">
            ${f}
        </button>
    `).join('');
}

window.setFilter = (f) => {
    activeFilter = f;
    document.querySelectorAll(".filter-btn").forEach(b => {
        b.classList.remove("bg-gray-900", "text-white");
        b.classList.add("text-gray-400");
    });
    const btn = document.getElementById(`f-${f}`);
    if (btn) btn.classList.add("bg-gray-900", "text-white");
    renderBaggages();
};


function updateStats() {
    document.getElementById("statTotal").innerText = allBaggages.length;
    document.getElementById("statScan").innerText = allBaggages.filter(b => b.status === "Scanning").length;
    document.getElementById("statLoad").innerText = allBaggages.filter(b => b.status === "Loaded").length;
    document.getElementById("statArrived").innerText = allBaggages.filter(b => b.status === "Arrived").length;
}


window.updateStatus = async (id, status) => {
    try {
        await fetch(`${API_BASE}/status/${id}?status=${status}`, { method: "PATCH" });
        await fetchBaggages();
    } catch (err) {
        console.error("Status update failed:", err);
    }
};

window.deleteItem = async (id) => {
    if (!confirm("Delete this baggage record permanently?")) return;
    try {
        await fetch(`${API_BASE}/delete/${id}`, { method: "DELETE" });
        await fetchBaggages();
    } catch (err) {
        console.error("Delete failed:", err);
    }
};

window.openModal = () => document.getElementById("modal").classList.remove("hidden");
window.closeModal = () => document.getElementById("modal").classList.add("hidden");


const form = document.getElementById("baggageForm");
if (form) {
    form.onsubmit = async (e) => {
        e.preventDefault();
        const data = {
            passportNo: document.getElementById("fPassport").value.trim().toUpperCase(),
            passenger: document.getElementById("fName").value.trim(),
            flightNo: document.getElementById("fFlight").value.trim().toUpperCase(),
            tagId: document.getElementById("fTag").value.trim().toUpperCase(),
            status: "Checked"
        };

        try {
            await fetch(`${API_BASE}/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            closeModal();
            e.target.reset();
            fetchBaggages();
        } catch (err) {
            console.error("Failed to save baggage:", err);
        }
    };
}

fetchBaggages();