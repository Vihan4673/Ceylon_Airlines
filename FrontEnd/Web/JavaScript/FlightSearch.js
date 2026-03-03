document.addEventListener("DOMContentLoaded", () => {
    // ===== Passenger / Cabin State Management =====
    let state = {
        adults: 1,
        children: 0,
        infants: 0,
        cabin: 'Economy'
    };

    const trigger = document.getElementById('passengerTrigger');
    const dropdown = document.getElementById('passengerDropdown');
    const summary = document.getElementById('passengerSummary');

    function toggleDropdown(e) {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    }

    trigger.addEventListener('click', toggleDropdown);

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });

    dropdown.addEventListener('click', (e) => e.stopPropagation());

    window.updateCount = function(type, delta, e) {
        if (e) e.preventDefault();
        const total = state.adults + state.children + state.infants + delta;
        if (type === 'adults' && state.adults + delta < 1) return;
        if (state[type] + delta < 0) return;
        if (total > 9) return;

        state[type] += delta;
        document.getElementById(`${type}Count`).innerText = state[type];
        updateSummary();
    };

    window.updateClass = function(val) {
        state.cabin = val;
        updateSummary();
    };

    function updateSummary() {
        const total = state.adults + state.children + state.infants;
        const travelerText = total > 1 ? 'Travelers' : 'Traveler';
        summary.innerText = `${total} ${travelerText}, ${state.cabin}`;
    }

    updateSummary();

    // ===== Trip Type Handling =====
    const tripRadios = document.querySelectorAll('input[name="trip"]');
    const returnContainer = document.getElementById('returnContainer');

    tripRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'oneway') {
                returnContainer.style.display = 'none';
            } else {
                returnContainer.style.display = 'block';
            }
        });
    });

    // ===== Flight Search / Autocomplete =====
    const fromInput = document.getElementById("fromLoc");
    const toInput = document.getElementById("toLoc");
    const depDate = document.getElementById("depDate");
    const retDate = document.getElementById("retDate");
    const searchBtn = document.getElementById("searchBtn");

    depDate.valueAsDate = new Date();

    // Create suggestion containers if not in HTML
    let fromSuggestions = document.getElementById("fromSuggestions");
    if (!fromSuggestions) {
        fromSuggestions = document.createElement('div');
        fromSuggestions.id = "fromSuggestions";
        fromSuggestions.className = "suggestions-list hidden";
        fromInput.parentElement.appendChild(fromSuggestions);
    }

    let toSuggestions = document.getElementById("toSuggestions");
    if (!toSuggestions) {
        toSuggestions = document.createElement('div');
        toSuggestions.id = "toSuggestions";
        toSuggestions.className = "suggestions-list hidden";
        toInput.parentElement.appendChild(toSuggestions);
    }

    let departures = [];
    let arrivals = [];

    async function fetchFlightLocations() {
        try {
            const res = await fetch("http://localhost:8080/api/v1/flights/getAllFlight");
            const data = await res.json();

            if (data && data.data) {
                const flights = data.data;
                const depSet = new Set();
                const arrSet = new Set();

                flights.forEach(f => {
                    if (f.departure) depSet.add(f.departure.toUpperCase());
                    if (f.arrival) arrSet.add(f.arrival.toUpperCase());
                });

                departures = Array.from(depSet).sort();
                arrivals = Array.from(arrSet).sort();
            }
        } catch (err) {
            console.error("Error fetching flights:", err);
        }
    }

    function setupAutocomplete(input, list, options) {
        input.addEventListener("input", () => {
            const val = input.value.toLowerCase();
            if (!val) return list.classList.add("hidden");

            const filtered = options.filter(opt => opt.toLowerCase().includes(val));
            if (filtered.length > 0) {
                list.innerHTML = filtered.map(opt => `
                    <div class="px-4 py-2 cursor-pointer hover:bg-gray-100" data-city="${opt}">
                        ${opt}
                    </div>
                `).join('');
                list.classList.remove("hidden");
            } else {
                list.classList.add("hidden");
            }
        });

        list.addEventListener("click", e => {
            const item = e.target.closest("[data-city]");
            if (item) {
                input.value = item.dataset.city;
                list.classList.add("hidden");
            }
        });
    }

    async function initAutocomplete() {
        await fetchFlightLocations();
        setupAutocomplete(fromInput, fromSuggestions, departures);
        setupAutocomplete(toInput, toSuggestions, arrivals);
    }

    initAutocomplete();

    document.addEventListener("click", (e) => {
        if (!fromInput.contains(e.target)) fromSuggestions.classList.add("hidden");
        if (!toInput.contains(e.target)) toSuggestions.classList.add("hidden");
    });

    // ===== Search Flights =====
    searchBtn.addEventListener("click", async () => {
        const fromCity = fromInput.value.trim().toUpperCase();
        const toCity = toInput.value.trim().toUpperCase();
        const date = depDate.value;
        const returnDateVal = retDate ? retDate.value : "";
        const cabin = state.cabin;

        if (!fromCity || !toCity) {
            alert("Please select both origin and destination.");
            return;
        }

        if (!departures.includes(fromCity)) {
            alert(`Origin "${fromCity}" does not exist in our flights.`);
            return;
        }

        if (!arrivals.includes(toCity)) {
            alert(`Destination "${toCity}" does not exist in our flights.`);
            return;
        }

        // Loading animation
        searchBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Searching...';
        searchBtn.disabled = true;

        setTimeout(() => {

            const params = new URLSearchParams({
                from: fromCity,
                to: toCity,
                dep: date,
                ret: returnDateVal,
                cabin: cabin,
                adults: state.adults,
                children: state.children,
                infants: state.infants
            });

            // ✅ FIXED: Params append karala redirect karanawa
            window.location.href = `../Pages/FlightBooking2.html?${params.toString()}`;

        }, 1000);
    });
});