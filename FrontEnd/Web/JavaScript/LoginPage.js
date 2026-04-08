const AUTH_BASE_URL = "http://localhost:8080/api/v1/auth";
const notification = document.getElementById("notification");

function showNotification(message, isError = false) {
    if (!notification) { alert(message); return; }
    notification.innerText = message;
    notification.style.display = "block";
    notification.style.backgroundColor = isError ? "#ef4444" : "#10b981";
    notification.style.color = "white";
    setTimeout(() => { notification.style.display = "none"; }, 3000);
}

function loginWithGoogle() {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
}

window.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const picture = urlParams.get('picture');
    const role = urlParams.get('role');

    if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({
            role: role || "USER",
            picture: picture || "https://placehold.co/32",
            type: "GOOGLE"
        }));

        showNotification("Google Login Successful!");
        window.history.replaceState({}, document.title, window.location.pathname);

        setTimeout(() => { window.location.href = "HomePage.html"; }, 1000);
    }
});

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const identifier = document.getElementById("identifier").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!identifier || !password) {
        showNotification("Please fill all fields", true);
        return;
    }

    try {
        const response = await fetch(`${AUTH_BASE_URL}/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: identifier, password: password })
        });

        const result = await response.json();

        if (response.ok) {
            showNotification("Login Successful!");
            const userData = result.data || result;
            const token = userData.token;

            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(userData));

                setTimeout(() => {
                    const role = userData.role ? userData.role.toUpperCase() : "USER";
                    window.location.href = (role === "ADMIN") ? "../../AdminDashboard/index.html" : "HomePage.html";
                }, 1000);
            }
        } else {
            showNotification(result.message || "Invalid Credentials", true);
        }
    } catch (error) {
        showNotification("Server Connection Error", true);
    }
});