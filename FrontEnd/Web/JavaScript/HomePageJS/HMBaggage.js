
const API_URL = "http://localhost:8080/api/v1/baggages";

const bagTagInput = document.getElementById("bagTagInput");
const trackBtn = document.getElementById("trackBtn");
const liveStatus = document.getElementById("liveStatus");
const statusText = document.getElementById("statusText");

const stepChecked = document.getElementById("step-checked");
const stepFlight = document.getElementById("step-flight");
const stepArrival = document.getElementById("step-arrival");

let liveInterval = null;

function resetTimeline() {
    [stepChecked, stepFlight, stepArrival].forEach(step => {
        if (step) {
            step.classList.remove("bg-[#8b1d41]", "text-white", "border-[#8b1d41]", "scale-110", "shadow-lg");
            step.classList.add("bg-gray-100", "text-gray-400");
        }
    });
}

function updateTimeline(status) {
    resetTimeline();

    const currentStatus = status ? status.trim() : "";

    if (currentStatus) {
        setActiveStep(stepChecked);
    }
    if (currentStatus === "Scanning" || currentStatus === "Loaded") {
        setActiveStep(stepFlight);
    }
    if (currentStatus === "Arrived") {
        setActiveStep(stepFlight);
        setActiveStep(stepArrival);
    }
}
function setActiveStep(el) {
    if (!el) return;
    el.classList.remove("bg-gray-100", "text-gray-400");
    el.classList.add("bg-[#8b1d41]", "text-white", "border-[#8b1d41]", "scale-110", "shadow-lg");
}

async function fetchBaggageByPassport(passportNumber) {
    try {
        const res = await fetch(`${API_URL}/all`);
        if (!res.ok) throw new Error("Failed to fetch");

        const baggages = await res.json();
        return baggages.find(b =>
            b.passportNo?.trim().toUpperCase() === passportNumber.toUpperCase()
        );
    } catch (err) {
        console.error("Fetch error:", err);
        return null;
    }
}

async function performTracking() {
    const passportNumber = bagTagInput.value.trim();

    if (!passportNumber) {
        alert("Please enter a passport number");
        return;
    }

    const originalText = trackBtn.innerText;
    trackBtn.innerText = "Tracking...";
    trackBtn.disabled = true;

    const baggage = await fetchBaggageByPassport(passportNumber);

    trackBtn.innerText = originalText;
    trackBtn.disabled = false;

    if (!baggage) {
        alert("No baggage records found for this passport number.");
        liveStatus.classList.add("hidden");
        stopLiveUpdate();
        return;
    }

    liveStatus.classList.remove("hidden");
    statusText.textContent = baggage.status;

    updateTimeline(baggage.status);
    startLiveUpdate(passportNumber);
}

function startLiveUpdate(passportNumber) {
    stopLiveUpdate();
    liveInterval = setInterval(async () => {
        const baggage = await fetchBaggageByPassport(passportNumber);
        if (baggage) {
            statusText.textContent = baggage.status;
            updateTimeline(baggage.status);
            console.log("Live update: Status is " + baggage.status);
        }
    }, 5000);
}

function stopLiveUpdate() {
    if (liveInterval) {
        clearInterval(liveInterval);
        liveInterval = null;
    }
}

trackBtn.addEventListener("click", performTracking);
bagTagInput.addEventListener("input", () => {
    if (bagTagInput.value.length === 0) {
        liveStatus.classList.add("hidden");
        stopLiveUpdate();
    }
});

bagTagInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") performTracking();
});