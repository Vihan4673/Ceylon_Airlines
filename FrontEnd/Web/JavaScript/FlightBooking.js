// FlightBooking.js

document.addEventListener("DOMContentLoaded", () => {

    const resultsContainer = document.getElementById("flight-results");

    // Get 'from' and 'to' from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const fromCode = urlParams.get("from");
    const toCode = urlParams.get("to");

    if (!fromCode || !toCode) {
        resultsContainer.innerHTML = "<p class='text-center text-red-500'>Invalid route selected.</p>";
        return;
    }

    // Load flights on page load
    loadFlights();

    async function loadFlights() {
        try {
            const response = await fetch("http://localhost:8080/api/v1/flights/getAllFlight");
            if (!response.ok) {
                resultsContainer.innerHTML = "<p class='text-center text-red-500'>Failed to load flights</p>";
                return;
            }

            const result = await response.json();
            const flights = result.data;

            if (!flights || flights.length === 0) {
                resultsContainer.innerHTML = "<p class='text-center text-gray-500'>No flights available</p>";
                return;
            }

            // Filter flights by selected from & to
            const matchingFlights = flights.filter(f => f.departure === fromCode && f.arrival === toCode);

            if (matchingFlights.length === 0) {
                resultsContainer.innerHTML = "<p class='text-center text-gray-500'>No flights found for this route.</p>";
                return;
            }

            resultsContainer.innerHTML = "";

            // Render matching flights
            matchingFlights.forEach(flight => {
                resultsContainer.appendChild(createFlightCard(flight));
            });

        } catch (error) {
            console.error("Error loading flights:", error);
            resultsContainer.innerHTML = "<p class='text-center text-red-500'>Server error</p>";
        }
    }

    // Create a flight card element
    function createFlightCard(flight) {
        const card = document.createElement("div");
        card.className = "bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 p-6 flex justify-between items-center mb-4";

        card.innerHTML = `
            <div class="flex space-x-8 items-center">
                <div class="text-center">
                    <div class="text-lg font-bold">${flight.departureTime || "N/A"}</div>
                    <div class="text-xs font-bold text-gray-500 uppercase">${flight.departure || "N/A"}</div>
                </div>

                <div class="text-center">
                    <div class="text-sm text-gray-500">Duration</div>
                    <div class="text-xs">${flight.duration || "N/A"}</div>
                </div>

                <div class="text-center">
                    <div class="text-lg font-bold">${flight.arrivalTime || "N/A"}</div>
                    <div class="text-xs font-bold text-gray-500 uppercase">${flight.arrival || "N/A"}</div>
                </div>
            </div>

            <div class="text-right">
                <div class="text-sm text-gray-500">Price</div>
                <div class="text-xl font-bold text-[#0054A4]">${flight.price ? "AUD " + flight.price : "N/A"}</div>
                <button class="mt-2 bg-[#0054A4] text-white px-4 py-2 rounded text-sm hover:bg-[#004080] select-btn">
                    Select
                </button>
            </div>
        `;

        // When clicking Select, save flight info and redirect
        card.querySelector(".select-btn").addEventListener("click", () => {
            localStorage.setItem("selectedFlight", JSON.stringify(flight));
            window.location.href = "FlightCheckout.html"; // redirect to next step (checkout page)
        });

        return card;
    }

});