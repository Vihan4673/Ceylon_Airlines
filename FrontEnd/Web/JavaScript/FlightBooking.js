// FlightBooking.js

document.addEventListener("DOMContentLoaded", () => {

    const resultsContainer = document.getElementById("flight-results");

    const urlParams = new URLSearchParams(window.location.search);
    const fromCode = urlParams.get("from");
    const toCode = urlParams.get("to");

    if (!fromCode || !toCode) {
        resultsContainer.innerHTML =
            "<p class='text-center text-red-500'>Invalid route selected.</p>";
        return;
    }

    loadFlights();

    async function loadFlights() {
        try {
            const response = await fetch("http://localhost:8080/api/v1/flights/getAllFlight");

            if (!response.ok) {
                resultsContainer.innerHTML =
                    "<p class='text-center text-red-500'>Failed to load flights</p>";
                return;
            }

            const result = await response.json();
            const flights = result.data;

            if (!flights || flights.length === 0) {
                resultsContainer.innerHTML =
                    "<p class='text-center text-gray-500'>No flights available</p>";
                return;
            }

            // ✅ Filter by route
            const matchingFlights = flights.filter(
                f => f.departure === fromCode && f.arrival === toCode
            );

            if (matchingFlights.length === 0) {
                resultsContainer.innerHTML =
                    "<p class='text-center text-gray-500'>No flights found for this route.</p>";
                return;
            }

            // ✅ Get unique dates (assume flight.date exists)
            const uniqueDates = [...new Set(matchingFlights.map(f => f.date))];

            resultsContainer.innerHTML = "";

            // 🔹 Date Button Section
            const dateContainer = document.createElement("div");
            dateContainer.className = "mb-6";

            dateContainer.innerHTML = `
                <h3 class="font-bold mb-2">Available Dates:</h3>
                <div class="flex gap-2 flex-wrap">
                    ${uniqueDates.map(date =>
                `<button class="date-btn px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300">
                            ${date}
                        </button>`
            ).join("")}
                </div>
            `;

            resultsContainer.appendChild(dateContainer);

            // 🔹 Show all flights initially
            renderFlights(matchingFlights);

            // 🔹 Date click filter
            document.querySelectorAll(".date-btn").forEach(btn => {
                btn.addEventListener("click", () => {

                    const selectedDate = btn.textContent.trim();

                    const filteredByDate = matchingFlights.filter(
                        f => f.date === selectedDate
                    );

                    renderFlights(filteredByDate);
                });
            });

        } catch (error) {
            console.error("Error loading flights:", error);
            resultsContainer.innerHTML =
                "<p class='text-center text-red-500'>Server error</p>";
        }
    }

    // 🔹 Render Flights Function
    function renderFlights(flights) {

        // Remove old cards (keep date container)
        const oldCards = document.querySelectorAll(".flight-card");
        oldCards.forEach(card => card.remove());

        flights.forEach(flight => {
            resultsContainer.appendChild(createFlightCard(flight));
        });
    }

    // 🔹 Create Flight Card
    function createFlightCard(flight) {

        const card = document.createElement("div");
        card.className =
            "flight-card bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 p-6 flex justify-between items-center mb-4";

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
                <div class="text-xl font-bold text-[#0054A4]">
                    ${flight.price ? "AUD " + flight.price : "N/A"}
                </div>
                <button class="mt-2 bg-[#0054A4] text-white px-4 py-2 rounded text-sm hover:bg-[#004080] select-btn">
                    Select
                </button>
            </div>
        `;

        card.querySelector(".select-btn").addEventListener("click", () => {
            localStorage.setItem("selectedFlight", JSON.stringify(flight));
            window.location.href = "FlightCheckout.html";
        });

        return card;
    }

});