import React from 'react';
import { Plane, Sparkles } from 'lucide-react';

const Navbar = ({ isScrolled, setIsChatOpen }) => (
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
);

export default Navbar;