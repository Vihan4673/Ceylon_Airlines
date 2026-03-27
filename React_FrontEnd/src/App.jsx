import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChat from './components/AIChat';
import AppRoutes from './Routes/AppRoutes';

const App = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Router>
            <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#1c1c1c]">
                {/* Navbar එක හැම පිටුවකම පේනවා */}
                <Navbar isScrolled={isScrolled} />

                <main>
                    {/* මෙතනින් තමයි අදාළ පිටුව (Home හෝ Booking) load වෙන්නේ */}
                    <AppRoutes />
                </main>

                <Footer />
                <AIChat />
            </div>
        </Router>
    );
};

export default App;