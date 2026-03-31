// =====================================================
// BASE URL
// =====================================================
const AUTH_BASE_URL = "http://localhost:8080/api/v1/auth";
const notification = document.getElementById("notification");

// =====================================================
// 🔔 NOTIFICATION
// =====================================================
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

// =====================================================
// 🌐 GOOGLE LOGIN (FIXED FOR MANUAL TOKEN FLOW) 🔥
// =====================================================
function loginWithGoogle() {
    // 1. Google Identity Services initialize kirima
    google.accounts.id.initialize({
        client_id: "29624464708-i2hhl9f3bv3h77s9l9r9gb87ohmo1ccj.apps.googleusercontent.com",
        callback: handleCredentialResponse // Token eka labunama meka call wenawa
    });

    // 2. Google Login Popup eka pennana
    google.accounts.id.prompt();
}

// Google eken dena Token eka backend ekata yawana function eka
async function handleCredentialResponse(response) {
    const idToken = response.credential; // Meka thama Google ID Token eka

    try {
        const res = await fetch(`${AUTH_BASE_URL}/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: idToken })
        });

        const result = await res.json();

        // Status 200 unoth pamanak login wenna
        if (res.ok && (result.status === 200 || result.code === 200)) {
            const jwtToken = result.data.token;
            localStorage.setItem("token", jwtToken);
            localStorage.setItem("user", JSON.stringify({ role: "USER", type: "GOOGLE" }));

            showNotification("Google Login Successful!");
            setTimeout(() => {
                window.location.href = "HomePage.html"; // Path eka hariyata check karanna
            }, 1000);
        } else {
            showNotification(result.message || "Google Authentication Failed", true);
        }
    } catch (error) {
        console.error("Google Auth Error:", error);
        showNotification("Server Connection Error", true);
    }
}

// =====================================================
// 🔑 NORMAL LOGIN
// =====================================================
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
                    const role = userData.role || (userData.data && userData.data.role);
                    if (role?.toUpperCase() === "ADMIN") {
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

// =====================================================
// 📝 TAB SWITCH
// =====================================================
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