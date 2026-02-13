import React from 'react';
import { MapPin, Calendar, Sparkles } from 'lucide-react';

const Hero = ({ setIsChatOpen }) => (
    <header className="hero">
        <div className="hero-bg">
            <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80" alt="Ceylon Sky" />
            <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
            <h4 className="hero-subtitle">Discover the Pearl of the Orient</h4>
            <h1 className="hero-title">Elevate Your Journey Above the Clouds</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '3rem', fontWeight: 300, color: 'rgba(255,255,255,0.9)', maxWidth: '40rem', margin: '0 auto 3rem' }}>
                Experience authentic Sri Lankan hospitality with a touch of modern luxury.
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
);

export default Hero;