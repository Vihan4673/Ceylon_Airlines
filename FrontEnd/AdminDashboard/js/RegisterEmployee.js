function toggleAddModal(show) {
    const modal = document.getElementById('addModal');
    if (show) {
        modal.classList.remove('hidden');
        setTimeout(() => modal.firstElementChild.classList.remove('scale-95'), 10);
    } else {
        modal.firstElementChild.classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 200);
    }
}
function toggleForgotModal(show) {
    const modal = document.getElementById('forgotModal');
    if (show) {
        modal.classList.remove('hidden');
        setTimeout(() => modal.firstElementChild.classList.remove('scale-95'), 10);
    } else {
        modal.firstElementChild.classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 200);
    }
}
function togglePass(id, event) {
    const input = document.getElementById(id);
    const btn = event.currentTarget;
    const icon = btn.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

async function registerAdmin() {
    const nameInput = document.getElementById('newName');
    const emailInput = document.getElementById('newEmail');
    const passInput = document.getElementById('newPassword');
    const roleSelect = document.getElementById('newRole'); // UI Designation

    if (!nameInput.value || !emailInput.value || !passInput.value) {
        return showToast('Error', 'Please fill all fields before submitting.', 'bg-red-500');
    }
    const adminData = {
        username: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passInput.value,
        role: "ADMIN"
    };

    console.log("Attempting to Register:", adminData);

    try {
        const response = await fetch('http://localhost:8080/api/v1/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(adminData)
        });
        const result = await response.json();

        if (response.ok) {
            addAdminToTable(nameInput.value, emailInput.value, roleSelect.value);

            toggleAddModal(false);
            showToast('Success', 'Administrator registered successfully!', 'bg-emerald-500');
            nameInput.value = '';
            emailInput.value = '';
            passInput.value = '';
        } else {
            console.error("Backend Error:", result);
            showToast('Registration Failed', result.message || 'Error 400: Check data format.', 'bg-red-500');
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        showToast('Connection Error', 'Backend server is not reachable.', 'bg-red-500');
    }
}

function addAdminToTable(name, email, displayRole) {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    const tableBody = document.getElementById('adminTableBody');

    const newRow = `
        <tr>
            <td class="py-4">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-[#8A1538] text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-sm">${initials}</div>
                    <div>
                        <p class="font-bold text-slate-800 text-xs">${name}</p>
                        <p class="text-[10px] text-slate-400">${email}</p>
                    </div>
                </div>
            </td>
            <td class="py-4"><span class="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[9px] font-black uppercase">${displayRole}</span></td>
            <td class="py-4 text-right">
                <button onclick="this.closest('tr').remove()" class="text-slate-300 hover:text-red-500 transition-colors">
                    <i class="fas fa-trash-alt text-xs"></i>
                </button>
            </td>
        </tr>
    `;
    tableBody.insertAdjacentHTML('beforeend', newRow);
}

function showToast(title, msg, iconColor = 'bg-emerald-500') {
    const toast = document.getElementById('toast');
    const titleEl = document.getElementById('toastTitle');
    const msgEl = document.getElementById('toastMsg');
    const iconEl = document.getElementById('toastIcon');

    if(!toast || !titleEl || !msgEl || !iconEl) return;

    titleEl.innerText = title;
    msgEl.innerText = msg;
    iconEl.className = `w-8 h-8 ${iconColor} rounded-full flex items-center justify-center text-[10px]`;

    toast.classList.remove('translate-y-32', 'opacity-0');

    setTimeout(() => {
        toast.classList.add('translate-y-32', 'opacity-0');
    }, 3000);
}
function handleResetRequest() {
    const email = document.getElementById('resetEmail').value;
    if(email) {
        showToast('Request Sent', 'Reset instructions sent to corporate email.', 'bg-blue-500');
        toggleForgotModal(false);
    } else {
        showToast('Missing Info', 'Please enter your email address.', 'bg-amber-500');
    }
}