const chatWindow = document.getElementById('chat-window');
const chatIcon = document.getElementById('chat-icon');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');

function toggleChat() {
    if (chatWindow.classList.contains('hidden')) {
        chatWindow.classList.remove('hidden');
        const icon = document.querySelector('#chat-icon i') || chatIcon;
        icon.className = 'fas fa-chevron-down';
    } else {
        chatWindow.classList.add('hidden');
        const icon = document.querySelector('#chat-icon i') || chatIcon;
        icon.className = 'fas fa-comment-dots';
    }
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage('user', message);
    userInput.value = '';

    const loadingId = 'loading-' + Date.now();
    appendMessage('ai', '<span class="animate-pulse italic text-gray-400">Thinking...</span>', loadingId);

    try {
        const response = await fetch('http://localhost:8080/api/bot/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();

        const aiReply = data.message || data.reply || "No response from AI";
        document.getElementById(loadingId).innerHTML = aiReply;

    } catch (error) {
        document.getElementById(loadingId).innerHTML =
            `<span class="text-red-500 font-bold">Backend connection failed.</span>`;
        console.error("Chat Error:", error);
    }
}

function sendQuickMessage(text) {
    userInput.value = text;
    sendMessage();
}

function appendMessage(role, text, id = null) {
    const msgWrapper = document.createElement('div');
    msgWrapper.className = role === 'user' ? 'flex justify-end mb-4' : 'flex justify-start mb-4';

    const innerDiv = document.createElement('div');
    if (id) innerDiv.id = id;

    if (role === 'user') {
        innerDiv.className = "bg-[#8b1d41] text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] text-sm shadow-md";
    } else {
        innerDiv.className = "bg-gray-100 border border-gray-200 text-gray-800 p-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm shadow-sm leading-relaxed";
    }

    innerDiv.innerHTML = text;
    msgWrapper.appendChild(innerDiv);
    chatMessages.appendChild(msgWrapper);

    chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
    });
}

function handleChatSubmit(event) {
    event.preventDefault();
    sendMessage();
}