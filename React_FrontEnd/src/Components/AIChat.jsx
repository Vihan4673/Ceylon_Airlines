import React, { useState } from 'react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';

const AIChat = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessage, setChatMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([
        { role: 'bot', text: 'Ayubowan! I am your Ceylone AI Concierge. How can I help you?' }
    ]);

    const handleSendMessage = () => {
        if (!chatMessage.trim()) return;
        setChatHistory([...chatHistory, { role: 'user', text: chatMessage }]);
        setChatMessage("");
        setTimeout(() => {
            setChatHistory(prev => [...prev, { role: 'bot', text: 'Our luxury fleet awaits your choice. Would you like to check available flights?' }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-10 right-10 z-[100]">
            {isChatOpen ? (
                <div className="w-[400px] h-[600px] bg-white rounded-[3rem] shadow-2xl flex flex-col border overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="bg-[#8A1538] p-8 text-white flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md"><Bot size={28} /></div>
                            <div><h4 className="text-sm font-black uppercase">AI Concierge</h4><span className="text-[10px] opacity-60 flex items-center gap-1 font-bold"><div className="w-2 h-2 rounded-full bg-green-400" /> ONLINE</span></div>
                        </div>
                        <button onClick={() => setIsChatOpen(false)}><X size={20} /></button>
                    </div>
                    <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-slate-50/50 scrollbar-hide">
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] px-6 py-5 rounded-[1.8rem] text-sm ${msg.role === 'user' ? 'bg-[#8A1538] text-white rounded-tr-none' : 'bg-white border text-slate-700 rounded-tl-none font-medium'}`}>{msg.text}</div>
                            </div>
                        ))}
                    </div>
                    <div className="p-8 bg-white border-t flex gap-4">
                        <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask me anything..." className="flex-1 bg-slate-50 px-4 py-3 rounded-2xl focus:outline-none" />
                        <button onClick={handleSendMessage} className="bg-[#8A1538] text-white w-12 h-12 rounded-xl flex items-center justify-center"><Send size={20} /></button>
                    </div>
                </div>
            ) : (
                <button onClick={() => setIsChatOpen(true)} className="w-20 h-20 bg-[#8A1538] text-white rounded-[2rem] shadow-2xl flex items-center justify-center hover:rotate-6 transition-all"><MessageCircle size={36} /></button>
            )}
        </div>
    );
};

export default AIChat;