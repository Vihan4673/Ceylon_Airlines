// FlightSearch.js

const fromInput = document.getElementById("fromLoc");
const toInput = document.getElementById("toLoc");
const fromSuggestions = document.getElementById("fromSuggestions");
const toSuggestions = document.getElementById("toSuggestions");
const searchBtn = document.getElementById("searchBtn");

let airports = [];

// --- Fetch airports from backend ---
async function loadAirports() {
    try {
        const response = await fetch('http://localhost:8080/api/v1/flights/getAllFlight');
        const data = await response.json();

        if (data && data.data) {
            const airportSet = new Set();
            data.data.forEach(f => {
                if (f.departure) airportSet.add(f.departure);
                if (f.arrival) airportSet.add(f.arrival);
            });
            airports = Array.from(airportSet).map(code => ({ code: code, city: code }));
        }
    } catch (error) {
        console.error("Error fetching airports:", error);
    }
}

// --- Filter airports for suggestions ---
function filterAirports(query) {
    return airports.filter(
        airport =>
            airport.city.toLowerCase().includes(query.toLowerCase()) ||
            airport.code.toLowerCase().includes(query.toLowerCase())
    );
}

// --- Show suggestions below input ---
function showSuggestions(inputEl, suggestionsEl) {
    inputEl.addEventListener("input", () => {
        const value = inputEl.value.trim();
        if (!value) {
            suggestionsEl.classList.add("hidden");
            return;
        }

        const results = filterAirports(value);
        suggestionsEl.innerHTML = results
            .map(
                airport => `
            <div class="suggestion-item cursor-pointer px-2 py-1 hover:bg-slate-200 rounded">
                <span class="city font-bold text-sm">${airport.city}</span>
                <span class="code text-xs text-gray-500">(${airport.code})</span>
            </div>`
            )
            .join("");

        suggestionsEl.classList.remove("hidden");

        // Handle click on suggestion
        suggestionsEl.querySelectorAll(".suggestion-item").forEach(item => {
            item.addEventListener("click", () => {
                inputEl.value = `${item.querySelector(".city").textContent} ${item.querySelector(".code").textContent}`;
                suggestionsEl.classList.add("hidden");
            });
        });
    });

    // Hide suggestions if clicking outside
    document.addEventListener("click", e => {
        if (!suggestionsEl.contains(e.target) && e.target !== inputEl) {
            suggestionsEl.classList.add("hidden");
        }
    });
}

// --- Handle Search Button Click ---
searchBtn.addEventListener("click", () => {
    const fromCode = fromInput.value.split(" ")[1]?.replace(/[()]/g,'');
    const toCode = toInput.value.split(" ")[1]?.replace(/[()]/g,'');

    if (!fromCode || !toCode) {
        alert("Please select both origin and destination.");
        return;
    }

    // Redirect to FlightBooking.html with query params
    window.location.href = `../Pages/FlightBooking2.html`;
});

// --- Initialize ---
document.addEventListener("DOMContentLoaded", async () => {
    await loadAirports();
    showSuggestions(fromInput, fromSuggestions);
    showSuggestions(toInput, toSuggestions);
});