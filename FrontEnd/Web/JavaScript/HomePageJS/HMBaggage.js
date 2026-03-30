// =====================================================
// CONFIGURATION & GLOBAL VARIABLES
// =====================================================
const API_URL = "http://localhost:8080/api/v1/baggages";

const bagTagInput = document.getElementById("bagTagInput");
const trackBtn = document.getElementById("trackBtn");
const liveStatus = document.getElementById("liveStatus");
const statusText = document.getElementById("statusText");

const stepChecked = document.getElementById("step-checked");
const stepFlight = document.getElementById("step-flight");
const stepArrival = document.getElementById("step-arrival");

let liveInterval = null;

// =====================================================
// UI RESET & UPDATE LOGIC
// =====================================================

// පවතින සියලුම Active classes ඉවත් කිරීම
function resetTimeline() {
    [stepChecked, stepFlight, stepArrival].forEach(step => {
        if (step) {
            step.classList.remove("bg-[#8b1d41]", "text-white", "border-[#8b1d41]", "scale-110", "shadow-lg");
            step.classList.add("bg-gray-100", "text-gray-400");
        }
    });
}

// Status එක අනුව Timeline එකේ පියවරවල් Active කිරීම
function updateTimeline(status) {
    resetTimeline();

    // දත්ත වල ඇති status එක පහත ඒවායින් එකක් විය හැක:
    // "Checked", "Scanning", "Loaded", "Arrived"
    const currentStatus = status ? status.trim() : "";

    // 1. Checked පියවර (සෑම විටම පළමු පියවර active වේ)
    if (currentStatus) {
        setActiveStep(stepChecked);
    }

    // 2. On Flight පියවර (Scanning හෝ Loaded තත්වයේදී active වේ)
    if (currentStatus === "Scanning" || currentStatus === "Loaded") {
        setActiveStep(stepFlight);
    }

    // 3. Arrival පියවර (Arrived වූ විට සියල්ල active වේ)
    if (currentStatus === "Arrived") {
        setActiveStep(stepFlight);
        setActiveStep(stepArrival);
    }
}

// Step එකක් Active කිරීමට අවශ්‍ය CSS Classes එකතු කිරීම
function setActiveStep(el) {
    if (!el) return;
    el.classList.remove("bg-gray-100", "text-gray-400");
    el.classList.add("bg-[#8b1d41]", "text-white", "border-[#8b1d41]", "scale-110", "shadow-lg");
}

// =====================================================
// DATA FETCHING
// =====================================================

async function fetchBaggageByPassport(passportNumber) {
    try {
        const res = await fetch(`${API_URL}/all`);
        if (!res.ok) throw new Error("Failed to fetch");

        const baggages = await res.json();
        // Passport අංකය හරියටම ගැලපෙන record එක සොයයි
        return baggages.find(b =>
            b.passportNo?.trim().toUpperCase() === passportNumber.toUpperCase()
        );
    } catch (err) {
        console.error("Fetch error:", err);
        return null;
    }
}

// =====================================================
// CORE TRACKING FUNCTIONS
// =====================================================

async function performTracking() {
    const passportNumber = bagTagInput.value.trim();

    if (!passportNumber) {
        alert("Please enter a passport number");
        return;
    }

    // Button loading state (Real-world feel)
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

    // UI පෙන්වීම සහ දත්ත යාවත්කාලීන කිරීම
    liveStatus.classList.remove("hidden");
    statusText.textContent = baggage.status;

    // Status එක අනුව Timeline update කිරීම
    updateTimeline(baggage.status);

    // සජීවීව දත්ත යාවත්කාලීන කිරීම ආරම්භ කරන්න
    startLiveUpdate(passportNumber);
}

function startLiveUpdate(passportNumber) {
    stopLiveUpdate();
    // සෑම තත්පර 5කට වරක්ම අලුත් දත්ත තිබේදැයි පරීක්ෂා කරයි
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

// =====================================================
// EVENT LISTENERS
// =====================================================

trackBtn.addEventListener("click", performTracking);

// Input එක වෙනස් කරන විට පරණ සෙවුම් ප්‍රතිඵල සඟවයි
bagTagInput.addEventListener("input", () => {
    if (bagTagInput.value.length === 0) {
        liveStatus.classList.add("hidden");
        stopLiveUpdate();
    }
});

// Enter key එක එබූ විටත් tracking සිදු කරයි
bagTagInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") performTracking();
});