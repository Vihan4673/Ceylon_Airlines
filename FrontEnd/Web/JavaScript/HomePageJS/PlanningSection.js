const BASE_URL = "http://localhost:8080";
const API_BASE = `${BASE_URL}/api/v1/ads`;

document.addEventListener("DOMContentLoaded", () => {
    loadHomeAds();
});

async function loadHomeAds() {
    const container = document.getElementById("planningContainer");
    container.innerHTML = "Loading ads...";

    try {
        // 🔹 fetch request
        const res = await fetch(API_BASE, { cache: "no-store" });
        if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);

        const ads = await res.json();
        console.log("ALL ADS:", ads);

        container.innerHTML = "";

        const now = new Date();

        // 🔹 filter only home ads
        const homeAds = ads.filter(ad => {
            const start = ad.startDate ? new Date(ad.startDate) : null;
            const end = ad.endDate ? new Date(ad.endDate) : null;

            return ad.placement &&
                ad.placement.toLowerCase().includes("home") &&
                (!start || start <= now) &&
                (!end || end >= now);
        });

        console.log("Filtered HOME ADS:", homeAds);

        if (!homeAds.length) {
            container.innerHTML = `<p class="text-gray-500 text-center col-span-full">No HOME ads found</p>`;
            return;
        }

        homeAds.forEach(ad => {
            const card = document.createElement("div");

            let imageUrl = "https://via.placeholder.com/400x200";

            if (ad.imageUrl && ad.imageUrl.trim() !== "") {
                // 🔹 if imageUrl is relative, add BASE_URL
                imageUrl = ad.imageUrl.startsWith("http")
                    ? ad.imageUrl
                    : `${BASE_URL}${ad.imageUrl}`;
            }

            console.log("Final Image URL:", imageUrl);

            card.className = "bg-white rounded-xl overflow-hidden shadow-lg group cursor-pointer transition-transform hover:scale-105";

            card.innerHTML = `
                <div class="relative overflow-hidden h-48">
                    <img src="${imageUrl}" 
                         class="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
                         alt="${ad.title}"
                         onerror="this.src='https://via.placeholder.com/400x200'">
                    <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"></div>
                    <div class="absolute bottom-4 left-4 text-white font-bold text-lg">${ad.title}</div>
                </div>
                <div class="p-4">
                    <p class="text-sm text-gray-600">${ad.description}</p>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error("Error loading ads:", err);
        container.innerHTML = `<p class="text-red-500 text-center col-span-full">Failed to load ads. Make sure server is running on port 8080.</p>`;
    }
}