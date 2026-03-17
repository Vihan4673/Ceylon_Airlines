// PlanningSection.js - Fixed for HOME page ads

const API_BASE = "http://localhost:8080/api/v1/ads";

document.addEventListener("DOMContentLoaded", () => {
    loadHomeAds();
});

async function loadHomeAds() {
    const container = document.getElementById("planningContainer");
    container.innerHTML = "Loading ads...";

    try {
        const res = await fetch(API_BASE);
        const ads = await res.json();
        console.log("ALL ADS:", ads);

        container.innerHTML = "";

        const now = new Date();
        // ✅ Match any placement that contains "home"
        const homeAds = ads.filter(ad =>
            ad.placement?.toLowerCase().includes("home") &&
            new Date(ad.startDate) <= now &&
            new Date(ad.endDate) >= now
        );

        console.log("Filtered HOME ADS:", homeAds);

        if (!homeAds.length) {
            container.innerHTML = `<p class="text-gray-500 text-center col-span-full">No HOME ads found</p>`;
            return;
        }

        homeAds.forEach(ad => {
            const card = document.createElement("div");

            // Use placeholder if image is missing
            const imageUrl = ad.imageUrl
                ? ad.imageUrl.startsWith("http")
                    ? ad.imageUrl
                    : `http://localhost:8080${ad.imageUrl}`
                : "https://via.placeholder.com/400x200";

            card.className = "bg-white rounded-xl overflow-hidden shadow-lg group cursor-pointer transition-transform hover:scale-105";
            card.innerHTML = `
                <div class="relative overflow-hidden h-48">
                    <img src="${imageUrl}" class="w-full h-full object-cover transition duration-500 group-hover:scale-110">
                    <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"></div>
                    <div class="absolute bottom-4 left-4 text-white font-bold text-lg">${ad.title}</div>
                </div>
                <div class="p-4">
                    <p class="text-sm text-gray-600">${ad.description}</p>
                </div>
            `;

            // Optional: click action
            card.onclick = () => {
                console.log("Clicked Ad ID:", ad.id);
                // Example: navigate to ad details page
                // window.location.href = `/ad-details.html?id=${ad.id}`;
            };

            container.appendChild(card);
        });

    } catch (err) {
        console.error("Error loading ads:", err);
        container.innerHTML = `<p class="text-red-500 text-center col-span-full">Failed to load ads</p>`;
    }
}