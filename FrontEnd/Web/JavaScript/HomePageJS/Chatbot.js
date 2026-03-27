document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // Toggle Chat Window
    // =========================
    function toggleChat() {
        const chatWindow = document.getElementById("chat-window");
        chatWindow.classList.toggle("hidden");
    }
    window.toggleChat = toggleChat; // make global for HTML onclick

    // =========================
    // Scroll chat to bottom
    // =========================
    function scrollToBottom() {
        const chatMessages = document.getElementById("chat-messages");
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // =========================
    // Add message bubble
    // =========================
    function addMessage(message, sender) {
        const chatMessages = document.getElementById("chat-messages");
        const bubble = document.createElement("div");
        bubble.classList.add("chat-bubble");
        if(sender === "bot") {
            bubble.classList.add("bot-bubble");
        } else {
            bubble.classList.add("user-bubble");
        }
        bubble.textContent = message;
        chatMessages.appendChild(bubble);
        scrollToBottom();
    }

    // =========================
    // Typing indicator
    // =========================
    function showTyping(show) {
        const typingIndicator = document.getElementById("typing-indicator");
        typingIndicator.style.display = show ? "block" : "none";
        scrollToBottom();
    }

    // =========================
    // Handle sending chat
    // =========================
    async function handleChatSubmit(event) {
        if(event) event.preventDefault();

        const input = document.getElementById("user-input");
        const message = input.value.trim();
        if(!message) return;

        addMessage(message, "user"); // add user message
        input.value = "";
        showTyping(true);

        try {
            const response = await fetch("http://localhost:8080/api/chat", {
                method: "POST",
                credentials: "include", // required if backend allowCredentials=true
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            showTyping(false);

            if(data.reply) {
                addMessage(data.reply, "bot");
            } else if(data.message) {
                addMessage("Server Error: " + data.message, "bot");
            }

        } catch(err) {
            showTyping(false);
            addMessage("Network Error: Could not reach server.", "bot");
            console.error(err);
        }
    }
    window.handleChatSubmit = handleChatSubmit; // global for form onsubmit

    // =========================
    // Quick buttons
    // =========================
    function sendQuickMessage(message) {
        const input = document.getElementById("user-input");
        input.value = message;
        handleChatSubmit();
    }
    window.sendQuickMessage = sendQuickMessage; // global for onclick

    // =========================
    // Optional: open chat on page load
    // =========================
    const chatWindow = document.getElementById("chat-window");
    chatWindow.classList.remove("hidden"); // remove if you want it hidden first

});