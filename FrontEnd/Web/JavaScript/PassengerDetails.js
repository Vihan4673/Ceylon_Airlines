const API_BASE_URL = "http://localhost:8080/api/v1/passengers";

// ================= DATE CONVERTER =================
function convertToISO(dateStr) {
    if (!dateStr) return null;

    // If already yyyy-MM-dd
    if (dateStr.includes("-")) return dateStr;

    // If MM/DD/YYYY
    const parts = dateStr.split("/");
    if (parts.length === 3) {
        return `${parts[2]}-${parts[0]}-${parts[1]}`;
    }

    return null;
}

// ================= FETCH ALL PASSENGERS =================
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

// ================= RENDER PASSENGERS =================
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
            expDate && (expDate - today) < sixMonths && expDate > today;

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

// ================= SAVE PASSENGER =================
async function savePassenger() {
    const title = document.getElementById("title").value.trim();
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const genderEl = document.querySelector('input[name="gender"]:checked');
    const dobRaw = document.getElementById("dob").value;
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const passportNumber = document.getElementById("passportNumber").value.trim();
    const nationality = document.getElementById("nationality").value.trim();
    const expiryRaw = document.getElementById("passportExpiry").value;
    const privacyConsent = document.getElementById("privacyConsent").checked;

    const gender = genderEl ? genderEl.value : "";

    const dateOfBirth = convertToISO(dobRaw);
    const expiryDate = convertToISO(expiryRaw);

    // ===== VALIDATION =====
    if (!firstName || !lastName || !gender || !dateOfBirth ||
        !email || !mobile || !passportNumber || !nationality || !expiryDate) {
        alert("Please fill all required fields.");
        return;
    }

    if (!privacyConsent) {
        alert("You must accept the Privacy Policy.");
        return;
    }

    if (new Date(dateOfBirth) >= new Date()) {
        alert("Date of Birth must be in the past.");
        return;
    }

    if (new Date(expiryDate) <= new Date()) {
        alert("Passport expiry date must be in the future.");
        return;
    }

    const passengerDTO = {
        title,
        firstName,
        lastName,
        gender,
        dateOfBirth,
        email,
        phoneNumber: mobile,
        documentNumber: passportNumber,
        nationality,
        expiryDate
    };

    try {
        const res = await fetch(`${API_BASE_URL}/savePassenger`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(passengerDTO)
        });

        const result = await res.json();

        if (res.ok) {
            alert(result.message || "Passenger saved successfully");

            // ✅ Store passenger info for checkout page
            localStorage.setItem("passengerInfo", JSON.stringify(passengerDTO));

            // ✅ Redirect to checkout page automatically
            window.location.href = "../Pages/Checkout page.html";

        } else {
            alert(result.message || "Save failed. Check your data.");
        }
    } catch (error) {
        console.error("Save error:", error);
        alert("Server error. Cannot save passenger.");
    }
}

// ================= FORM SUBMIT =================
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("passengerForm");
    form?.addEventListener("submit", e => {
        e.preventDefault();
        savePassenger();
    });
});

// ================= DELETE PASSENGER =================
async function deletePassenger(id) {
    if (!confirm("Delete this passenger?")) return;

    try {
        const res = await fetch(`${API_BASE_URL}/deletePassenger/${id}`, { method: "DELETE" });
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

// ================= FORM SUBMIT =================
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("passengerForm");
    form?.addEventListener("submit", e => {
        e.preventDefault();
        savePassenger();
    });

    // Load passengers on page load
    fetchPassengers();
});