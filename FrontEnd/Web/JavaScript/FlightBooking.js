// =====================================================
// CONFIG
// =====================================================
const API_URL = "http://localhost:8080/api/v1/flights/getAllFlight";

// =====================================================
// READ URL PARAMETERS
// =====================================================
const params = new URLSearchParams(window.location.search);
const searchFrom = params.get("from");
const searchTo = params.get("to");
const searchDate = params.get("dep");
const searchReturn = params.get("ret");

// SINGLE STATE OBJECT
let state = {
    adults: parseInt(params.get("adults")) || 1,
    children: parseInt(params.get("children")) || 0,
    infants: parseInt(params.get("infants")) || 0,
    cabin: params.get("cabin") || "Economy"
};

// =====================================================
// UPDATE NAVBAR
// =====================================================
function updateNavbar() {
    const totalPassengers = state.adults + state.children + state.infants;

    if (searchFrom) {
        document.getElementById("navFromCode").innerText = searchFrom;
        document.getElementById("navFromCity").innerText = searchFrom;
    }
    if (searchTo) {
        document.getElementById("navToCode").innerText = searchTo;
        document.getElementById("navToCity").innerText = searchTo;
    }
    if (searchDate) {
        document.getElementById("navDepart").innerText = formatDate(searchDate);
    }
    document.getElementById("navReturn").innerText =
        searchReturn ? formatDate(searchReturn) : "-";

    document.getElementById("navPassengers").innerText =
        `${totalPassengers} Traveler${totalPassengers > 1 ? "s" : ""}`;
}

// =====================================================
// UPDATE HERO ROUTE TITLE
// =====================================================
function updateHeroRoute() {
    const heroTitle = document.getElementById("heroRoute");
    if (!heroTitle) return;
    if (searchFrom && searchTo) {
        heroTitle.innerText = `${searchFrom} to ${searchTo}`;
    }
}

// =====================================================
// FORMAT DATE
// =====================================================
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short"
    });
}

// =====================================================
// LOAD FLIGHTS FROM API
// =====================================================
async function loadFlights() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (result.status === 200 && result.data) {
            let flights = result.data;

            // FILTER BY ROUTE
            if (searchFrom && searchTo) {
                flights = flights.filter(f =>
                    f.departureCode?.toUpperCase() === searchFrom.toUpperCase() &&
                    f.arrivalCode?.toUpperCase() === searchTo.toUpperCase()
                );
            }

            renderFlights(flights);
        } else {
            console.error("No flight data found");
            document.getElementById('flights-container').innerHTML =
                `<p class="text-center p-10 text-gray-500">No flights available.</p>`;
        }
    } catch (err) {
        console.error("Error fetching flights:", err);
        document.getElementById('flights-container').innerHTML =
            `<p class="text-center p-10 text-red-500">Failed to load flights.</p>`;
    }
}

// =====================================================
// RENDER FLIGHTS DYNAMICALLY
// =====================================================
function renderFlights(flights) {
    const container = document.getElementById('flights-container');
    container.innerHTML = '';

    if (!flights || flights.length === 0) {
        container.innerHTML =
            `<p class="text-center p-10 text-gray-500">No flights available for this route.</p>`;
        return;
    }

    flights.forEach(flight => {
        const flightCard = document.createElement('div');
        flightCard.className = 'flight-card shadow-sm flex flex-col md:flex-row';

        flightCard.innerHTML = `
            <div class="flex-grow p-6 flex flex-col justify-between">
                <div class="flex items-center justify-between mb-8">
                    <div class="flex items-center gap-8">
                        <div class="text-center">
                            <p class="text-xl font-bold">${flight.departureTime}</p>
                            <p class="text-xs font-bold text-blue-600">${flight.departureCode}</p>
                            <p class="text-[9px] text-slate-400">${flight.departureAirport}</p>
                        </div>
                        <div class="flex flex-col items-center gap-1">
                            <p class="text-[10px] text-slate-400">
                                ${flight.stops > 0 ? flight.stops + " stops" : "nonstop"}
                            </p>
                            <div class="w-32 h-[1px] bg-slate-200"></div>
                        </div>
                        <div class="text-center">
                            <p class="text-xl font-bold">${flight.arrivalTime}</p>
                            <p class="text-xs font-bold text-blue-600">${flight.arrivalCode}</p>
                            <p class="text-[9px] text-slate-400">${flight.arrivalAirport}</p>
                        </div>
                    </div>
                    <div class="text-right hidden sm:block">
                        <p class="text-xs text-slate-500">${flight.duration}</p>
                        <p class="text-[11px] font-bold mt-1 text-slate-600">
                            ${flight.flightNumber} • ${flight.airline}
                        </p>
                    </div>
                </div>
            </div>

            <div class="flex border-t md:border-t-0">
                <div class="fare-box p-6 w-1/2 text-center cursor-pointer"
                     onclick="selectFare(this,'Economy','${flight.economyFare}','${flight.flightNumber}','${flight.departureCode}','${flight.arrivalCode}')">
                    <p class="text-sm font-bold text-blue-600">Economy</p>
                    <p class="text-2xl font-black">${flight.economyFare}</p>
                </div>
                <div class="fare-box p-6 w-1/2 text-center border-l cursor-pointer"
                     onclick="selectFare(this,'Business','${flight.businessFare}','${flight.flightNumber}','${flight.departureCode}','${flight.arrivalCode}')">
                    <p class="text-sm font-bold text-red-700">Business</p>
                    <p class="text-2xl font-black">${flight.businessFare}</p>
                </div>
            </div>
        `;
        container.appendChild(flightCard);
    });
}

// =====================================================
// SELECT FARE
// =====================================================
function selectFare(element, type, price, flightNumber, departureCode, arrivalCode) {
    document.querySelectorAll('.fare-box').forEach(box => box.classList.remove('selected'));
    element.classList.add('selected');

    const totalPassengers = state.adults + state.children;
    const numericPrice = parseInt(price.replace(/,/g, ""));
    const totalPrice = numericPrice * totalPassengers;

    document.getElementById('selected-flight-text').innerText =
        `${flightNumber} • ${departureCode} to ${arrivalCode} • ${type}`;

    document.getElementById('total-price-display').innerText =
        totalPrice.toLocaleString();

    const footer = document.getElementById('footer-summary');
    footer.classList.remove('hidden');
    footer.classList.add('active');

    localStorage.setItem('selectedFlight', JSON.stringify({
        flightNumber,
        from: departureCode,
        to: arrivalCode,
        cabin: type,
        price: totalPrice,
        adults: state.adults,
        children: state.children,
        infants: state.infants
    }));
}

// =====================================================
// CONTINUE BUTTON
// =====================================================
document.querySelector('#footer-summary button')
    ?.addEventListener('click', () => {
        if (!localStorage.getItem('selectedFlight')) {
            alert("Please select a flight first!");
            return;
        }
        window.location.href = "../Pages/PassengerDetails(3).html";
    });

// =====================================================
// INITIALIZE PAGE
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    updateHeroRoute();
    loadFlights();
});