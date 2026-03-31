const BASE_URL = "http://localhost:8080";
const API_BASE = `${BASE_URL}/api/v1/ads`;

document.addEventListener("DOMContentLoaded", () => {
    loadHomeAds();
});

async function loadHomeAds() {
    const container = document.getElementById("planningContainer");


    try {
        const res = await fetch(API_BASE, { cache: "no-store" });
        if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);

        const ads = await res.json();
        const now = new Date();

        const homeAds = ads.filter(ad => {
            const start = ad.startDate ? new Date(ad.startDate) : null;
            const end = ad.endDate ? new Date(ad.endDate) : null;

            return ad.placement &&
                ad.placement.toLowerCase().includes("home") &&
                (!start || start <= now) &&
                (!end || end >= now);
        });

        if (!homeAds.length) {
            container.innerHTML = `<p class="text-gray-500 text-center col-span-full">No featured offers available at the moment.</p>`;
            return;
        }

        container.innerHTML = "";

        homeAds.forEach(ad => {
            const card = document.createElement("div");
            let imageUrl = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800"; // Default image
            if (ad.imageUrl && ad.imageUrl.trim() !== "") {
                imageUrl = ad.imageUrl.startsWith("http") ? ad.imageUrl : `${BASE_URL}${ad.imageUrl}`;
            }
            card.className = "group cursor-pointer h-full";
            card.innerHTML = `
                <div class="relative h-80 overflow-hidden rounded-[2rem] shadow-xl transition-all duration-500 group-hover:-translate-y-2">
                    <img src="${imageUrl}" 
                         alt="${ad.title}" 
                         class="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                         onerror="this.src='https://via.placeholder.com/400x600'">
                    
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    <div class="absolute inset-0 p-6 flex flex-col justify-start items-start text-white">
                        
                        <div class="bg-[#8b1d41] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg mb-4">
                            Featured Offer
                        </div>

                        <h3 class="text-3xl font-bold mb-1 tracking-tight">${ad.title}</h3>
                        
                        <p class="text-sm text-gray-200 font-medium mb-auto opacity-90">${ad.description}</p>
                        
                        <div class="mt-4 bg-white text-slate-800 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-transform active:scale-95 group-hover:bg-gray-100">
                            Discover More
                        </div>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error("Error loading ads:", err);
        container.innerHTML = `<p class="text-red-500 text-center col-span-full font-medium">Unable to load promotions. Please try again later.</p>`;
    }
}