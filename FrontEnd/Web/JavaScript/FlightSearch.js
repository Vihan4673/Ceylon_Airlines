document.addEventListener("DOMContentLoaded", async () => {

    // =========================
    // Date Modal Section
    // =========================
    const dateTrigger = document.getElementById('dateTrigger');
    const dateModal = document.getElementById('dateModal');
    const closeModal = document.getElementById('closeModal');

    dateTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dateModal.classList.toggle('hidden');
        dateTrigger.classList.toggle('bg-blue-50');
    });

    closeModal.addEventListener('click', () => {
        dateModal.classList.add('hidden');
        dateTrigger.classList.remove('bg-blue-50');
    });

    document.addEventListener('click', (e) => {
        if (!dateModal.contains(e.target) && e.target !== dateTrigger) {
            dateModal.classList.add('hidden');
            dateTrigger.classList.remove('bg-blue-50');
        }
    });

    // =========================
    // Tab Switching
    // =========================
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // =========================
    // Flight Search Section
    // =========================
    const fromInput = document.getElementById("fromLoc");
    const toInput = document.getElementById("toLoc");
    const fromSuggestions = document.getElementById("fromSuggestions");
    const toSuggestions = document.getElementById("toSuggestions");
    const searchBtn = document.getElementById("searchBtn");

    let flights = [];
    let airports = [];

    // 🔹 Fetch flights once
    async function loadFlights() {
        try {
            const response = await fetch("http://localhost:8080/api/v1/flights/getAllFlight");
            const result = await response.json();

            if (result.code === 200 && result.data) {
                flights = result.data;

                // Extract unique airports
                const airportSet = new Set();
                flights.forEach(f => {
                    if (f.departure) airportSet.add(f.departure);
                    if (f.arrival) airportSet.add(f.arrival);
                });

                airports = Array.from(airportSet).map(code => ({
                    code,
                    city: code
                }));
            }
        } catch (error) {
            console.error("Error loading flights:", error);
        }
    }

    // 🔹 Filter airports
    function filterAirports(query) {
        return airports.filter(a =>
            a.code.toLowerCase().includes(query.toLowerCase())
        );
    }

    // 🔹 Extract airport code safely
    function extractCode(value) {
        const match = value.match(/\((.*?)\)/);
        return match ? match[1] : null;
    }

    // 🔹 Suggestion logic
    function setupSuggestions(inputEl, suggestionsEl) {

        inputEl.addEventListener("input", () => {
            const value = inputEl.value.trim();
            if (!value) {
                suggestionsEl.classList.add("hidden");
                return;
            }

            const results = filterAirports(value);

            suggestionsEl.innerHTML = results.map(a => `
                <div class="suggestion-item cursor-pointer px-2 py-1 hover:bg-slate-200 rounded">
                    <span class="city font-bold text-sm">${a.city}</span>
                    <span class="code text-xs text-gray-500">(${a.code})</span>
                </div>
            `).join("");

            suggestionsEl.classList.remove("hidden");

            suggestionsEl.querySelectorAll(".suggestion-item").forEach(item => {
                item.addEventListener("click", () => {
                    const city = item.querySelector(".city").textContent;
                    const code = item.querySelector(".code").textContent;
                    inputEl.value = `${city} ${code}`;
                    suggestionsEl.classList.add("hidden");
                });
            });
        });

        document.addEventListener("click", e => {
            if (!suggestionsEl.contains(e.target) && e.target !== inputEl) {
                suggestionsEl.classList.add("hidden");
            }
        });
    }

    // 🔹 Search Button
    searchBtn.addEventListener("click", () => {

        const fromCode = extractCode(fromInput.value);
        const toCode = extractCode(toInput.value);

        if (!fromCode || !toCode) {
            alert("Please select both origin and destination.");
            return;
        }

        const routeExists = flights.some(f =>
            f.departure === fromCode && f.arrival === toCode
        );

        if (!routeExists) {
            alert("No flights available for this route.");
            return;
        }

        window.location.href =
            `../Pages/FlightBooking2.html?from=${fromCode}&to=${toCode}`;
    });

    // =========================
    // Initialize
    // =========================
    await loadFlights();
    setupSuggestions(fromInput, fromSuggestions);
    setupSuggestions(toInput, toSuggestions);

});