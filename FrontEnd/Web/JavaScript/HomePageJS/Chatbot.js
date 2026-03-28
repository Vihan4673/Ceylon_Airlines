const chatWindow = document.getElementById('chat-window');
const chatIcon = document.getElementById('chat-icon');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');

// 1. Chat Window එක Open/Close කිරීම
function toggleChat() {
    if (chatWindow.classList.contains('hidden')) {
        chatWindow.classList.remove('hidden');
        chatIcon.className = 'fas fa-chevron-down';
    } else {
        chatWindow.classList.add('hidden');
        chatIcon.className = 'fas fa-comment-dots';
    }
}

// 2. මැසේජ් එකක් යැවීම
async function sendMessage() {
    const message = userInput.value.trim();
    if (message === "") return;

    appendMessage('user', message);
    userInput.value = '';

    // Loading indicator එකක් පෙන්වීම
    const loadingId = 'loading-' + Date.now();
    appendMessage('ai', 'Thinking...', loadingId);

    try {
        const response = await fetch('http://localhost:8080/api/bot/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.text();
        document.getElementById(loadingId).innerHTML = data;

    } catch (error) {
        document.getElementById(loadingId).innerText = "Backend connection failed.";
        console.error("Error:", error);
    }
}

// 3. Quick buttons පාවිච්චි කිරීම
function sendQuickMessage(text) {
    userInput.value = text;
    sendMessage();
}

// 4. Message Bubble එකක් Screen එකට දැමීම
function appendMessage(role, text, id = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = role === 'user' ? 'self-end w-full flex justify-end' : 'self-start w-full flex justify-start';

    const innerDiv = document.createElement('div');
    if (id) innerDiv.id = id;

    if (role === 'user') {
        innerDiv.className = "bg-[#8b1d41] text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] text-sm shadow-md";
    } else {
        innerDiv.className = "bg-white border border-gray-200 text-gray-800 p-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm shadow-sm";
    }

    innerDiv.innerHTML = text; // Table එක පෙන්වීමට innerHTML අත්‍යවශ්‍යයි
    msgDiv.appendChild(innerDiv);
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 5. Form Submit එක පාලනය
function handleChatSubmit(event) {
    event.preventDefault();
    sendMessage();
}