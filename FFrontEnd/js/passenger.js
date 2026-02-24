const API_BASE_URL = "http://localhost:8080/api/v1/passengers";

// ================= DATE CONVERTER =================
function convertToISO(dateStr) {
    if (!dateStr) return null;

    // If already yyyy-MM-dd (input type="date")
    if (dateStr.includes("-")) return dateStr;

    // If MM/DD/YYYY
    const parts = dateStr.split("/");
    if (parts.length === 3) {
        return `${parts[2]}-${parts[0]}-${parts[1]}`;
    }

    return null;
}

// ================= FETCH ALL =================
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

// ================= RENDER =================
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

// ================= SAVE =================
async function savePassenger() {

    const dobRaw = document.getElementById("p-dob").value;
    const expiryRaw = document.getElementById("p-expiry").value;

    const dateOfBirth = convertToISO(dobRaw);
    const expiryDate = convertToISO(expiryRaw);

    // Frontend validation
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

// ================= DELETE =================
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

// ================= MODAL =================
function openModal() {
    document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

// ================= LOAD =================
window.onload = fetchPassengers;