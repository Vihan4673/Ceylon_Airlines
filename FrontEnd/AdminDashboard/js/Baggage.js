import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, onSnapshot, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// ===== Firebase Config =====
const firebaseConfig = {
    apiKey: "PASTE_YOUR_REAL_API_KEY_HERE",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const appId = 'airline-bag-manager-01';
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Firestore Collection
const bagsCol = collection(db, 'artifacts', appId, 'public', 'data', 'baggages');

let allBaggages = [];
let activeFilter = 'All';

// ===== AUTH =====
async function initAuth() {
    try {
        await signInAnonymously(auth);
    } catch (err) {
        console.error("Auth Error:", err);
    }
}
initAuth();

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('userEmail').innerText = "Administrator";
        onSnapshot(bagsCol, (snap) => {
            allBaggages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            renderBaggages();
            updateStats();
        }, (err) => console.error("Database Error:", err));
    }
});

// ===== MODAL =====
window.openModal = () => document.getElementById('modal').classList.remove('hidden');
window.closeModal = () => document.getElementById('modal').classList.add('hidden');

// ===== CRUD =====
window.updateStatus = async (id, newStatus) => {
    const bagDoc = doc(db, 'artifacts', appId, 'public', 'data', 'baggages', id);
    await updateDoc(bagDoc, { status: newStatus, updatedAt: Date.now() });
};

window.deleteItem = async (id) => {
    if (confirm("Delete this baggage record permanently?")) {
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'baggages', id));
    }
};

// ===== Render & Filters =====
window.renderBaggages = () => {
    const list = document.getElementById('baggageList');
    const search = document.getElementById('searchInput').value.toLowerCase();

    let filtered = activeFilter === 'All' ? allBaggages : allBaggages.filter(b => b.flightNo === activeFilter);

    if (search) {
        filtered = filtered.filter(b =>
            b.passenger.toLowerCase().includes(search) ||
            b.passportNo.toLowerCase().includes(search)
        );
    }

    if (filtered.length === 0) {
        list.innerHTML = `<div class="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <p class="text-gray-400">No matching records found.</p></div>`;
        return;
    }

    list.innerHTML = filtered.map(b => `
        <div class="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm card-hover relative group">
            <button onclick="window.deleteItem('${b.id}')" class="absolute top-8 right-8 text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                <i class="fas fa-trash-alt"></i>
            </button>
            <div class="flex items-start gap-4 mb-6">
                <div class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl">
                    <i class="fas fa-passport text-gray-400"></i>
                </div>
                <div>
                    <h4 class="text-xl font-black text-gray-800 tracking-tight">${b.passenger}</h4>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Passport:</span>
                        <span class="text-xs font-bold text-[#8b1d41]">${b.passportNo}</span>
                    </div>
                </div>
            </div>
            <div class="flex flex-wrap gap-3 mb-8">
                <div class="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                    <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Flight No</p>
                    <p class="text-xs font-black text-gray-700">${b.flightNo}</p>
                </div>
                <div class="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                    <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Tag ID</p>
                    <p class="text-xs font-black text-gray-700">${b.tagId || 'N/A'}</p>
                </div>
            </div>
            <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Current Status</p>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    ${['Checked', 'Scanning', 'Loaded', 'Arrived'].map(s => `
                        <div onclick="window.updateStatus('${b.id}', '${s}')"
                             class="status-pill px-3 py-3 rounded-2xl border border-gray-100 text-[10px] font-bold text-center uppercase tracking-tighter ${b.status === s ? 'active' : 'bg-gray-50/50 text-gray-400'}">
                            ${s}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');

    renderFilterButtons();
};

function renderFilterButtons() {
    const flights = [...new Set(allBaggages.map(b => b.flightNo))];
    const container = document.getElementById('dynamicFilters');
    container.innerHTML = flights.map(f => `
        <button onclick="window.setFilter('${f}')" id="f-${f}" class="filter-btn px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeFilter === f ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'}">
            ${f}
        </button>
    `).join('');
}

window.setFilter = (f) => {
    activeFilter = f;
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('bg-gray-900', 'text-white');
        b.classList.add('text-gray-400');
    });
    const btn = document.getElementById(`f-${f}`);
    if (btn) btn.classList.add('bg-gray-900', 'text-white');
    renderBaggages();
};

function updateStats() {
    document.getElementById('statTotal').innerText = allBaggages.length;
    document.getElementById('statScan').innerText = allBaggages.filter(b => b.status === 'Scanning').length;
    document.getElementById('statLoad').innerText = allBaggages.filter(b => b.status === 'Loaded').length;
    document.getElementById('statArrived').innerText = allBaggages.filter(b => b.status === 'Arrived').length;
}

// ===== Submit Baggage Form =====
const form = document.getElementById('baggageForm');
if (form) {
    form.onsubmit = async (e) => {
        e.preventDefault();
        const passport = document.getElementById('fPassport').value.trim().toUpperCase();
        const bagDoc = doc(db, 'artifacts', appId, 'public', 'data', 'baggages', passport);

        const data = {
            passportNo: passport,
            passenger: document.getElementById('fName').value.trim(),
            flightNo: document.getElementById('fFlight').value.trim().toUpperCase(),
            tagId: document.getElementById('fTag').value.trim().toUpperCase(),
            status: 'Checked',
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        await setDoc(bagDoc, data);
        closeModal();
        e.target.reset();
    };
}