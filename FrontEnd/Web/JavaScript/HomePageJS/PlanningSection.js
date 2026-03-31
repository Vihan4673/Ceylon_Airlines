const BASE_URL = "http://localhost:8080";
const API_BASE = `${BASE_URL}/api/v1/ads`;

// වැඩ නොකරන via.placeholder වෙනුවට මේක පාවිච්චි කරන්න
const FALLBACK_IMAGE = "https://placehold.co/400x600?text=Ceylon+Airlines+Offer";

document.addEventListener("DOMContentLoaded", () => {
    loadHomeAds();
});

async function loadHomeAds() {
    const container = document.getElementById("planningContainer");

    // Container එක නැත්නම් code එක crash වීම වළක්වමු
    if (!container) return;

    try {
        const res = await fetch(API_BASE, { cache: "no-store" });
        if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);

        const ads = await res.json();
        const now = new Date();

        // Home පේජ් එකට අදාළ සහ වලංගු කාලසීමාව ඇතුළත තියෙන ads පමණක් තෝරා ගැනීම
        const homeAds = ads.filter(ad => {
            const start = ad.startDate ? new Date(ad.startDate) : null;
            const end = ad.endDate ? new Date(ad.endDate) : null;

            return ad.placement &&
                ad.placement.toLowerCase().includes("home") &&
                (!start || start <= now) &&
                (!end || end >= now);
        });

        if (!homeAds.length) {
            container.innerHTML = `<p class="text-gray-500 text-center col-span-full py-10">No featured offers available at the moment.</p>`;
            return;
        }

        container.innerHTML = "";

        homeAds.forEach(ad => {
            const card = document.createElement("div");

            // Default image එකක් මුලින්ම සෙට් කරමු
            let imageUrl = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800";

            if (ad.imageUrl && ad.imageUrl.trim() !== "") {
                imageUrl = ad.imageUrl.startsWith("http") ? ad.imageUrl : `${BASE_URL}${ad.imageUrl}`;
            }

            card.className = "group cursor-pointer h-full";

            // onerror එකේදී 'this.onerror=null' යෙදීමෙන් infinite loop එක නවතිනවා
            card.innerHTML = `
                <div class="relative h-80 overflow-hidden rounded-[2rem] shadow-xl transition-all duration-500 group-hover:-translate-y-2">
                    <img src="${imageUrl}" 
                         alt="${ad.title}" 
                         class="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                         onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';">
                    
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                    
                    <div class="absolute inset-0 p-6 flex flex-col justify-start items-start text-white">
                        
                        <div class="bg-[#8b1d41] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg mb-4 shadow-sm">
                            Featured Offer
                        </div>

                        <h3 class="text-3xl font-bold mb-1 tracking-tight leading-tight">${ad.title}</h3>
                        
                        <p class="text-sm text-gray-100 font-medium mb-auto opacity-90 line-clamp-3">${ad.description}</p>
                        
                        <div class="mt-4 bg-white text-[#8b1d41] px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 group-hover:bg-[#8b1d41] group-hover:text-white shadow-lg">
                            Discover More
                        </div>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error("Error loading ads:", err);
        container.innerHTML = `<p class="text-red-500 text-center col-span-full font-medium py-10">Unable to load promotions. Please try again later.</p>`;
    }
}