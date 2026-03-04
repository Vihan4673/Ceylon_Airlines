// checkout.js

document.addEventListener("DOMContentLoaded", () => {
    // Load flight info from sessionStorage
    const flight = JSON.parse(sessionStorage.getItem("selectedFlight"));
    const passenger = JSON.parse(sessionStorage.getItem("passengerInfo"));

    if (!flight || !passenger) {
        // If data missing, redirect to search page
        alert("Flight or passenger information not found. Redirecting to flight search.");
        window.location.href = "/Pages/FlightSearch.html"; // Adjust path if needed
        return;
    }

    // Update Hero Section
    const heroBanner = document.querySelector(".hero-banner div");
    heroBanner.textContent = `${flight.from} to ${flight.to}`;

    // Update Flight Section
    const flightTitle = document.querySelector(".card h3");
    flightTitle.innerHTML = `${flight.from} to ${flight.to} <span class="font-normal text-gray-500">- ${flight.date}</span>`;

    // Flight times (assuming flight has departure, arrival, stop)
    const flightTimes = document.querySelectorAll(".grid-cols-1 .text-center");
    if (flightTimes.length >= 2) {
        flightTimes[0].querySelector("div").textContent = flight.departureTime;
        flightTimes[0].querySelector("div:nth-child(2)").textContent = flight.fromCode;

        flightTimes[1].querySelector("div").textContent = flight.arrivalTime;
        flightTimes[1].querySelector("div:nth-child(2)").textContent = flight.toCode;
    }

    // Update Fare Class
    const fareClass = document.querySelector(".flex.justify-end.items-center div");
    if(fareClass) fareClass.innerHTML = `<i class="fa-solid fa-ribbon mr-2 text-red-600"></i> ${flight.class}`;

    // Update Total Price
    const totalPriceSpans = document.querySelectorAll(".text-2xl.font-bold, .text-lg.font-bold");
    totalPriceSpans.forEach(span => span.textContent = flight.price);

    // Update Passenger Info
    const passengerCard = document.querySelectorAll(".card.p-4.flex")[0];
    if(passengerCard){
        passengerCard.querySelector("span.font-bold").textContent = passenger.name;
        const details = passengerCard.querySelectorAll(".text-xs.text-gray-500");
        details[0].textContent = passenger.email;
        details[1].textContent = passenger.phone;
        details[2].textContent = passenger.type;
    }

    // Checkout button click
    const checkoutBtn = document.querySelector(".btn-primary");
    checkoutBtn.addEventListener("click", async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ flight, passenger })
            });

            if(response.ok){
                alert("Booking successful!");
                // Clear temporary sessionStorage
                sessionStorage.removeItem("selectedFlight");
                sessionStorage.removeItem("passengerInfo");
                window.location.href = "/Pages/BookingSuccess.html"; // redirect to success page
            } else {
                alert("Booking failed. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        }
    });
});