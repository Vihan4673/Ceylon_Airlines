
const AUTH_BASE_URL = "http://localhost:8080/api/v1/auth";

const notification = document.getElementById("notification");

function showNotification(message, isError = false) {
    if (!notification) {
        alert(message);
        return;
    }

    notification.innerText = message;
    notification.style.display = "block";
    notification.style.backgroundColor = isError ? "#ef4444" : "#10b981";

    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}

function loginWithGoogle() {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
}

window.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        console.log("Google Token Received!");

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ role: "USER", type: "GOOGLE" }));

        showNotification("Google Login Successful!");

        window.history.replaceState({}, document.title, window.location.pathname);

        setTimeout(() => {
            window.location.href = "../Pages/HomePage.html";
        }, 1000);
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

    const authDTO = { email: identifier, password: password };

    try {
        const response = await fetch(`${AUTH_BASE_URL}/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(authDTO)
        });

        const result = await response.json();

        if (response.ok) {
            showNotification("Login Successful!");

            const token = result.data?.token || result.token;
            const userData = result.data || result;

            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(userData));

                setTimeout(() => {
                    if (userData.role?.toUpperCase() === "ADMIN") {
                        window.location.href = "../../AdminDashboard/index.html";
                    } else {
                        window.location.href = "HomePage.html";
                    }
                }, 1000);
            }
        } else {
            showNotification(result.message || "Login Failed", true);
        }

    } catch (error) {
        console.error("Auth Error:", error);
        showNotification("Server Connection Error", true);
    }
});

function switchTab(type) {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const title = document.getElementById("formTitle");

    if (type === "login") {
        loginForm?.classList.remove("hidden");
        signupForm?.classList.add("hidden");
        if(title) title.innerText = "LOGIN";
    } else {
        signupForm?.classList.remove("hidden");
        loginForm?.classList.add("hidden");
        if(title) title.innerText = "SIGN UP";
    }
}