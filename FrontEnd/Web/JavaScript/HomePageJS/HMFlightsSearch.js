const state = {
    tripType: "return",
    adults: 1,
    children: 0,
    infants: 0,
    cabin: "Economy",
    destinations: []
};

document.addEventListener("DOMContentLoaded", async () => {
    await fetchDestinations();
    initTripType();
    initPassengerDropdown();
    initDestinationInputs();
    initSwapButton();
    initSearchButton();
    updatePassengerSummary();
});

// ================= Destinations =================
async function fetchDestinations() {
    try {
        const res = await fetch("http://localhost:8080/api/v1/flights/destinations");
        if (!res.ok) throw new Error("Failed to fetch destinations");
        state.destinations = await res.json();

        if (state.destinations.length > 0) {
            const defaultFrom = state.destinations[0];
            const defaultTo = state.destinations[1] || defaultFrom;
            document.getElementById("fromLoc").value = `${defaultFrom.city} (${defaultFrom.airportCode})`;
            document.getElementById("toLoc").value = `${defaultTo.city} (${defaultTo.airportCode})`;
        }
    } catch (err) {
        console.error("Error fetching destinations:", err);
        document.getElementById("fromLoc").value = "Colombo (CMB)";
        document.getElementById("toLoc").value = "Dubai (DXB)";
    }
}

function initDestinationInputs() {
    const fromInput = document.getElementById("fromLoc");
    const toInput = document.getElementById("toLoc");

    [fromInput, toInput].forEach(input => {
        const list = document.createElement("ul");
        list.classList.add("suggestions-list");
        list.style.position = "absolute";
        list.style.zIndex = "50";
        list.style.background = "white";
        list.style.width = "100%";
        list.style.display = "none";
        input.parentNode.appendChild(list);

        input.addEventListener("input", () => {
            const query = input.value.toLowerCase();
            list.innerHTML = "";

            const otherInput = input === fromInput ? toInput : fromInput;
            const otherValue = otherInput.value.toLowerCase();

            const matches = state.destinations.filter(d =>
                (d.city.toLowerCase().includes(query) || d.airportCode.toLowerCase().includes(query)) &&
                !otherValue.includes(d.city.toLowerCase())
            );

            if (matches.length > 0) {
                matches.forEach(d => {
                    const li = document.createElement("li");
                    li.classList.add("p-2", "hover:bg-gray-100", "cursor-pointer");
                    li.innerText = `${d.city} (${d.airportCode})`;
                    li.addEventListener("click", () => {
                        input.value = `${d.city} (${d.airportCode})`;
                        list.style.display = "none";
                        if (otherInput.value.toLowerCase() === input.value.toLowerCase()) otherInput.value = "";
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

function initPassengerDropdown() {
    const trigger = document.getElementById("passengerTrigger");
    const dropdown = document.getElementById("passengerDropdown");

    trigger.addEventListener("click", e => {
        if (!e.target.closest(".counter-btn") &&
            !e.target.closest("button") &&
            !e.target.closest("input[type='radio']")) {
            dropdown.classList.toggle("hidden");
        }
    });

    document.addEventListener("click", e => {
        if (!trigger.contains(e.target)) dropdown.classList.add("hidden");
    });
}

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

function updateClass(cabin) {
    state.cabin = cabin;
    updatePassengerSummary();
}

function updatePassengerSummary() {
    let text = `${state.adults} Adult${state.adults > 1 ? 's' : ''}`;
    if (state.children > 0) text += `, ${state.children} Child${state.children > 1 ? 'ren' : ''}`;
    if (state.infants > 0) text += `, ${state.infants} Infant${state.infants > 1 ? 's' : ''}`;
    text += `, ${state.cabin}`;
    document.getElementById("passengerSummary").innerText = text;
}

function initSwapButton() {
    const btn = document.querySelector('.swap-btn');
    if (!btn) return;
    btn.addEventListener("click", swapLocations);
}

function swapLocations() {
    const fromInput = document.getElementById('fromLoc');
    const toInput = document.getElementById('toLoc');

    if (fromInput.value.toLowerCase() === toInput.value.toLowerCase()) return;

    const temp = fromInput.value;
    fromInput.value = toInput.value;
    toInput.value = temp;

    const btnIcon = document.querySelector('.swap-btn i');
    btnIcon.style.transition = "transform 0.4s ease";
    btnIcon.style.transform = btnIcon.style.transform === "rotate(180deg)" ? "rotate(0deg)" : "rotate(180deg)";
}

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

        const validFrom = state.destinations.some(d => from.toLowerCase().includes(d.city.toLowerCase()));
        const validTo = state.destinations.some(d => to.toLowerCase().includes(d.city.toLowerCase()));

        if (!validFrom || !validTo) {
            alert("Selected cities are not available in the database");
            return;
        }

        if (from.toLowerCase() === to.toLowerCase()) {
            alert("Departure and destination cannot be the same city");
            return;
        }

        searchBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Searching...';
        searchBtn.disabled = true;

        setTimeout(() => {
            const params = new URLSearchParams({
                from, to, dep, cabin: state.cabin,
                adults: state.adults,
                children: state.children,
                infants: state.infants
            });

            if (state.tripType === "return" && ret) params.append("ret", ret);

            window.location.href = `../Pages/FlightBooking2.html?${params.toString()}`;
        }, 500);
    });
}