import React from 'react';
import { Bot, X, Loader2, Send } from 'lucide-react';

const AIChat = ({ isChatOpen, setIsChatOpen, messages, isLoading, chatInput, setChatInput, handleSendMessage, chatEndRef }) => {
    if (!isChatOpen) return (
        <button onClick={() => setIsChatOpen(true)} className="fixed bottom-8 right-8 z-[100] group">
            <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border border-white/20 transition-transform group-hover:scale-110">
                <Bot size={28} />
            </div>
        </button>
    );

    return (
        <div className="fixed bottom-0 right-0 md:bottom-8 md:right-8 w-full md:w-[420px] h-full md:h-[600px] z-[200] flex flex-col bg-[#0f172a]/95 backdrop-blur-3xl md:rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-slide-up">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-blue-600/10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h4 className="text-white font-black text-sm">CEYLON CONCIERGE</h4>
                        <div className="flex items-center gap-2 text-[10px] text-blue-400 font-bold uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Intelligent Agent
                        </div>
                    </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400">
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed ${
                            msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none shadow-lg' : 'bg-white/5 border border-white/10 text-slate-300 rounded-bl-none'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-center gap-3 text-blue-400 text-xs font-bold animate-pulse">
                        <Loader2 size={16} className="animate-spin" /> ANALYZING SKY ROUTES...
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-6 pt-0">
                <div className="relative group">
                    <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask anything about your journey..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600" />
                    <button className="absolute right-2 top-2 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-500 transition-colors">
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AIChat;