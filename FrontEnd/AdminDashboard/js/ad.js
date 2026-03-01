// ad.js

const API_BASE = "http://localhost:8080/api/v1/ads";

// DOM Elements
const adModal = document.getElementById("ad-modal");
const adIdInput = document.getElementById("ad-id");
const adTitleInput = document.getElementById("ad-title");
const adDescInput = document.getElementById("ad-desc");
const adPlacementInput = document.getElementById("ad-placement");
const adStartInput = document.getElementById("ad-start");
const adEndInput = document.getElementById("ad-end");
const adImageFileInput = document.getElementById("ad-image-file");
const adImagePreviewContainer = document.getElementById("ad-image-preview-container");
const adImagePreview = document.getElementById("ad-image-preview");
const adsTableBody = document.getElementById("ads-table-body");
const previewTitle = document.getElementById("preview-title");
const previewDesc = document.getElementById("preview-desc");
const previewBg = document.getElementById("preview-bg");
const toast = document.getElementById("toast");
const toastTitle = document.getElementById("toast-title");
const toastMsg = document.getElementById("toast-msg");
const toastIcon = document.getElementById("toast-icon");

// Open & Close Modal
function openModal() {
    adModal.classList.remove("hidden");
    resetModal();
}

function closeModal() {
    adModal.classList.add("hidden");
    resetModal();
}

// Reset modal fields
function resetModal() {
    adIdInput.value = "";
    adTitleInput.value = "";
    adDescInput.value = "";
    adPlacementInput.selectedIndex = 0;
    adStartInput.value = "";
    adEndInput.value = "";
    adImageFileInput.value = "";
    adImagePreviewContainer.classList.add("hidden");
    adImagePreview.src = "";
    syncPreview();
}

// Sync preview card
function syncPreview() {
    previewTitle.textContent = adTitleInput.value || "Unforgettable Journeys";
    previewDesc.textContent = adDescInput.value || "Experience luxury across the skies with CeylonAir's premier business class services.";
}

// Handle image upload
function handleAdImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        adImagePreview.src = reader.result;
        adImagePreviewContainer.classList.remove("hidden");
        previewBg.style.backgroundImage = `url('${reader.result}')`;
    };
    reader.readAsDataURL(file);
}

// Remove image
function removeAdImage() {
    adImageFileInput.value = "";
    adImagePreviewContainer.classList.add("hidden");
    adImagePreview.src = "";
    previewBg.style.backgroundImage = "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800')";
}

// Toast notification
function showToast(title, msg, success = true) {
    toastTitle.textContent = title;
    toastMsg.textContent = msg;
    toastIcon.className = success
        ? "w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center"
        : "w-10 h-10 bg-red-500 rounded-full flex items-center justify-center";

    toast.classList.remove("translate-y-32", "opacity-0");
    toast.classList.add("opacity-100");
    setTimeout(() => {
        toast.classList.add("translate-y-32", "opacity-0");
    }, 3000);
}

// Deploy campaign (Create with image upload)
async function deployCampaign() {
    if (!adTitleInput.value || !adDescInput.value || !adStartInput.value || !adEndInput.value) {
        showToast("Error", "Please fill all required fields!", false);
        return;
    }

    const formData = new FormData();
    if (adImageFileInput.files[0]) {
        formData.append("file", adImageFileInput.files[0]);
    }
    formData.append("title", adTitleInput.value);
    formData.append("description", adDescInput.value);
    formData.append("placement", adPlacementInput.value);
    formData.append("startDate", adStartInput.value);
    formData.append("endDate", adEndInput.value);

    try {
        const res = await fetch(`${API_BASE}/upload`, {
            method: "POST",
            body: formData // Important: do not set Content-Type manually
        });

        if (!res.ok) throw new Error("Failed to save ad");

        const data = await res.json();
        showToast("Success", "Campaign deployed successfully!");
        closeModal();
        fetchAds();
    } catch (err) {
        console.error(err);
        showToast("Error", "Failed to deploy campaign!", false);
    }
}

// Delete Ad
async function deleteAd(id) {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
        await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
        showToast("Deleted", "Campaign removed successfully.");
        fetchAds();
    } catch (err) {
        console.error(err);
        showToast("Error", "Failed to delete campaign.", false);
    }
}

// Fetch all ads
async function fetchAds() {
    try {
        const res = await fetch(API_BASE);
        const ads = await res.json();
        renderAdsTable(ads);
    } catch (err) {
        console.error(err);
        showToast("Error", "Failed to load campaigns!", false);
    }
}

// Render ads table
function renderAdsTable(ads) {
    adsTableBody.innerHTML = "";
    ads.forEach(ad => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="px-8 py-5 font-bold text-slate-700">${ad.title}</td>
            <td class="px-6 py-5 text-slate-600">${ad.placement}</td>
            <td class="px-6 py-5 text-center text-slate-600">${ad.startDate} → ${ad.endDate}</td>
            <td class="px-6 py-5">
                <span class="status-pill ${isActive(ad) ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}">
                    ${isActive(ad) ? 'Active' : 'Scheduled'}
                </span>
            </td>
            <td class="px-8 py-5 text-right">
                <button onclick="editAd(${ad.id})" class="text-[#8A1538] font-bold hover:underline mr-4">Edit</button>
                <button onclick="deleteAd(${ad.id})" class="text-red-500 font-bold hover:underline">Delete</button>
            </td>
        `;
        adsTableBody.appendChild(tr);
    });
}

// Check if ad is active
function isActive(ad) {
    const now = new Date();
    const start = new Date(ad.startDate);
    const end = new Date(ad.endDate);
    return now >= start && now <= end;
}

// Edit Ad
function editAd(id) {
    fetch(`${API_BASE}`)
        .then(res => res.json())
        .then(ads => {
            const ad = ads.find(a => a.id === id);
            if (!ad) return;
            openModal();
            adIdInput.value = ad.id;
            adTitleInput.value = ad.title;
            adDescInput.value = ad.description;
            adPlacementInput.value = ad.placement;
            adStartInput.value = ad.startDate;
            adEndInput.value = ad.endDate;
            if (ad.imageUrl) {
                adImagePreview.src = ad.imageUrl;
                adImagePreviewContainer.classList.remove("hidden");
                previewBg.style.backgroundImage = `url('${ad.imageUrl}')`;
            } else {
                removeAdImage();
            }
            syncPreview();
        });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    fetchAds();
});

// Bind file input change
adImageFileInput.addEventListener("change", handleAdImageUpload);