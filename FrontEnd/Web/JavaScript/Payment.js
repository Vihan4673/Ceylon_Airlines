const API_BASE = "http://localhost:8080/api/v1/bookings";
let currentBooking = null;


async function initPage() {
    const savedPnr = localStorage.getItem("currentBookingPNR");

    if (!savedPnr) {
        console.error("PNR not found in localStorage");
        alert("Booking session expired. Redirecting to checkout...");
        window.location.href = "../Pages/Checkout.html";
        return;
    }

    try {
        const response = await fetch(`${API_BASE}`);
        const result = await response.json();

        if (response.ok && result.data) {
            const matched = result.data.find(b => b.pnr === savedPnr);

            if (matched) {
                currentBooking = matched;
                console.log("Booking Synced (with Passport):", currentBooking);
                renderBookingDetails(currentBooking);
            } else {
                console.error("PNR not found in Database.");
                alert("Booking details not found. Please try again.");
            }
        }
    } catch (error) {
        console.error("Sync Error:", error);
    }
}

async function handlePayment(e) {
    e.preventDefault();

    const savedPnr = localStorage.getItem("currentBookingPNR");

    if (!currentBooking || !savedPnr) {
        alert("Please wait until booking data is loaded...");
        return;
    }

    const btn = document.getElementById('submit-btn');
    const spinner = document.getElementById('btn-spinner');
    const btnText = document.getElementById('btn-text');

    btn.disabled = true;
    spinner?.classList.remove('hidden');
    btnText?.classList.add('hidden');

    const updateData = {
        id: currentBooking.id,
        pnr: currentBooking.pnr,
        passenger: currentBooking.passenger,
        email: currentBooking.email || "",
        passportNumber: currentBooking.passportNumber || "",
        flightNumber: currentBooking.flightNumber,
        origin: currentBooking.origin,
        destination: currentBooking.destination,
        seat: currentBooking.seat,
        departureDate: currentBooking.departureDate,
        travelClass: currentBooking.travelClass,
        price: currentBooking.price,
        bookingDate: currentBooking.bookingDate,
        paid: true,
        status: "CONFIRMED"
    };

    console.log("Final Payload to Backend (Updating Paid Status):", updateData);

    try {
        const res = await fetch(`${API_BASE}/pnr/${savedPnr}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(updateData)
        });

        const responseJson = await res.json();

        if (res.ok) {
            console.log("Payment & DB Update Success!");
            alert("Payment Successful! Your ticket is confirmed.");

            localStorage.removeItem("currentBookingPNR");
            localStorage.removeItem("bookingIdForPayment");

            document.getElementById("success-overlay")?.classList.remove("hidden");
        } else {
            console.error("Backend Error Details:", responseJson);
            alert("Update Failed: " + (responseJson.message || "Invalid Data Format"));
        }
    } catch (err) {
        console.error("Network Error:", err);
        alert("Server not reachable.");
    } finally {
        btn.disabled = false;
        spinner?.classList.add('hidden');
        btnText?.classList.remove('hidden');
    }
}

function renderBookingDetails(data) {
    setText("summary-pnr", data.pnr);
    setText("summary-name", data.passenger);
    setText("summary-from", data.origin);
    setText("summary-to", data.destination);
    setText("summary-passport", data.passportNumber);

    const price = parseFloat(data.price) || 0;
    setText("total-amount", `$${price.toFixed(2)}`);
    setText("btn-text", `Confirm & Pay $${price.toFixed(2)}`);
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value || "N/A";
}

function formatCardNumber(input) {
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let parts = [];
    for (let i = 0; i < value.length; i += 4) parts.push(value.substring(i, i + 4));
    input.value = parts.join(' ');
}

function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) input.value = value.substring(0, 2) + '/' + value.substring(2, 4);
}

function updateCardPreview() {
    const nameIn = document.getElementById('card-name').value;
    const numIn = document.getElementById('card-number').value;
    const expIn = document.getElementById('card-expiry').value;
    const cvvIn = document.getElementById('card-cvv').value;

    setText('view-name', nameIn.toUpperCase() || "YOUR NAME");
    setText('view-number', numIn || "**** **** **** ****");
    setText('view-expiry', expIn || "MM/YY");
    const cvvView = document.getElementById('view-cvv');
    if (cvvView) cvvView.innerText = cvvIn ? "*".repeat(cvvIn.length) : "***";
}

function flipCard(flipped) {
    const card = document.getElementById('card-preview');
    if (card) flipped ? card.classList.add('flipped') : card.classList.remove('flipped');
}

document.addEventListener("DOMContentLoaded", initPage);
document.getElementById('payment-form')?.addEventListener('submit', handlePayment);

document.getElementById('card-number')?.addEventListener('input', function() {
    formatCardNumber(this);
    updateCardPreview();
});

document.getElementById('card-expiry')?.addEventListener('input', function() {
    formatExpiry(this);
    updateCardPreview();
});

document.getElementById('card-name')?.addEventListener('input', updateCardPreview);
document.getElementById('card-cvv')?.addEventListener('input', updateCardPreview);
document.getElementById('card-cvv')?.addEventListener('focus', () => flipCard(true));
document.getElementById('card-cvv')?.addEventListener('blur', () => flipCard(false));