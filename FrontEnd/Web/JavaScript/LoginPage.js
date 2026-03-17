// const BASE_URL = "http://localhost:8080/api/v1/auth";
//
// const notification = document.getElementById("notification");
//
// // ---------------- NOTIFICATION ----------------
//
// function showNotification(message, isError = false) {
//
//     notification.textContent = message;
//     notification.style.display = "block";
//     notification.style.backgroundColor = isError ? "#ef4444" : "#10b981";
//
//     setTimeout(() => {
//         notification.style.display = "none";
//     }, 3000);
//
// }
//
// // ---------------- TAB SWITCH ----------------
//
// function switchTab(type) {
//
//     const loginForm = document.getElementById("loginForm");
//     const signupForm = document.getElementById("signupForm");
//
//     const loginTab = document.getElementById("loginTab");
//     const signupTab = document.getElementById("signupTab");
//
//     if (type === "login") {
//
//         loginForm.classList.remove("hidden");
//         signupForm.classList.add("hidden");
//
//         loginTab.classList.add("active-tab");
//         signupTab.classList.remove("active-tab");
//
//     } else {
//
//         signupForm.classList.remove("hidden");
//         loginForm.classList.add("hidden");
//
//         signupTab.classList.add("active-tab");
//         loginTab.classList.remove("active-tab");
//
//     }
// }
//
// // ---------------- LOGIN ----------------
//
// document.getElementById("loginForm").addEventListener("submit", async (e) => {
//
//     e.preventDefault();
//
//     const authDTO = {
//
//         username: document.getElementById("loginId").value.trim(),
//         password: document.getElementById("loginPassword").value.trim()
//
//     };
//
//     console.log("Login Request:", authDTO);
//
//     try {
//
//         const response = await fetch(`${BASE_URL}/signin`, {
//
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(authDTO)
//
//         });
//
//         const result = await response.json();
//
//         if (response.ok) {
//
//             showNotification("Login Successful!");
//
//             console.log("Server Response:", result);
//
//             if (result.data) {
//                 localStorage.setItem("token", result.data);
//             }
//
//             setTimeout(() => {
//                 window.location.href = "dashboard.html";
//             }, 1000);
//
//         } else {
//
//             showNotification(result.message || "Login Failed", true);
//
//         }
//
//     } catch (error) {
//
//         console.error(error);
//         showNotification("Server Connection Error", true);
//
//     }
//
// });
//
// // ---------------- REGISTER ----------------
//
// document.getElementById("signupForm").addEventListener("submit", async (e) => {
//
//     e.preventDefault();
//
//     const email = document.getElementById("signupEmail").value.trim();
//
//     const registerDTO = {
//
//         firstName: document.getElementById("firstName").value.trim(),
//         lastName: document.getElementById("lastName").value.trim(),
//
//         // IMPORTANT FIX
//         username: email,   // backend login uses username
//
//         email: email,
//         password: document.getElementById("signupPassword").value.trim()
//
//     };
//
//     console.log("Register Request:", registerDTO);
//
//     try {
//
//         const response = await fetch(`${BASE_URL}/signup`, {
//
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(registerDTO)
//
//         });
//
//         const result = await response.json();
//
//         if (response.ok) {
//
//             showNotification("Registration Successful! Please Login");
//
//             document.getElementById("signupForm").reset();
//
//             switchTab("login");
//
//         } else {
//
//             showNotification(result.message || "Registration Failed", true);
//
//         }
//
//     } catch (error) {
//
//         console.error(error);
//         showNotification("Server Connection Error", true);
//
//     }
//
// });