const BASE_URL = 'http://localhost:8080/api/v1/baggage';

document.addEventListener('DOMContentLoaded', () => {
    loadReports();

    const responseForm = document.getElementById('responseForm');
    if (responseForm) {
        responseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await submitAdminResponse();
        });
    }
});

async function loadReports() {
    const list = document.getElementById('reportList');
    list.innerHTML = `<tr><td colspan="5" class="p-10 text-center text-slate-400">Loading incidents...</td></tr>`;

    try {
        const response = await fetch(`${BASE_URL}/all`);
        if (!response.ok) throw new Error("Failed to fetch reports");

        const reports = await response.json();
        renderTable(reports);
    } catch (error) {
        list.innerHTML = `<tr><td colspan="5" class="p-10 text-center text-red-500">Error connecting to server.</td></tr>`;
    }
}

function renderTable(reports) {
    const list = document.getElementById('reportList');
    list.innerHTML = "";

    reports.forEach(report => {
        const statusColor = getStatusColor(report.status);
        const row = document.createElement('tr');
        row.className = "hover:bg-slate-50 border-b border-slate-50";
        row.innerHTML = `
            <td class="px-6 py-5">
                <p class="font-bold text-slate-900 text-sm">${report.passengerName}</p>
                <p class="text-[9px] text-slate-400 font-bold uppercase">${report.passportNumber}</p>
            </td>
            <td class="px-6 py-5 text-xs font-bold text-slate-600">${report.flightNumber}</td>
            <td class="px-6 py-5 italic text-[10px] text-blue-600">Baggage Claim</td>
            <td class="px-6 py-5">
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full ${statusColor}"></span>
                    <span class="text-[10px] font-black uppercase">${report.status || 'PENDING'}</span>
                </div>
            </td>
            <td class="px-6 py-5 text-right">
                <button class="view-btn text-slate-900 hover:text-[#8b1d41] font-black text-[10px] uppercase" 
                        data-report='${JSON.stringify(report)}'>
                    View & Resolve
                </button>
            </td>
        `;
        list.appendChild(row);
    });
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const report = JSON.parse(e.target.getAttribute('data-report'));
            openResponsePanel(report);
        });
    });
}

function openResponsePanel(report) {
    document.getElementById('reportId').value = report.id;
    document.getElementById('panelId').innerText = `INCIDENT ID: #CEY-${report.id}`;
    document.getElementById('pName').innerText = report.passengerName;
    document.getElementById('pPassport').innerText = report.passportNumber;
    document.getElementById('pIssue').innerText = report.description;

    const photoDiv = document.getElementById('pPhotos');
    if (report.photoPath) {
        const imageUrl = `http://localhost:8080/uploads/${report.photoPath}`;
        photoDiv.innerHTML = `<img src="${imageUrl}" class="w-full h-40 rounded-2xl object-cover border shadow-sm">`;
    } else {
        photoDiv.innerHTML = `<p class="text-[10px] text-slate-300 italic uppercase">No visual evidence</p>`;
    }

    document.getElementById('responseOverlay').classList.remove('hidden');
    document.getElementById('responseOverlay').classList.add('active', 'block');
    document.getElementById('responsePanel').classList.add('active');
}

async function submitAdminResponse() {
    const reportId = document.getElementById('reportId').value;
    const selectedStatus = document.querySelector('input[name="status"]:checked').value;
    const comment = document.getElementById('adminComment').value;

    try {
        const response = await fetch(`${BASE_URL}/update/${reportId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: selectedStatus, adminComment: comment })
        });

        if (response.ok) {
            alert("Success!");
            closeResponsePanel();
            loadReports();
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
}

window.closeResponsePanel = function() {
    document.getElementById('responsePanel').classList.remove('active');
    document.getElementById('responseOverlay').classList.remove('active', 'block');
    document.getElementById('responseOverlay').classList.add('hidden');
};

function getStatusColor(status) {
    if (status === 'Approved') return 'bg-emerald-500';
    if (status === 'Rejected') return 'bg-red-500';
    if (status === 'Processing') return 'bg-amber-400';
    return 'bg-slate-300';
}