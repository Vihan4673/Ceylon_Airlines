import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Award, Clock, CreditCard, ArrowRight, ChevronRight, Star, Coffee, Wifi, Facebook, Instagram, Twitter, Plane } from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero from '../components/HeroSection';
import AIChat from '../components/AIChat';

const Homepage = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeTab, setActiveTab] = useState('flights');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Ayubowan! Welcome to Ceylon Premier. ✨ How can I assist with your global journey today?" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    const apiKey = ""; // ඔබේ API Key එක මෙතනට

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const askGemini = async (userQuery) => {
        setIsLoading(true);
        const systemPrompt = "You are the premium AI concierge for Ceylon Airline. Be elegant, sophisticated, and helpful. Use a touch of Sri Lankan hospitality.";
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userQuery }] }],
                    systemInstruction: { parts: [{ text: systemPrompt }] }
                })
            });
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            setMessages(prev => [...prev, { role: 'assistant', text: text || "Our systems are momentarily occupied." }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', text: "I apologize for the interruption." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim() || isLoading) return;
        setMessages(prev => [...prev, { role: 'user', text: chatInput }]);
        const query = chatInput;
        setChatInput("");
        askGemini(query);
    };

    const destinations = [
        { name: 'Sigiriya, Sri Lanka', price: '15,000', img: 'https://images.unsplash.com/photo-1588598116712-2434676104bc?q=80&w=800', tag: 'Heritage' },
        { name: 'Male, Maldives', price: '145,000', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800', tag: 'Private' },
        { name: 'Dubai, UAE', price: '190,000', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800', tag: 'Luxury' },
        { name: 'Sydney, Australia', price: '420,000', img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=800', tag: 'Adventure' },
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
            <Navbar isScrolled={isScrolled} setIsChatOpen={setIsChatOpen} />
            <Hero activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Trust Bar Section */}
            <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: <ShieldCheck />, title: 'Flexi-Booking', desc: 'Free cancellations' },
                        { icon: <Award />, title: '5-Star Service', desc: 'World class crew' },
                        { icon: <Clock />, title: 'Real-time Updates', desc: 'Live flight tracking' },
                        { icon: <CreditCard />, title: 'Zero Fees', desc: 'No hidden charges' },
                    ].map((item, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-md border border-white/5 p-6 rounded-3xl flex flex-col items-center text-center group hover:bg-white/10 transition-all">
                            <div className="text-blue-400 mb-3 transform group-hover:scale-110 transition-transform">{item.icon}</div>
                            <h4 className="font-bold text-sm text-white">{item.title}</h4>
                            <p className="text-[10px] text-slate-500">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Destinations */}
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-16">
                    <div>
                        <h2 className="text-4xl font-black text-white mb-2">Curated Journeys</h2>
                        <p className="text-slate-500 font-medium">Explore the world's most exclusive destinations.</p>
                    </div>
                    <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                        <ArrowRight size={20} />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {destinations.map((dest, i) => (
                        <div key={i} className="group relative h-[450px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl">
                            <img src={dest.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={dest.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                            <div className="absolute top-6 left-6">
                                <span className="bg-blue-600/80 backdrop-blur-md text-[10px] font-black px-4 py-1.5 rounded-full text-white uppercase">{dest.tag}</span>
                            </div>
                            <div className="absolute bottom-8 left-8 right-8 transition-transform duration-500 group-hover:-translate-y-2">
                                <h3 className="text-2xl font-bold text-white mb-1">{dest.name}</h3>
                                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                    <div className="text-white">
                                        <span className="text-[10px] text-slate-500 block uppercase font-bold">From</span>
                                        <span className="font-black">LKR {dest.price}</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                        <ChevronRight size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Experience Classes */}
            <section className="bg-slate-900/50 py-32 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-5xl font-black text-white mt-4 mb-20">Luxury in Every Inch.</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        {[
                            { title: 'First Class', desc: 'Your private sanctuary in the sky with full-flat suites.', icon: <Star /> },
                            { title: 'Business Class', desc: 'The ultimate office and lounge for the global executive.', icon: <Coffee /> },
                            { title: 'Economy Plus', desc: 'More space, better food, and premium entertainment.', icon: <Wifi /> },
                        ].map((cls, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[3rem] hover:bg-white/10 transition-all group">
                                <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 mb-8 transform group-hover:rotate-12 transition-transform">{cls.icon}</div>
                                <h3 className="text-2xl font-bold text-white mb-4">{cls.title}</h3>
                                <p className="text-slate-400 leading-relaxed mb-8">{cls.desc}</p>
                                <button className="text-blue-400 font-bold flex items-center gap-2 uppercase text-xs tracking-widest">Explore Class <ArrowRight size={14} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <AIChat
                isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen}
                messages={messages} isLoading={isLoading}
                chatInput={chatInput} setChatInput={setChatInput}
                handleSendMessage={handleSendMessage} chatEndRef={chatEndRef}
            />

            {/* Footer */}
            <footer className="bg-black pt-32 pb-16 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16 mb-24">
                    <div className="col-span-2 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white"><Plane size={22} className="-rotate-45" /></div>
                            <span className="text-3xl font-black text-white">CEYLON.</span>
                        </div>
                        <p className="text-slate-500 max-w-sm font-light leading-relaxed">Join our Skywards program for exclusive benefits.</p>
                        <div className="flex gap-6"><Facebook className="text-slate-700 hover:text-white transition-colors" /><Instagram className="text-slate-700 hover:text-white transition-colors" /><Twitter className="text-slate-700 hover:text-white transition-colors" /></div>
                    </div>
                    <div>
                        <h5 className="text-white font-black uppercase text-xs tracking-widest mb-8">Navigation</h5>
                        <ul className="space-y-4 text-slate-500 text-sm font-medium"><li>Route Map</li><li>Flight Status</li><li>Cargo Services</li></ul>
                    </div>
                    <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5">
                        <h5 className="text-white font-black text-sm mb-4">FLYER CLUB</h5>
                        <button className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-500 transition-all text-xs tracking-widest">JOIN NOW</button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;