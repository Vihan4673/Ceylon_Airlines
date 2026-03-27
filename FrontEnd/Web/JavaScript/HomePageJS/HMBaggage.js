const API_URL = "http://localhost:8080/api/v1/baggages"; // base URL

const bagTagInput = document.getElementById("bagTagInput");
const trackBtn = document.getElementById("trackBtn");
const liveStatus = document.getElementById("liveStatus");
const statusText = document.getElementById("statusText");

const stepChecked = document.getElementById("step-checked");
const line1 = document.getElementById("line-1");
const stepFlight = document.getElementById("step-flight");
const line2 = document.getElementById("line-2");
const stepArrival = document.getElementById("step-arrival");

let liveInterval = null; // for auto-update

// Reset timeline visuals
function resetTimeline() {
    stepChecked.classList.remove("active");
    line1.classList.remove("active");
    stepFlight.classList.remove("active");
    line2.classList.remove("active");
    stepArrival.classList.remove("active");
}

// Update timeline based on baggage status
function updateTimeline(status) {
    resetTimeline();
    switch (status) {
        case "Checked":
            stepChecked.classList.add("active");
            break;
        case "On Flight":
            stepChecked.classList.add("active");
            line1.classList.add("active");
            stepFlight.classList.add("active");
            break;
        case "Arrived":
            stepChecked.classList.add("active");
            line1.classList.add("active");
            stepFlight.classList.add("active");
            line2.classList.add("active");
            stepArrival.classList.add("active");
            break;
        default:
            break;
    }
}

// Fetch baggage by passport number
async function fetchBaggageByPassport(passportNumber) {
    try {
        const res = await fetch(`${API_URL}/all`);
        if (!res.ok) throw new Error("Failed to fetch baggage data");

        const baggages = await res.json();
        // Match ignoring case and trimming spaces
        return baggages.find(b => b.passportNo?.trim().toUpperCase() === passportNumber.toUpperCase());
    } catch (err) {
        console.error(err);
        alert("Error fetching baggage data");
    }
}

// Function to start live auto-update
function startLiveUpdate(passportNumber) {
    if (liveInterval) clearInterval(liveInterval);
    liveInterval = setInterval(async () => {
        const baggage = await fetchBaggageByPassport(passportNumber);
        if (baggage) {
            liveStatus.classList.remove("hidden");
            statusText.textContent = baggage.status;
            updateTimeline(baggage.status);
        }
    }, 5000); // every 5 seconds
}

// Event listener: track button click
trackBtn.addEventListener("click", async () => {
    const passportNumber = bagTagInput.value.trim();
    if (!passportNumber) {
        alert("Please enter a passport number");
        return;
    }

    const baggage = await fetchBaggageByPassport(passportNumber);

    if (!baggage) {
        alert("No baggage found for this passport number");
        liveStatus.classList.add("hidden");
        if (liveInterval) clearInterval(liveInterval);
        return;
    }

    liveStatus.classList.remove("hidden");
    statusText.textContent = baggage.status;
    updateTimeline(baggage.status);

    // Start live auto-update
    startLiveUpdate(passportNumber);
});

// Hide live status when input changes
bagTagInput.addEventListener("input", () => {
    liveStatus.classList.add("hidden");
    if (liveInterval) clearInterval(liveInterval);
});