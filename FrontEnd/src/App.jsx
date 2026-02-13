import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedFares from "./components/FeaturedFares";
import Footer from "./components/Footer";

function App() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-[#8a1538] selection:text-white">
            <Navbar />
            <main>
                <Hero />
                <FeaturedFares />
            </main>
            <Footer />
        </div>
    );
}

export default App;
