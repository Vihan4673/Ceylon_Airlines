const API_BASE_URL = "http://localhost:8080/api/v1/passengers";

// ================= 🔐 GET AUTH TOKEN =================
function getAuthToken() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found!");
        alert("Session expired. Please login again.");
        window.location.href = "LoginPage.html";
        return null;
    }
    return token;
}

// ================= 📅 DATE CONVERTER =================
function convertToISO(dateStr) {
    if (!dateStr) return null;
    return dateStr;
}

// ================= 🚀 FETCH ALL PASSENGERS =================
async function fetchPassengers() {
    const token = getAuthToken();
    if (!token) return;

    try {
        const res = await fetch(`${API_BASE_URL}/getAllPassengers`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const result = await res.json();

        if (res.ok) {
            renderPassengers(result.data || []);
        } else {
            console.error("Fetch failed:", result.message);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// ================= 📝 SAVE PASSENGER =================
async function savePassenger() {
    const token = getAuthToken();
    if (!token) return;

    // UI elements walin values ganna
    const title = document.getElementById("title")?.value;
    const firstName = document.getElementById("firstName")?.value.trim().toUpperCase();
    const lastName = document.getElementById("lastName")?.value.trim().toUpperCase();
    const genderEl = document.querySelector('input[name="gender"]:checked');
    const dobRaw = document.getElementById("dob")?.value;
    const email = document.getElementById("email")?.value.trim();
    const mobile = document.getElementById("mobile")?.value.trim();
    const passportNumber = document.getElementById("passportNumber")?.value.trim().toUpperCase();
    const nationality = document.getElementById("nationality")?.value.trim().toUpperCase();
    const expiryRaw = document.getElementById("passportExpiry")?.value;
    const privacyConsent = document.getElementById("privacyConsent")?.checked;

    const gender = genderEl ? genderEl.value.toUpperCase() : "";

    // Validation
    if (!firstName || !lastName || !gender || !dobRaw || !email || !mobile || !passportNumber || !nationality || !expiryRaw) {
        alert("Please fill all required fields.");
        return;
    }

    if (!privacyConsent) {
        alert("Please accept the terms.");
        return;
    }

    // Backend DTO ekata 100% match wenna ona
    const passengerDTO = {
        title: title,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        dateOfBirth: dobRaw,
        email: email,
        phoneNumber: mobile,
        // ✅ Passport number eka "passportNumber" widiyata save kala (Checkout ekata lesi wenna)
        passportNumber: passportNumber,
        documentNumber: passportNumber, // Backend compatibility
        nationality: nationality,
        expiryDate: expiryRaw
    };

    console.log("Submitting:", passengerDTO);

    try {
        const res = await fetch(`${API_BASE_URL}/savePassenger`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(passengerDTO)
        });

        const result = await res.json();

        if (res.ok) {
            alert("Passenger details saved successfully!");
            // ✅ LocalStorage ekata "currentPassenger" widiyata sampurna data set ekama damma
            localStorage.setItem("currentPassenger", JSON.stringify(passengerDTO));
            // ✅ Checkout page ekata yama
            window.location.href = "Checkout page.html";
        } else {
            alert(result.message || "Save failed.");
        }
    } catch (error) {
        console.error("Save error:", error);
        alert("Server connection error.");
    }
}

// ================= 🗑️ DELETE PASSENGER =================
async function deletePassenger(id) {
    const token = getAuthToken();
    if (!token || !confirm("Delete this passenger?")) return;

    try {
        const res = await fetch(`${API_BASE_URL}/deletePassenger/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
            alert("Passenger deleted.");
            fetchPassengers();
        }
    } catch (error) {
        alert("Delete failed.");
    }
}

// ================= 📊 RENDER TABLE =================
function renderPassengers(passengers) {
    const tbody = document.getElementById("passenger-table");
    if (!tbody) return;

    tbody.innerHTML = passengers.map(p => `
        <tr class="hover:bg-slate-50 border-b border-slate-100">
            <td class="px-6 py-4 font-bold text-slate-700">${p.title} ${p.firstName} ${p.lastName}</td>
            <td class="px-6 py-4 text-sm">${p.nationality}</td>
            <td class="px-6 py-4 font-mono text-xs">${p.documentNumber || p.passportNumber}</td>
            <td class="px-6 py-4 text-xs">${p.email}</td>
            <td class="px-6 py-4 text-xs font-bold">${p.expiryDate || p.passportExpiry}</td>
            <td class="px-6 py-4 text-right">
                <button onclick="deletePassenger(${p.id})" class="text-red-500 hover:underline">Delete</button>
            </td>
        </tr>
    `).join("");
}

// ================= 🚦 INITIALIZE =================
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("passengerForm");
    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        savePassenger();
    });

    if (document.getElementById("passenger-table")) {
        fetchPassengers();
    }
});