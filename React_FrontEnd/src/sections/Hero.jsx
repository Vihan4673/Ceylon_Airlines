import React from "react";
// 1. useNavigate import karanna
import { useNavigate } from "react-router-dom";
import { ArrowRight, Plane, ShieldCheck, Globe, Search, Calendar } from "lucide-react";

const BookingWidget = () => {
    return (
        <div className="w-full bg-white/10 backdrop-blur-xl rounded-[2rem] p-4 md:p-8 flex flex-col md:flex-row gap-4 items-center border border-white/20 shadow-2xl">
            <div className="flex-1 w-full space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold ml-2">Kuthun (From)</label>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3 text-white">
                    <Plane className="text-[#8A1538] rotate-45" size={20} />
                    <input type="text" placeholder="Colombo (CMB)" className="bg-transparent outline-none w-full placeholder:text-white/20" />
                </div>
            </div>

            <div className="flex-1 w-full space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold ml-2">Kuthe (To)</label>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3 text-white">
                    <Plane className="text-[#8A1538]" size={20} />
                    <input type="text" placeholder="London (LHR)" className="bg-transparent outline-none w-full placeholder:text-white/20" />
                </div>
            </div>

            <div className="flex-1 w-full space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold ml-2">Tarikh (Date)</label>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3 text-white">
                    <Calendar className="text-[#8A1538]" size={20} />
                    <input type="text" placeholder="Select Date" className="bg-transparent outline-none w-full placeholder:text-white/20" />
                </div>
            </div>

            <button className="h-[60px] md:h-full aspect-square md:w-[70px] bg-[#8A1538] hover:bg-[#a31a42] rounded-2xl flex items-center justify-center transition-all group shrink-0 mt-6 md:mt-0">
                <Search className="text-white group-hover:scale-110 transition-transform" size={24} />
            </button>
        </div>
    );
};

const Hero = () => {
    // 2. Navigate function eka initialize karanna
    const navigate = useNavigate();

    return (
        <header className="relative h-screen min-h-[900px] overflow-hidden flex items-center bg-black">
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&q=80&w=2000"
                    className="w-full h-full object-cover scale-110 animate-slow-zoom"
                    alt="Luxury Aviation"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-12">
                <div className="max-w-3xl space-y-8">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-fade-in">
                        <span className="flex h-2 w-2 rounded-full bg-[#8A1538] animate-pulse"></span>
                        <span className="text-white/80 text-[10px] font-bold uppercase tracking-[0.3em]">
                            Excellence in the Skies
                        </span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-white text-6xl md:text-8xl font-serif font-light leading-[1.1] tracking-tight">
                            Journey <span className="italic font-normal text-white/90">Beyond</span> <br />
                            The Horizon.
                        </h1>
                        <p className="text-white/60 text-lg md:text-xl max-w-md leading-relaxed font-light">
                            Experience the pinnacle of luxury travel. Award-winning service meets unparalleled comfort in our new cabins.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                        <button
                            // 3. Navigate function eka use karanna
                            onClick={() => navigate("/booking")}
                            className="w-full sm:w-auto bg-[#8A1538] hover:bg-[#a31a42] text-white px-10 py-5 rounded-full font-bold uppercase text-[11px] tracking-[0.2em] transition-all duration-500 flex items-center justify-center group shadow-[0_15px_30px_rgba(138,21,56,0.3)] active:scale-95"
                        >
                            Book Your Flight
                            <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform duration-300" size={18} />
                        </button>

                        <div className="flex items-center gap-6 text-white/40 text-xs font-medium uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={16} className="text-[#8A1538]" />
                                Secured
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe size={16} className="text-[#8A1538]" />
                                Global
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 pt-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Star_Alliance_logo.svg" alt="Alliance" className="h-6" />
                        <span className="w-px h-6 bg-white/20"></span>
                        <div className="text-white font-serif italic text-lg tracking-tighter">Ceylone SkyAwards 2024</div>
                    </div>
                </div>
            </div>

            <div id="booking-section" className="absolute bottom-12 left-0 right-0 px-6 z-20 animate-fade-in-up">
                <div className="max-w-6xl mx-auto p-1 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl">
                    <BookingWidget />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes slow-zoom {
                    from { transform: scale(1); }
                    to { transform: scale(1.15); }
                }
                .animate-slow-zoom {
                    animation: slow-zoom 25s ease-in-out infinite alternate;
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                .animate-fade-in {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
            `}} />
        </header>
    );
};

export default Hero;