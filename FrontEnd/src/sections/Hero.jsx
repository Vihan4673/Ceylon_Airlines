import React from "react";
import { ArrowRight, Calendar } from "lucide-react";
import BookingWidget from "../components/BookingWidget.jsx"; // ⚠️ components small letters (recommended)

const Hero = () => {

    const scrollToBooking = () => {
        const bookingSection = document.getElementById("booking-section");
        bookingSection?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <header className="relative h-[100vh] min-h-[850px] overflow-hidden flex items-center">

            {/* Background */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&q=80&w=2000"
                    className="w-full h-full object-cover scale-105 animate-slow-zoom"
                    alt="Plane"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-[-80px]">

                <div className="max-w-2xl animate-fade-in-up">

                    <div className="flex items-center gap-3 text-white/80 mb-6 tracking-[0.3em] uppercase text-xs font-bold">
                        <span className="w-12 h-[1px] bg-[#8A1538]"></span>
                        World-Class Aviation
                    </div>

                    <h1 className="text-white text-6xl md:text-8xl font-serif font-light leading-[1.0] mb-8">
                        Experience <span className="italic font-normal">Elegance</span> <br />
                        Redefined.
                    </h1>

                    <p className="text-white/70 text-lg mb-10 max-w-lg leading-relaxed font-light">
                        Discover a world of unparalleled luxury with Ceylone.
                        Save up to 20% on our award-winning Business Class cabins.
                    </p>

                    {/* Book Now Button */}
                    <div className="mb-8">
                        <button
                            onClick={scrollToBooking}
                            className="bg-[#8A1538] hover:bg-[#6b102c] text-white px-12 py-5 rounded-full font-bold uppercase text-xs tracking-[0.2em] transition-all flex items-center group shadow-2xl"
                        >
                            Book Now
                            <Calendar className="ml-3 opacity-70 group-hover:scale-110 transition-transform" size={16} />
                        </button>
                    </div>

                    {/* Secondary Button */}
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={scrollToBooking}
                            className="bg-[#8A1538] text-white px-10 py-5 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-[#6b102c] transition-all flex items-center group"
                        >
                            Book a journey
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                        </button>
                    </div>

                </div>

            </div>

            {/* Booking Widget */}
            <div
                id="booking-section"
                className="absolute bottom-16 left-0 right-0 px-6 z-20"
            >
                <BookingWidget />
            </div>

        </header>
    );
};

export default Hero;
