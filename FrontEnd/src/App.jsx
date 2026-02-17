import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChat from './components/AIChat';
import Home from './pages/Homepage.jsx';

// උදාහරණයක් ලෙස තවත් පිටුවක්
const SearchResults = () => <div className="pt-32 p-10 text-center">Flight Search Results Coming Soon...</div>;

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
                {/* Navbar එක හැම පිටුවකම පේන නිසා Routes වලින් පිටත තබන්න */}
                <Navbar isScrolled={isScrolled} />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<SearchResults />} />
                </Routes>

                <Footer />
                <AIChat />
            </div>
        </Router>
    );
};

export default App;