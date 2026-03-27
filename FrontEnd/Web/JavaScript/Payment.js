// =====================================================
// GET DATA FROM LOCAL STORAGE
// =====================================================
const passenger = JSON.parse(localStorage.getItem("passengerInfo")) || {};
const flightState = JSON.parse(localStorage.getItem("selectedFlight")) || {};

// =====================================================
// FORMAT DATE
// =====================================================
function formatFullDate(dateStr) {
    if (!dateStr) return "Date not available";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

// =====================================================
// TEMPORARY PNR GENERATOR
// =====================================================
function generatePNR() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// =====================================================
// INIT PAGE & SHOW SUMMARY
// =====================================================
function initPage() {
    const bookingId = localStorage.getItem("bookingIdForPayment");
    if (!bookingId) {
        alert("❌ No booking found. Please select a flight first.");
        return;
    }

    const totalPrice = parseFloat(flightState.price?.toString().replace(/[^0-9.-]+/g, "")) || 0;

    setText("total-amount", `$${totalPrice.toFixed(2)}`);
    setText("btn-text", `Pay $${totalPrice.toFixed(2)}`);
    setText("summary-pnr", generatePNR());
    setText("summary-name", `${passenger.title || ""} ${passenger.firstName || ""} ${passenger.lastName || ""}`.trim());
    setText("summary-from", flightState.from || "Unknown");
    setText("summary-to", flightState.to || "Unknown");
}

// =====================================================
// HELPER FUNCTION
// =====================================================
function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value || "";
}

// =====================================================
// CARD FORM HELPERS
// =====================================================
function formatCardNumber(input) {
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let parts = [];
    for (let i = 0; i < value.length; i += 4) parts.push(value.substring(i, i + 4));
    input.value = parts.join(' ');
}

function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    input.value = value.length > 2 ? value.substring(0, 2) + '/' + value.substring(2, 4) : value;
}

function flipCard(flipped) {
    const card = document.getElementById('card-preview');
    flipped ? card.classList.add('flipped') : card.classList.remove('flipped');
}

function updateCardPreview() {
    document.getElementById('view-name').innerText = document.getElementById('card-name').value || "Your Name";
    document.getElementById('view-number').innerText = document.getElementById('card-number').value || "**** **** **** ****";
    document.getElementById('view-expiry').innerText = document.getElementById('card-expiry').value || "MM/YY";
    const cvv = document.getElementById('card-cvv').value;
    document.getElementById('view-cvv').innerText = cvv ? "*".repeat(cvv.length) : "***";
}

// =====================================================
// HANDLE PAYMENT & UPDATE BOOKING AS PAID
// =====================================================
async function handlePayment(e) {
    e.preventDefault();

    const btn = document.getElementById('submit-btn');
    const text = document.getElementById('btn-text');
    const spinner = document.getElementById('btn-spinner');

    btn.disabled = true;
    text.classList.add('hidden');
    spinner.classList.remove('hidden');

    const bookingId = localStorage.getItem("bookingIdForPayment");
    if (!bookingId) {
        alert("❌ Booking ID missing! Please go back and select a flight.");
        btn.disabled = false;
        text.classList.remove('hidden');
        spinner.classList.add('hidden');
        return;
    }

    const paymentData = {
        cardName: document.getElementById("card-name").value.trim(),
        cardNumber: document.getElementById("card-number").value.trim(),
        cardExpiry: document.getElementById("card-expiry").value.trim(),
        cardCVV: document.getElementById("card-cvv").value.trim(),
        paid: true,
        status: "CONFIRMED"
    };

    try {
        const res = await fetch(`http://localhost:8080/api/v1/bookings/${bookingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // important for cookies/session
            body: JSON.stringify(paymentData)
        });

        let data = {};
        try { data = await res.json(); } catch(e) { console.warn("No JSON returned"); }

        if (res.ok) {
            alert("✅ Payment successful! Booking updated.");
            localStorage.removeItem("bookingIdForPayment");
            localStorage.setItem("currentBooking", JSON.stringify(data.data || {}));
            document.getElementById("success-overlay")?.classList.remove("hidden");
        } else {
            console.error("Payment failed:", data);
            alert(data.message || "Payment failed!");
        }

    } catch(err) {
        console.error("Server error:", err);
        alert("❌ Server error during payment update!");
    } finally {
        btn.disabled = false;
        text.classList.remove('hidden');
        spinner.classList.add('hidden');
    }
}

// =====================================================
// INIT
// =====================================================
window.onload = initPage;

document.getElementById('payment-form')?.addEventListener('submit', handlePayment);
document.getElementById('card-number')?.addEventListener('input', function(){ formatCardNumber(this); updateCardPreview(); });
document.getElementById('card-expiry')?.addEventListener('input', function(){ formatExpiry(this); updateCardPreview(); });
document.getElementById('card-name')?.addEventListener('input', updateCardPreview);
document.getElementById('card-cvv')?.addEventListener('input', updateCardPreview);
document.getElementById('card-cvv')?.addEventListener('focus', () => flipCard(true));
document.getElementById('card-cvv')?.addEventListener('blur', () => flipCard(false));