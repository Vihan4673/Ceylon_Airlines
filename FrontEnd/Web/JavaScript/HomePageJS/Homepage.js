document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Elements Selection (Safe Selection) ---
    const elements = {
        userPhoto: document.getElementById('userPhoto'),
        userDropdown: document.getElementById('userDropdown'),
        loginBtn: document.getElementById('loginBtn'),
        userInfo: document.getElementById('userInfo'),
        userEmail: document.getElementById('userEmail'),
        logoutBtn: document.getElementById('logoutBtn')
    };

    // --- 2. Authentication Check & UI Update ---
    const checkLoginState = () => {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (userStr && token) {
            try {
                const user = JSON.parse(userStr);

                // Login වෙලා නම් UI එක පෙන්වන්න
                if (elements.userInfo) {
                    elements.userInfo.classList.remove("hidden");
                    elements.userInfo.classList.add("flex");
                }

                if (elements.loginBtn) elements.loginBtn.classList.add("hidden");

                if (elements.userPhoto) {
                    elements.userPhoto.src = user.picture || user.photoUrl || "https://placehold.co/32";
                }

                if (elements.userEmail) {
                    elements.userEmail.innerText = user.name || user.email || "User Account";
                }
            } catch (e) {
                console.error("Error parsing user data:", e);
            }
        } else {
            // Login වෙලා නැත්නම් හෝ Logout වුණාම
            if (elements.userInfo) {
                elements.userInfo.classList.add("hidden");
                elements.userInfo.classList.remove("flex");
            }
            if (elements.loginBtn) elements.loginBtn.classList.remove("hidden");
        }
    };

    // Initial check
    checkLoginState();

    // --- 3. Dropdown Toggle Logic ---
    elements.userPhoto?.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.userDropdown?.classList.toggle('hidden');
    });

    // එළියේ click කළොත් dropdown එක වහන්න
    window.addEventListener('click', () => {
        elements.userDropdown?.classList.add('hidden');
    });

    // --- 4. Logout Logic ---
    elements.logoutBtn?.addEventListener('click', (e) => {
        e.preventDefault();

        // Data clear කිරීම
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.clear();

        // Notification පෙන්වීම
        showNotification("Logged out successfully! Redirecting...");

        // UI එක වහාම update කිරීම
        checkLoginState();

        setTimeout(() => {
            window.location.href = 'LoginPage.html';
        }, 1000);
    });
});

// --- 5. Global Functions (Notification & Booking) ---

/**
 * Notification පෙන්වන function එක (ReferenceError එක නැති කිරීමට)
 */
function showNotification(message, isError = false) {
    console.log(`Notification: ${message}`);
    // ඔයාට Toast එකක් හෝ සරල Alert එකක් මෙතනින් පාවිච්චි කළ හැකියි
    const statusColor = isError ? "background: red" : "background: green";

    // සරල alert එකක් ලෙස පෙන්වමු (පසුව ලස්සන Toast එකක් දාන්න පුළුවන්)
    alert(message);
}

/**
 * Flight Booking API Call
 */
async function makeBooking(flightData) {
    const token = localStorage.getItem("token");

    if (!token) {
        showNotification("Please login first!", true);
        setTimeout(() => { window.location.href = "LoginPage.html"; }, 1500);
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/v1/bookings", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(flightData)
        });

        if (response.ok) {
            showNotification("Flight booked successfully!");
        } else {
            const errorData = await response.json();
            showNotification(`Booking failed: ${errorData.message || "Unauthorized"}`, true);
        }
    } catch (err) {
        console.error("Booking Error:", err);
        showNotification("Server connection failed!", true);
    }
}