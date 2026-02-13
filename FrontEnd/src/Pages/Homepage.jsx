import React, { useState, useEffect, useRef } from 'react';
import { Plane, MapPin, Calendar, Users, ChevronRight, Menu, X, Facebook, Instagram, Twitter, Phone, Globe, Sparkles, Send, Bot, Loader2 } from 'lucide-react';

const App = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // AI Chat State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Ayubowan! I am your Ceylon AI Assistant. ✨ How can I help you plan your journey today?" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    const apiKey = ""; // Runtime environment provides the key

    // Scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Navbar scroll animation
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Gemini API Call Function with Exponential Backoff
    const askGemini = async (userQuery) => {
        setIsLoading(true);
        const systemPrompt = "You are the official AI assistant for Ceylon Airline. Be helpful, professional, and hospitable. Use a touch of Sri Lankan warmth. You can suggest destinations, explain flight services, and help with travel planning. Keep responses concise.";

        const callWithRetry = async (retries = 0) => {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: userQuery }] }],
                        systemInstruction: { parts: [{ text: systemPrompt }] }
                    })
                });

                if (!response.ok) throw new Error('API Error');

                const data = await response.json();
                return data.candidates?.[0]?.content?.parts?.[0]?.text;
            } catch (error) {
                if (retries < 5) {
                    const delay = Math.pow(2, retries) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return callWithRetry(retries + 1);
                }
                throw error;
            }
        };

        try {
            const result = await callWithRetry();
            setMessages(prev => [...prev, { role: 'assistant', text: result }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', text: "Kshamisidi, svalpa thondare aagidhe. Dayavittu nantara prayatnisi! ✈️" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim() || isLoading) return;

        const userMsg = chatInput.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setChatInput("");
        askGemini(userMsg);
    };

    const destinations = [
        { name: 'Ella, Sri Lanka', price: 'LKR 12,500', image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=600&q=80', tag: 'Nature' },
        { name: 'London, UK', price: 'LKR 285,000', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80', tag: 'Business' },
        { name: 'Paris, France', price: 'LKR 310,000', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', tag: 'Luxury' },
        { name: 'Tokyo, Japan', price: 'LKR 240,000', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80', tag: 'Culture' }
    ];

    return (
        <div className="app-container">
            <style>{`
        .app-container {
          min-height: 100vh;
          background-color: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #0f172a;
          margin: 0;
          padding: 0;
        }

        /* Navbar */
        nav {
          position: fixed;
          width: 100%;
          z-index: 50;
          padding: 1rem 1.5rem;
          transition: all 0.3s ease;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
        }
        .nav-content {
          max-width: 1280px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-scrolled {
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          padding: 0.75rem 1.5rem;
        }
        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .logo-icon {
          padding: 0.5rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
        }
        .logo-text {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.05em;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .nav-links { display: none; }
        }
        .nav-links a, .nav-links button {
          cursor: pointer;
          background: none;
          border: none;
          color: inherit;
          font-size: 0.95rem;
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-links a:hover { color: #3b82f6; }
        .book-btn {
          padding: 0.6rem 1.5rem;
          border-radius: 9999px;
          font-weight: 600;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
        }

        /* Hero */
        .hero {
          position: relative;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          color: white;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .hero-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.2), #f8fafc);
        }
        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 0 1.5rem;
          max-width: 60rem;
        }
        .hero-subtitle {
          color: #60a5fa;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }
        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }
        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; }
        }

        /* Booking Card */
        .booking-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          padding: 0.5rem;
          border-radius: 2rem;
          border: 1px solid rgba(255,255,255,0.2);
          max-width: 1000px;
          margin: 3rem auto 0;
        }
        .booking-inner {
          background: white;
          border-radius: 1.5rem;
          padding: 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          text-align: left;
          color: #0f172a;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
        }
        .field-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .field-label { font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem; }
        .field-input { border: none; border-bottom: 2px solid #f1f5f9; font-size: 1rem; font-weight: 600; padding: 0.5rem 0; width: 100%; outline: none; transition: border-color 0.2s; }
        .field-input:focus { border-color: #3b82f6; }
        .search-btn {
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 1rem;
          padding: 1rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .search-btn:hover { background: #1d4ed8; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3); }

        /* Destinations */
        .section { padding: 8rem 1.5rem; max-width: 1280px; margin: 0 auto; }
        .section-header { margin-bottom: 4rem; text-align: center; }
        .dest-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; }
        .card { background: white; border-radius: 2rem; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .card:hover { transform: translateY(-10px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        .card-img-wrap { height: 18rem; position: relative; overflow: hidden; }
        .card-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s; }
        .card:hover .card-img-wrap img { transform: scale(1.1); }
        .card-content { padding: 1.5rem; }

        /* AI Chat Window */
        .chat-window {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 22rem;
          height: 480px;
          background: white;
          border-radius: 1.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          z-index: 100;
          display: flex; flex-direction: column; overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        .chat-header { background: #2563eb; padding: 1.25rem; color: white; display: flex; justify-content: space-between; align-items: center; }
        .chat-body { flex: 1; overflow-y: auto; padding: 1.25rem; background: #f8fafc; display: flex; flex-direction: column; gap: 1rem; }
        .message { max-width: 85%; padding: 0.85rem 1rem; border-radius: 1.25rem; font-size: 0.875rem; line-height: 1.5; }
        .msg-assistant { background: white; color: #334155; border: 1px solid #f1f5f9; align-self: flex-start; border-bottom-left-radius: 0.25rem; }
        .msg-user { background: #2563eb; color: white; align-self: flex-end; border-bottom-right-radius: 0.25rem; }
        .chat-input-area { padding: 1rem; border-top: 1px solid #f1f5f9; display: flex; gap: 0.5rem; background: white; }
        .chat-input-area input { flex: 1; padding: 0.75rem 1rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; outline: none; font-size: 0.875rem; }
        .chat-input-area button { background: #2563eb; color: white; border: none; border-radius: 0.75rem; width: 2.5rem; height: 2.5rem; display: flex; items-center; justify-content: center; cursor: pointer; }

        /* Experience Section */
        .exp-section { background: #1e3a8a; color: white; padding: 8rem 1.5rem; text-align: center; }
        .exp-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem; margin-top: 5rem; }
        .exp-card { background: rgba(255,255,255,0.05); padding: 3rem 2rem; border-radius: 2.5rem; border: 1px solid rgba(255,255,255,0.1); transition: background 0.3s; }
        .exp-card:hover { background: rgba(255,255,255,0.08); }
        .exp-icon { margin: 0 auto 2rem; color: #60a5fa; }

        /* Footer */
        footer { background: #020617; color: #94a3b8; padding: 6rem 1.5rem 3rem; }
        .footer-content { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 4rem; }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.05); margin-top: 5rem; padding-top: 2rem; text-align: center; font-size: 0.75rem; }
        h4 { color: white; margin-bottom: 1.5rem; font-size: 1.1rem; }
        ul { list-style: none; padding: 0; margin: 0; }
        li { margin-bottom: 0.75rem; cursor: pointer; transition: color 0.2s; }
        li:hover { color: #3b82f6; }
      `}</style>

            {/* Navigation */}
            <nav className={isScrolled ? 'nav-scrolled' : ''}>
                <div className="nav-content">
                    <div className="logo-container">
                        <div className="logo-icon" style={{ backgroundColor: isScrolled ? '#2563eb' : 'rgba(255,255,255,0.2)', color: 'white' }}>
                            <Plane size={22} className="rotate-45" />
                        </div>
                        <span className="logo-text" style={{ color: isScrolled ? '#1e3a8a' : 'white' }}>
              CEYLON <span style={{ fontWeight: 300 }}>AIRLINE</span>
            </span>
                    </div>

                    <div className="nav-links" style={{ color: isScrolled ? '#475569' : 'rgba(255,255,255,0.9)' }}>
                        <a href="#">Home</a>
                        <a href="#">Destinations</a>
                        <a href="#">Experience</a>
                        <button onClick={() => setIsChatOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                            <Sparkles size={16} color="#3b82f6" /> AI Assistant
                        </button>
                        <button className="book-btn" style={{
                            backgroundColor: isScrolled ? '#2563eb' : 'white',
                            color: isScrolled ? 'white' : '#1e3a8a'
                        }}>
                            Book Now
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero">
                <div className="hero-bg">
                    <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80" alt="Ceylon Sky" />
                    <div className="hero-overlay"></div>
                </div>

                <div className="hero-content">
                    <h4 className="hero-subtitle">Discover the Pearl of the Orient</h4>
                    <h1 className="hero-title">Elevate Your Journey Above the Clouds</h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '3rem', fontWeight: 300, color: 'rgba(255,255,255,0.9)', maxWidth: '40rem', margin: '0 auto 3rem' }}>
                        Experience authentic Sri Lankan hospitality with a touch of modern luxury. Fly to 50+ global destinations.
                    </p>

                    <div className="booking-card">
                        <div className="booking-inner">
                            <div className="field-group">
                                <label className="field-label"><MapPin size={12} /> From</label>
                                <input type="text" placeholder="Colombo (CMB)" className="field-input" />
                            </div>
                            <div className="field-group">
                                <label className="field-label"><MapPin size={12} /> To</label>
                                <input type="text" placeholder="Where to?" className="field-input" />
                            </div>
                            <div className="field-group">
                                <label className="field-label"><Calendar size={12} /> Date</label>
                                <input type="date" className="field-input" />
                            </div>
                            <button onClick={() => setIsChatOpen(true)} className="search-btn">
                                <Sparkles size={18} /> Plan with AI
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* AI Chat Window */}
            {isChatOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Bot size={20} />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Ceylon AI Agent</span>
                                <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>Online matthe sahaayakakke siddha</span>
                            </div>
                        </div>
                        <button onClick={() => setIsChatOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.25rem' }}>
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
                                <Loader2 size={14} className="animate-spin" /> Ceylon AI yochisutta ide...
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="chat-input-area">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Nimma trip bagge keliri..."
                        />
                        <button type="submit" disabled={isLoading}>
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            )}

            {/* Destinations Section */}
            <section className="section">
                <div className="section-header">
                    <span style={{ color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Top Offers</span>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem' }}>Popular Destinations</h2>
                </div>
                <div className="dest-grid">
                    {destinations.map((dest, idx) => (
                        <div key={idx} className="card">
                            <div className="card-img-wrap">
                                <img src={dest.image} alt={dest.name} />
                                <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(255,255,255,0.9)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.65rem', fontWeight: 800, color: '#2563eb' }}>
                                    {dest.tag}
                                </div>
                            </div>
                            <div className="card-content">
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>{dest.name}</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Starts from</span>
                                        <p style={{ color: '#2563eb', fontWeight: 800, fontSize: '1.1rem' }}>{dest.price}</p>
                                    </div>
                                    <button onClick={() => { setIsChatOpen(true); askGemini(`${dest.name} bagge mahithi needi.`); }} style={{ background: '#f8fafc', border: 'none', padding: '0.75rem', borderRadius: '1rem', cursor: 'pointer', color: '#3b82f6' }}>
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Experience Section */}
            <section className="exp-section">
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>The Ceylon Experience</h2>
                    <p style={{ color: '#bfdbfe', maxWidth: '30rem', margin: '1rem auto' }}>Navu prathi prayanvannu visheshavaagi maadi, nimage island hospitality anubhavisalu sahaaya maaduttheve.</p>
                    <div className="exp-grid">
                        <div className="exp-card">
                            <Plane size={40} className="exp-icon" />
                            <h3 style={{ marginBottom: '1rem' }}>Smart Fleet</h3>
                            <p style={{ color: '#bfdbfe', fontSize: '0.9rem', lineHeight: 1.6 }}>Fly in our modern Airbus fleet equipped with high-speed Wi-Fi and HD entertainment.</p>
                        </div>
                        <div className="exp-card">
                            <Users size={40} className="exp-icon" />
                            <h3 style={{ marginBottom: '1rem' }}>Island Hospitality</h3>
                            <p style={{ color: '#bfdbfe', fontSize: '0.9rem', lineHeight: 1.6 }}>Our award-winning crew brings the famous Sri Lankan smile to your every single journey.</p>
                        </div>
                        <div className="exp-card">
                            <Sparkles size={40} className="exp-icon" />
                            <h3 style={{ marginBottom: '1rem' }}>AI Travel Guide</h3>
                            <p style={{ color: '#bfdbfe', fontSize: '0.9rem', lineHeight: 1.6 }}>Use our built-in Gemini AI to customize your in-flight meals and personal destination itineraries.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer>
                <div className="footer-content">
                    <div>
                        <div className="logo-container" style={{ marginBottom: '1.5rem' }}>
                            <div className="logo-icon" style={{ backgroundColor: '#2563eb', color: 'white' }}>
                                <Plane size={20} className="rotate-45" />
                            </div>
                            <span className="logo-text" style={{ color: 'white' }}>CEYLON</span>
                        </div>
                        <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                            Making the sky more accessible and journeys more memorable. Your premium bridge to the world.
                        </p>
                    </div>
                    <div>
                        <h4>Quick Links</h4>
                        <ul>
                            <li>AI Travel Guide ✨</li>
                            <li>Flight Status</li>
                            <li>Special Offers</li>
                            <li>Experience</li>
                        </ul>
                    </div>
                    <div>
                        <h4>Contact Us</h4>
                        <ul>
                            <li><Phone size={14} style={{ marginRight: '0.5rem' }} /> +94 11 234 5678</li>
                            <li><Globe size={14} style={{ marginRight: '0.5rem' }} /> www.ceylonairline.com</li>
                        </ul>
                    </div>
                    <div>
                        <h4>Newsletter</h4>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input type="email" placeholder="Email address" style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', color: 'white', flex: 1, fontSize: '0.8rem' }} />
                            <button style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '0.8rem' }}>Join</button>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    © 2024 Ceylon Airline. Gemini AI dwara shakthigolisalpaatidhe. ✨
                </div>
            </footer>
        </div>
    );
};

export default App;