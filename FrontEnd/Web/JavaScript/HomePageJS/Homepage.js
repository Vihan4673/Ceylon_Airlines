document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        userPhoto: document.getElementById('userPhoto'),
        userDropdown: document.getElementById('userDropdown'),
        loginBtn: document.getElementById('loginBtn'),
        userInfo: document.getElementById('userInfo'),
        userEmail: document.getElementById('userEmail'),
        logoutBtn: document.getElementById('logoutBtn')
    };

    const checkLoginState = () => {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (userStr && token) {
            try {
                const user = JSON.parse(userStr);
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
            if (elements.userInfo) {
                elements.userInfo.classList.add("hidden");
                elements.userInfo.classList.remove("flex");
            }
            if (elements.loginBtn) elements.loginBtn.classList.remove("hidden");
        }
    };

    checkLoginState();
    elements.userPhoto?.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.userDropdown?.classList.toggle('hidden');
    });

    window.addEventListener('click', () => {
        elements.userDropdown?.classList.add('hidden');
    });

    elements.logoutBtn?.addEventListener('click', (e) => {
        e.preventDefault();

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.clear();

        showNotification("Logged out successfully! Redirecting...");
        checkLoginState();

        setTimeout(() => {
            window.location.href = 'LoginPage.html';
        }, 1000);
    });
});


function showNotification(message, isError = false) {
    console.log(`Notification: ${message}`);
    const statusColor = isError ? "background: red" : "background: green";

    alert(message);
}

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