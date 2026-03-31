const form = document.getElementById('destinationForm');
const tableBody = document.getElementById('destinationTableBody');
const countSpan = document.getElementById('count');
const submitBtn = form.querySelector('button[type="submit"]');
const searchInput = document.getElementById('searchInput');

const API_URL = "http://localhost:8080/api/v1/flights";

let isEditMode = false;
let currentEditId = null;

async function loadDestinations() {
    try {
        const res = await fetch(`${API_URL}/destinations`);
        const destinations = await res.json();

        tableBody.innerHTML = '';
        destinations.forEach(dest => addRowToTable(dest));
        updateCount();
    } catch (err) {
        console.error("Load Error:", err);
    }
}

// ================= UPDATE COUNT =================
function updateCount() {
    const rows = tableBody.querySelectorAll('tr').length;
    countSpan.innerText = `${rows} Locations`;
}

function addRowToTable(dest) {
    const id = dest.id || dest.destId;
    const newRow = document.createElement('tr');
    newRow.id = `row-${id}`;
    newRow.className = "border-b border-gray-50 hover:bg-gray-50/50 transition destination-row";

    newRow.innerHTML = `
        <td class="px-8 py-5 city-cell">${dest.city}</td>
        <td class="px-8 py-5 text-center">
            <span class="bg-gray-100 px-3 py-1 rounded-md font-mono text-xs code-cell">
                ${dest.airportCode.toUpperCase()}
            </span>
        </td>
        <td class="px-8 py-5 text-right space-x-2">
            <button class="text-gray-400 hover:text-blue-500" onclick="editDestination(${id})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="text-gray-400 hover:text-red-500" onclick="deleteDestination(${id})">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    tableBody.appendChild(newRow);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cityInput = document.getElementById('city');
    const codeInput = document.getElementById('airportCode');

    if (!cityInput.value || !codeInput.value) return;

    const payload = {
        city: cityInput.value,
        airportCode: codeInput.value.toUpperCase()
    };

    try {
        let res;
        if (isEditMode) {
            res = await fetch(`${API_URL}/destination/${currentEditId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            res = await fetch(`${API_URL}/destination`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        if (!res.ok) throw new Error(await res.text());

        await loadDestinations();
        resetForm();
    } catch (err) {
        console.error(err);
        alert("Error: " + err.message);
    }
});

// ================= DELETE =================
async function deleteDestination(id) {
    if (!confirm("Are you sure you want to delete this destination?")) return;

    try {
        const res = await fetch(`${API_URL}/destination/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error("Failed to delete");

        const row = document.getElementById(`row-${id}`);
        if (row) row.remove();
        updateCount();

    } catch (err) {
        console.error(err);
        alert("Error deleting destination");
    }
}

// ================= EDIT =================
function editDestination(id) {
    const row = document.getElementById(`row-${id}`);
    const city = row.querySelector('.city-cell').textContent;
    const airportCode = row.querySelector('.code-cell').textContent.trim();

    document.getElementById('city').value = city;
    document.getElementById('airportCode').value = airportCode;

    isEditMode = true;
    currentEditId = id;
    if (submitBtn) submitBtn.innerText = "Update Destination";
}

// ================= RESET FORM =================
function resetForm() {
    form.reset();
    isEditMode = false;
    currentEditId = null;
    if (submitBtn) submitBtn.innerText = "Add Destination";
}

// ================= SEARCH FUNCTION =================
function filterDestinations() {
    const searchTerm = searchInput.value.toLowerCase();
    const rows = tableBody.querySelectorAll('.destination-row');

    rows.forEach(row => {
        const city = row.querySelector('.city-cell').textContent.toLowerCase();
        const code = row.querySelector('.code-cell').textContent.toLowerCase();

        if (city.includes(searchTerm) || code.includes(searchTerm)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

if (searchInput) {
    searchInput.addEventListener('input', filterDestinations);
}

// ================= INIT =================
window.addEventListener('DOMContentLoaded', loadDestinations);