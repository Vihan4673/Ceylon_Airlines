import React from 'react';
import { Bot, X, Send, Loader2 } from 'lucide-react';

const AIChat = ({ isOpen, setIsOpen, messages, chatInput, setChatInput, handleSendMessage, isLoading, chatEndRef }) => {
    if (!isOpen) return null;

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Bot size={20} />
                    <div>
                        <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Ceylon AI Agent</span>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <X size={20} />
                </button>
            </div>
            <div className="chat-body">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.role === 'user' ? 'msg-user' : 'msg-assistant'}`}>
                        {msg.text}
                    </div>
                ))}
                {isLoading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                        <Loader2 size={14} className="animate-spin" /> Ceylon AI thinking...
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="chat-input-area">
                <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about your trip..."
                />
                <button type="submit" disabled={isLoading}>
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
};

export default AIChat;