const API_BASE = "http://localhost:8080/api/v1/ads";

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

function openModal() {
    adModal.classList.remove("hidden");
}

function closeModal() {
    adModal.classList.add("hidden");
    resetModal();
}

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
    fetchAds();
}

function syncPreview() {
    previewTitle.textContent = adTitleInput.value || "Campaign Preview";
    previewDesc.textContent = adDescInput.value || "Enter details to see how your ad looks.";
}

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

function removeAdImage() {
    adImageFileInput.value = "";
    adImagePreviewContainer.classList.add("hidden");
    adImagePreview.src = "";
    previewBg.style.backgroundImage = "none";
}

async function fetchAds() {
    try {
        const res = await fetch(API_BASE);
        const ads = await res.json();
        renderAdsTable(ads);

        if (ads && ads.length > 0) {
            updateDesktopPreview(ads[ads.length - 1]);
        }
    } catch (err) {
        console.error(err);
    }
}

function updateDesktopPreview(ad) {
    previewTitle.textContent = ad.title;
    previewDesc.textContent = ad.description;
    if (ad.imageUrl) {
        previewBg.style.backgroundImage = `url('${ad.imageUrl}')`;
    }
}

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

    const isUpdate = adIdInput.value !== "";
    const url = isUpdate ? `${API_BASE}/${adIdInput.value}` : `${API_BASE}/upload`;
    const method = isUpdate ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method: method,
            body: formData
        });

        if (!res.ok) throw new Error("Failed to process campaign");

        showToast("Success", isUpdate ? "Campaign updated!" : "Campaign deployed!");
        closeModal();
        fetchAds();
    } catch (err) {
        console.error(err);
        showToast("Error", "Action failed!", false);
    }
}

async function deleteAd(id) {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
        await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
        showToast("Deleted", "Campaign removed.");
        fetchAds();
    } catch (err) {
        showToast("Error", "Failed to delete.", false);
    }
}

function renderAdsTable(ads) {
    adsTableBody.innerHTML = "";
    ads.forEach(ad => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-slate-50 transition-colors border-b border-slate-100";
        tr.innerHTML = `
            <td class="px-8 py-5 font-bold text-slate-700">${ad.title}</td>
            <td class="px-6 py-5 text-slate-600">${ad.placement}</td>
            <td class="px-6 py-5 text-center text-slate-600">${ad.startDate} → ${ad.endDate}</td>
            <td class="px-6 py-5 text-center">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isActive(ad) ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}">
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

function isActive(ad) {
    const now = new Date();
    return now >= new Date(ad.startDate) && now <= new Date(ad.endDate);
}

async function editAd(id) {
    try {
        const res = await fetch(API_BASE);
        const ads = await res.json();
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
    } catch (err) {
        console.error("Edit failed", err);
    }
}

function showToast(title, msg, success = true) {
    toastTitle.textContent = title;
    toastMsg.textContent = msg;
    toastIcon.className = success ? "w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white" : "w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white";
    toastIcon.innerHTML = success ? '<i class="fas fa-check"></i>' : '<i class="fas fa-times"></i>';
    toast.classList.remove("translate-y-32", "opacity-0");
    setTimeout(() => toast.classList.add("translate-y-32", "opacity-0"), 3000);
}

document.addEventListener("DOMContentLoaded", fetchAds);
adImageFileInput.addEventListener("change", handleAdImageUpload);
adTitleInput.addEventListener("input", syncPreview);
adDescInput.addEventListener("input", syncPreview);