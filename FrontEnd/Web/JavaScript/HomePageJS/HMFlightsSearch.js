// =====================================================
// STATE
// =====================================================
let state = {
    tripType: "return",
    adults: 1,
    children: 0,
    infants: 0,
    cabin: "Economy",
    destinations: [] // will hold destinations from DB
};

// =====================================================
// DOM READY
// =====================================================
document.addEventListener("DOMContentLoaded", async () => {
    await fetchDestinations();
    initTripType();
    initPassengerDropdown();
    initSearchButton();
    initDestinationInputs(); // Suggestion dropdown logic
    updatePassengerSummary();
});

// =====================================================
// FETCH DESTINATIONS FROM DB
// =====================================================
async function fetchDestinations() {
    try {
        const res = await fetch("http://localhost:8080/api/v1/flights/destinations");
        if (!res.ok) throw new Error("Failed to fetch destinations");
        state.destinations = await res.json();

        // Set default From/To
        if (state.destinations.length > 0) {
            const defaultDest = state.destinations[0];
            document.getElementById("fromLoc").value = `${defaultDest.city} (${defaultDest.airportCode})`;
            document.getElementById("toLoc").value = `${state.destinations[1] ? state.destinations[1].city + ' (' + state.destinations[1].airportCode + ')' : defaultDest.city + ' (' + defaultDest.airportCode + ')'}`;
        }
    } catch (err) {
        console.error("Error fetching destinations:", err);
        // fallback values
        document.getElementById("fromLoc").value = "Colombo (CMB)";
        document.getElementById("toLoc").value = "Dubai (DXB)";
    }
}

// =====================================================
// DESTINATION INPUT SUGGESTIONS - VALIDATE DUPLICATE
// =====================================================
function initDestinationInputs() {
    const fromInput = document.getElementById("fromLoc");
    const toInput = document.getElementById("toLoc");

    [fromInput, toInput].forEach(input => {
        const list = document.createElement("ul");
        list.classList.add("suggestions-list");
        list.style.display = "none";
        input.parentNode.appendChild(list);

        input.addEventListener("input", () => {
            const query = input.value.toLowerCase();
            list.innerHTML = "";

            const otherInput = input === fromInput ? toInput : fromInput;
            const otherValue = otherInput.value.toLowerCase();

            // Filter destinations, exclude city already selected in other input
            const matches = state.destinations.filter(d =>
                (d.city.toLowerCase().includes(query) || d.airportCode.toLowerCase().includes(query)) &&
                !otherValue.includes(d.city.toLowerCase()) // Prevent same city
            );

            if (matches.length > 0) {
                matches.forEach(d => {
                    const li = document.createElement("li");
                    li.classList.add("p-2", "hover:bg-gray-100", "cursor-pointer");
                    li.innerText = `${d.city} (${d.airportCode})`;
                    li.addEventListener("click", () => {
                        input.value = `${d.city} (${d.airportCode})`;
                        list.style.display = "none";

                        // Clear other input if duplicate value exists
                        if (otherInput.value.toLowerCase() === input.value.toLowerCase()) {
                            otherInput.value = "";
                        }
                    });
                    list.appendChild(li);
                });
                list.style.display = "block";
            } else {
                list.style.display = "none";
            }
        });

        document.addEventListener("click", e => {
            if (!input.parentNode.contains(e.target)) list.style.display = "none";
        });
    });
}

// =====================================================
// TRIP TYPE
// =====================================================
function initTripType() {
    const radios = document.querySelectorAll('input[name="trip"]');
    const returnContainer = document.getElementById("returnContainer");

    radios.forEach(radio => {
        radio.addEventListener("change", () => {
            state.tripType = radio.value;
            returnContainer.style.display = radio.value === "oneway" ? "none" : "block";
        });
    });
}

// =====================================================
// PASSENGER DROPDOWN
// =====================================================
function initPassengerDropdown() {
    const trigger = document.getElementById("passengerTrigger");
    const dropdown = document.getElementById("passengerDropdown");

    trigger.addEventListener("click", e => {
        if (!e.target.closest(".counter-btn") &&
            !e.target.closest("button") &&
            !e.target.closest("input[type='radio']")) {
            dropdown.classList.toggle("active");
        }
    });

    document.addEventListener("click", e => {
        if (!trigger.contains(e.target)) dropdown.classList.remove("active");
    });
}

// =====================================================
// UPDATE PASSENGER COUNT
// =====================================================
function updateCount(type, change, event) {
    event.stopPropagation();

    state[type] += change;

    if (type === "adults" && state.adults < 1) state.adults = 1;
    if (type !== "adults" && state[type] < 0) state[type] = 0;

    document.getElementById("adultsCount").innerText = state.adults;
    document.getElementById("childrenCount").innerText = state.children;
    document.getElementById("infantsCount").innerText = state.infants;

    updatePassengerSummary();
}

// =====================================================
// UPDATE CABIN
// =====================================================
function updateClass(cabin) {
    state.cabin = cabin;
    updatePassengerSummary();
}

// =====================================================
// PASSENGER SUMMARY
// =====================================================
function updatePassengerSummary() {
    let text = `${state.adults} Adult${state.adults > 1 ? 's' : ''}`;
    if (state.children > 0) text += `, ${state.children} Child${state.children > 1 ? 'ren' : ''}`;
    if (state.infants > 0) text += `, ${state.infants} Infant${state.infants > 1 ? 's' : ''}`;
    text += `, ${state.cabin}`;

    document.getElementById("passengerSummary").innerText = text;
}

// =====================================================
// SWAP FROM/TO LOCATIONS - PREVENT DUPLICATE
// =====================================================
function swapLocations() {
    const fromInput = document.getElementById('fromLoc');
    const toInput = document.getElementById('toLoc');

    // Prevent swap if both have same city
    if (fromInput.value.toLowerCase() === toInput.value.toLowerCase()) return;

    const temp = fromInput.value;
    fromInput.value = toInput.value;
    toInput.value = temp;

    const btnIcon = document.querySelector('.swap-btn i');
    btnIcon.style.transition = "transform 0.4s ease";
    btnIcon.style.transform = btnIcon.style.transform === "rotate(180deg)" ? "rotate(0deg)" : "rotate(180deg)";
}

// =====================================================
// SEARCH BUTTON
// =====================================================
function initSearchButton() {
    const searchBtn = document.getElementById("searchBtn");

    searchBtn.addEventListener("click", () => {
        const from = document.getElementById("fromLoc").value.trim();
        const to = document.getElementById("toLoc").value.trim();
        const dep = document.getElementById("depDate").value;
        const ret = document.getElementById("retDate").value;

        if (!from || !to || !dep) {
            alert("Please fill all required fields");
            return;
        }

        // Validate cities exist in DB
        const validFrom = state.destinations.some(d => from.toLowerCase().includes(d.city.toLowerCase()));
        const validTo = state.destinations.some(d => to.toLowerCase().includes(d.city.toLowerCase()));

        if (!validFrom || !validTo) {
            alert("Selected cities are not available in the database");
            return;
        }

        // Prevent same city for both From/To
        if (from.toLowerCase() === to.toLowerCase()) {
            alert("Departure and destination cannot be the same city");
            return;
        }

        searchBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Searching...';
        searchBtn.disabled = true;

        setTimeout(() => {
            const params = new URLSearchParams({
                from: from,
                to: to,
                dep: dep,
                cabin: state.cabin,
                adults: state.adults,
                children: state.children,
                infants: state.infants
            });

            if (state.tripType === "return" && ret) params.append("ret", ret);

            window.location.href = `../Pages/FlightBooking2.html?${params.toString()}`;
        }, 500);
    });
}