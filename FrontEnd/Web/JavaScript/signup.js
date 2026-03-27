// =====================================================
// API CONFIG
// =====================================================
const API_URL = "http://localhost:8080/api/v1/auth/signup";

// =====================================================
// INIT
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signupForm");
    if (!form) return;
    form.addEventListener("submit", handleSignup);
});

// =====================================================
// HANDLE SIGNUP
// =====================================================
async function handleSignup(e) {
    e.preventDefault();

    // ✅ Correct IDs matching your HTML
    const name = document.getElementById("signupUsername")?.value.trim();
    const email = document.getElementById("signupEmail")?.value.trim();
    const password = document.getElementById("signupPassword")?.value.trim();

    if (!name || !email || !password) {
        showMessage("Please fill all fields", "error");
        return;
    }

    const signupData = {
        username: name,
        email: email,
        password: password,
        role: "USER" // optional: force role from frontend
    };

    try {
        showMessage("Signing up...", "info");

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signupData)
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok) {
            showMessage("Registration successful!", "success");

            // auto redirect to login page
            setTimeout(() => {
                window.location.href = "LoginPage.html"; // adjust path if needed
            }, 1000);

        } else {
            // handle duplicate email or backend error
            showMessage(data.message || "Signup failed", "error");
        }

    } catch (error) {
        console.error("Signup Error:", error);
        showMessage("Server error!", "error");
    }
}

// =====================================================
// SHOW MESSAGE FUNCTION
// =====================================================
function showMessage(message, type) {
    let msgBox = document.getElementById("msgBox");

    if (!msgBox) {
        msgBox = document.createElement("div");
        msgBox.id = "msgBox";
        msgBox.style.position = "fixed";
        msgBox.style.top = "20px";
        msgBox.style.right = "20px";
        msgBox.style.padding = "12px 20px";
        msgBox.style.borderRadius = "10px";
        msgBox.style.color = "#fff";
        msgBox.style.fontWeight = "bold";
        msgBox.style.zIndex = "9999";
        msgBox.style.minWidth = "200px";
        msgBox.style.textAlign = "center";
        msgBox.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
        document.body.appendChild(msgBox);
    }

    msgBox.innerText = message;
    msgBox.style.backgroundColor =
        type === "success" ? "#16a34a" :
            type === "error" ? "#dc2626" : "#2563eb";

    setTimeout(() => msgBox.remove(), 3000);
}

// Google Sign-in callback
function handleCredentialResponse(response) {
    // The response contains JWT ID token
    console.log("Encoded JWT ID token: " + response.credential);

    // Optionally send this token to your backend to verify and create a session
    fetch('http://localhost:8080/api/v1/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential })
    })
        .then(res => res.json())
        .then(data => {
            if(data.success){
                showNotification("Logged in with Google!", "success");
                // redirect or update UI
                setTimeout(() => window.location.href = "Dashboard.html", 1000);
            } else {
                showNotification("Google login failed", "error");
            }
        })
        .catch(err => {
            console.error(err);
            showNotification("Server error", "error");
        });
}

// Optional: show notification function (reuse your msgBox logic)
function showNotification(msg, type) {
    const notification = document.getElementById('notification');
    notification.innerText = msg;
    notification.style.backgroundColor =
        type === "success" ? "#16a34a" : "#dc2626";
    notification.style.display = "block";
    setTimeout(() => notification.style.display = "none", 3000);
}