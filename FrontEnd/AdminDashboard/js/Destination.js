const form = document.getElementById('destinationForm');
const tableBody = document.getElementById('destinationTableBody');
const countSpan = document.getElementById('count');

const API_URL = "http://localhost:8080/api/v1/flights";

async function loadDestinations() {
    try {
        const res = await fetch(`${API_URL}/destinations`);
        const destinations = await res.json();

        tableBody.innerHTML = '';
        destinations.forEach(dest => addRowToTable(dest));
        countSpan.innerText = `${destinations.length} Locations`;
    } catch (err) {
        console.error(err);
    }
}

function addRowToTable(dest) {
    const newRow = document.createElement('tr');
    newRow.className = "border-b border-gray-50 hover:bg-gray-50/50 transition";

    newRow.innerHTML = `
        <td class="px-8 py-5">${dest.city}</td>
        <td class="px-8 py-5 text-center"><span class="bg-gray-100 px-3 py-1 rounded-md font-mono text-xs">${dest.airportCode.toUpperCase()}</span></td>
        <td class="px-8 py-5 text-right space-x-2">
            <button class="text-gray-400 hover:text-blue-500" onclick="editDestination(${dest.id}, this)"><i class="fas fa-edit"></i></button>
            <button class="text-gray-400 hover:text-red-500" onclick="deleteDestination(${dest.id}, this)"><i class="fas fa-trash"></i></button>
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
        const res = await fetch(`${API_URL}/destination`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(err);
        }

        const saved = await res.json();
        addRowToTable(saved);

        const rows = tableBody.querySelectorAll('tr').length;
        countSpan.innerText = `${rows} Locations`;

        cityInput.value = '';
        codeInput.value = '';

    } catch (err) {
        console.error(err);
        alert("Failed to add destination: " + err.message);
    }
});

async function deleteDestination(id, button) {
    if (!confirm("Are you sure you want to delete this destination?")) return;

    try {
        const res = await fetch(`${API_URL}/destination/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error("Failed to delete");

        button.closest('tr').remove();

        const rows = tableBody.querySelectorAll('tr').length;
        countSpan.innerText = `${rows} Locations`;

    } catch (err) {
        console.error(err);
        alert("Error deleting destination");
    }
}

function editDestination(id, button) {
    const row = button.closest('tr');
    const city = row.children[0].textContent;
    const airportCode = row.children[1].textContent.trim();

    document.getElementById('city').value = city;
    document.getElementById('airportCode').value = airportCode;
}

window.addEventListener('DOMContentLoaded', loadDestinations);