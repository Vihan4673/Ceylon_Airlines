const API_BASE_URL = "http://localhost:8080/api/v1/ads";

// ================= INIT =================
window.onload = () => {
    fetchAds();
};

// ================= FETCH ALL ADS =================
async function fetchAds() {
    try {
        const res = await fetch(`${API_BASE_URL}`);
        const ads = await res.json();

        if (res.ok) {
            renderAds(ads || []);
        } else {
            showToast("Error", "Failed to load ads");
        }
    } catch (err) {
        console.error(err);
        showToast("Server Error", "Cannot connect to backend");
    }
}

// ================= RENDER ADS =================
function renderAds(ads) {
    const tbody = document.getElementById("ads-table-body");
    if (!tbody) return;

    if (!ads.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-6 text-slate-400">
                    No campaigns found
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = ads.map(ad => `
        <tr class="hover:bg-slate-50 transition">
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <img src="${ad.imageUrl}" 
                         class="w-12 h-12 rounded-lg object-cover"
                         onerror="this.src='https://via.placeholder.com/100'">
                    <div>
                        <p class="font-bold text-slate-800">${ad.title}</p>
                        <p class="text-[10px] text-slate-400">${ad.description}</p>
                    </div>
                </div>
            </td>

            <td class="px-6 py-4 text-xs">
                ${ad.placement}
            </td>

            <td class="px-6 py-4 text-xs font-bold">
                ${ad.active ? "Active" : "Inactive"}
            </td>

            <td class="px-6 py-4 text-right">
                <button onclick="deleteAd(${ad.id})"
                    class="text-red-500 hover:text-red-700 text-xs">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}

// ================= SAVE AD =================
async function publishAd() {

    const newAd = {
        title: document.getElementById("input-ad-title").value,
        description: document.getElementById("input-ad-desc").value,
        placement: document.querySelector("select").value,
        imageUrl: document.getElementById("input-ad-img").value,
        startDate: document.querySelectorAll("input[type='date']")[0]?.value,
        endDate: document.querySelectorAll("input[type='date']")[1]?.value,
        active: document.querySelector("input[type='checkbox']").checked
    };

    if (!newAd.title || !newAd.imageUrl) {
        showToast("Validation", "Title & Image required");
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newAd)
        });

        if (res.ok) {
            showToast("Success", "Ad created");
            fetchAds();
            toggleModal("ad-modal");
        } else {
            showToast("Error", "Save failed");
        }

    } catch (err) {
        console.error(err);
        showToast("Server Error", "Cannot connect to backend");
    }
}

// ================= DELETE =================
async function deleteAd(id) {

    if (!confirm("Delete this ad?")) return;

    try {
        const res = await fetch(`${API_BASE_URL}/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            showToast("Deleted", "Ad removed");
            fetchAds();
        } else {
            showToast("Error", "Delete failed");
        }

    } catch (err) {
        console.error(err);
        showToast("Server Error", "Cannot connect to backend");
    }
}

// ================= MODAL =================
function toggleModal(id) {
    document.getElementById(id).classList.toggle("hidden");
}

// ================= TOAST =================
function showToast(title, msg) {
    const toast = document.getElementById("toast");
    document.getElementById("toast-title").innerText = title;
    document.getElementById("toast-msg").innerText = msg;

    toast.classList.remove("translate-y-20", "opacity-0");

    setTimeout(() => {
        toast.classList.add("translate-y-20", "opacity-0");
    }, 3000);
}