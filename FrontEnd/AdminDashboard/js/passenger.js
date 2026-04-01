const API_BASE_URL = "http://localhost:8080/api/v1/passengers";

function convertToISO(dateStr) {
    if (!dateStr) return null;

    if (dateStr.includes("-")) return dateStr;

    const parts = dateStr.split("/");
    if (parts.length === 3) {
        return `${parts[2]}-${parts[0]}-${parts[1]}`;
    }

    return null;
}

async function fetchPassengers() {
    try {
        const res = await fetch(`${API_BASE_URL}/getAllPassengers`);
        const result = await res.json();

        if (res.ok) {
            renderPassengers(result.data || []);
        } else {
            alert(result.message || "Failed to fetch passengers");
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Server connection error");
    }
}

function renderPassengers(passengers) {
    const tbody = document.getElementById("passenger-table");
    if (!tbody) return;

    if (!passengers || passengers.length === 0) {
        tbody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center py-6 text-slate-400">
                No passengers found
            </td>
        </tr>`;
        return;
    }

    tbody.innerHTML = passengers.map(p => {

        const initials =
            (p.firstName?.charAt(0) || "") +
            (p.lastName?.charAt(0) || "");

        const expDate = p.expiryDate ? new Date(p.expiryDate) : null;
        const today = new Date();
        const sixMonths = 1000 * 60 * 60 * 24 * 30 * 6;

        const isExpiring =
            expDate && expDate > today && (expDate - today) < sixMonths;

        return `
        <tr class="hover:bg-slate-50">
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        ${initials}
                    </div>
                    <div>
                        <p class="text-sm font-bold text-slate-700">
                            ${p.title || ""} ${p.firstName || ""} ${p.lastName || ""}
                        </p>
                        <p class="text-[10px] text-slate-400 uppercase">
                            ${p.gender || ""}
                        </p>
                    </div>
                </div>
            </td>

            <td class="px-6 py-4 text-sm text-slate-600">
                ${p.nationality || ""}
            </td>

            <td class="px-6 py-4">
                <span class="text-xs font-mono bg-slate-100 px-2 py-1 rounded-md">
                    ${p.documentNumber || ""}
                </span>
            </td>

            <td class="px-6 py-4 text-xs">
                <p>${p.email || ""}</p>
                <p class="text-slate-400">${p.phoneNumber || ""}</p>
            </td>

            <td class="px-6 py-4 text-xs font-bold ${isExpiring ? "text-amber-500" : "text-slate-500"}">
                ${p.expiryDate || ""}
                ${isExpiring ? `<span class="ml-1 text-[9px] bg-amber-100 px-1 rounded">Soon</span>` : ""}
            </td>

            <td class="px-6 py-4 text-right">
                <button onclick="deletePassenger(${p.id})"
                    class="text-red-500 hover:text-red-700 text-xs">
                    Delete
                </button>
            </td>
        </tr>
        `;
    }).join("");
}

async function savePassenger() {

    const dobRaw = document.getElementById("p-dob").value;
    const expiryRaw = document.getElementById("p-expiry").value;

    const dateOfBirth = convertToISO(dobRaw);
    const expiryDate = convertToISO(expiryRaw);

    if (!dateOfBirth || !expiryDate) {
        alert("Date of Birth and Expiry Date are required");
        return;
    }

    if (new Date(dateOfBirth) >= new Date()) {
        alert("Date of Birth must be in the past");
        return;
    }

    const newPassenger = {
        title: document.getElementById("p-title").value,
        firstName: document.getElementById("p-fn").value,
        lastName: document.getElementById("p-ln").value,
        gender: document.getElementById("p-gender").value,
        dateOfBirth: dateOfBirth,
        nationality: document.getElementById("p-nat").value,
        documentNumber: document.getElementById("p-doc").value,
        expiryDate: expiryDate,
        email: document.getElementById("p-email").value,
        phoneNumber: document.getElementById("p-phone").value
    };

    if (!newPassenger.firstName || !newPassenger.documentNumber) {
        alert("Name and Passport No required");
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/savePassenger`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPassenger)
        });

        const result = await res.json();

        if (res.ok) {
            alert(result.message || "Passenger saved successfully");
            closeModal();
            fetchPassengers();
        } else {
            alert(result.message || "Save failed");
        }

    } catch (error) {
        console.error("Save error:", error);
        alert("Server error");
    }
}

async function deletePassenger(id) {

    if (!confirm("Delete this passenger?")) return;

    try {
        const res = await fetch(`${API_BASE_URL}/deletePassenger/${id}`, {
            method: "DELETE"
        });

        const result = await res.json();

        if (res.ok) {
            alert(result.message || "Passenger deleted");
            fetchPassengers();
        } else {
            alert(result.message || "Delete failed");
        }

    } catch (error) {
        console.error("Delete error:", error);
        alert("Server error");
    }
}


function openModal() {
    document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

window.onload = fetchPassengers;

let allPassengers = [];
const originalRender = window.renderPassengers;
window.renderPassengers = function(data) {
    allPassengers = data;
    updateStats(data);

    const searchVal = document.getElementById('searchInput').value.toLowerCase();
    const natFilter = document.getElementById('filterNationality').value;

    const filtered = data.filter(p => {
        const matchesSearch = (p.firstName + p.lastName + p.documentNumber + p.email).toLowerCase().includes(searchVal);
        const matchesNat = natFilter === "" || p.nationality === natFilter;
        return matchesSearch && matchesNat;
    });

    const tbody = document.getElementById("passenger-table");
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-12 text-slate-400 font-medium">No results found for your filters</td></tr>`;
        return;
    }

    displayData(filtered);
};

function updateStats(data) {
    document.getElementById('stat-total').innerText = data.length.toLocaleString();
    const expiringCount = data.filter(p => {
        const expDate = new Date(p.expiryDate);
        const today = new Date();
        const sixMonths = 1000 * 60 * 60 * 24 * 30 * 6;
        return expDate > today && (expDate - today) < sixMonths;
    }).length;
    document.getElementById('stat-expiring').innerText = expiringCount;
}

function displayData(data) {
    const tbody = document.getElementById("passenger-table");
    tbody.innerHTML = data.map(p => {
        const initials = (p.firstName?.charAt(0) || "") + (p.lastName?.charAt(0) || "");
        const expDate = p.expiryDate ? new Date(p.expiryDate) : null;
        const today = new Date();
        const sixMonths = 1000 * 60 * 60 * 24 * 30 * 6;
        const isExpiring = expDate && expDate > today && (expDate - today) < sixMonths;

        return `
            <tr class="hover:bg-slate-50/80 transition-colors">
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                            ${initials}
                        </div>
                        <div>
                            <p class="text-sm font-bold text-slate-700">${p.title || ""} ${p.firstName || ""} ${p.lastName || ""}</p>
                            <p class="text-[10px] text-slate-400 uppercase font-bold">${p.gender || ""}</p>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-slate-600 font-medium">${p.nationality || ""}</td>
                <td class="px-6 py-4">
                    <span class="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded-md border border-slate-200 tracking-wider">
                        ${p.documentNumber || ""}
                    </span>
                </td>
                <td class="px-6 py-4 text-xs">
                    <p class="font-bold text-slate-700">${p.email || ""}</p>
                    <p class="text-slate-400 font-medium">${p.phoneNumber || ""}</p>
                </td>
                <td class="px-6 py-4 text-xs font-bold ${isExpiring ? "text-amber-600" : "text-slate-500"}">
                    <div class="flex items-center gap-1">
                        ${p.expiryDate || ""}
                        ${isExpiring ? `<span class="bg-amber-100 text-amber-600 text-[9px] px-1.5 py-0.5 rounded uppercase tracking-tighter">Soon</span>` : ""}
                    </div>
                </td>
                <td class="px-6 py-4 text-right">
                    <button onclick="deletePassenger(${p.id})" class="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete Profile">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </td>
            </tr>`;
    }).join("");
}

document.getElementById('searchInput').addEventListener('input', () => window.renderPassengers(allPassengers));
document.getElementById('filterNationality').addEventListener('change', () => window.renderPassengers(allPassengers));