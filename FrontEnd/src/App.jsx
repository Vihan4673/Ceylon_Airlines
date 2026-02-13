import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedFares from './components/FeaturedFares';
import Footer from './components/Footer';

export default function App() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 selection:bg-[#8a1538] selection:text-white">
            <Navbar />
            <Hero />
            <FeaturedFares />
            <Footer />
        </div>
    );
}
