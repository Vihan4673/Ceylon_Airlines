import React from 'react';
import { MapPin, Calendar, Search } from 'lucide-react';

const Hero = ({ activeTab, setActiveTab }) => (
    <section className="relative h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
        <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1464039397811-476f652a343b?q=80&w=2000" className="w-full h-full object-cover opacity-60 scale-105" alt="Sky" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-[#020617]/40 to-[#020617]"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl">
            <div className="mb-12">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none mb-4">
                    REDEFINE <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-500 animate-pulse">HORIZONS.</span>
                </h1>
                <p className="max-w-xl text-lg text-slate-400 font-light leading-relaxed">
                    Experience the pinnacle of aviation. Where centuries of Sri Lankan warmth meets the cutting edge of modern travel.
                </p>
            </div>

            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-2 shadow-2xl overflow-hidden animate-slide-up">
                <div className="flex border-b border-white/10 px-8 py-4 gap-8 overflow-x-auto">
                    {['flights', 'hotels', 'cars'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`text-[10px] font-black uppercase tracking-[0.2em] pb-2 transition-all ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest"><MapPin size={12} /> Origin</label>
                        <input type="text" placeholder="Colombo (CMB)" className="w-full bg-transparent border-none text-2xl font-bold text-white outline-none placeholder:text-slate-700" />
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest"><MapPin size={12} /> Destination</label>
                        <input type="text" placeholder="Where to?" className="w-full bg-transparent border-none text-2xl font-bold text-white outline-none placeholder:text-slate-700" />
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest"><Calendar size={12} /> Dates</label>
                        <div className="text-2xl font-bold text-white">Select Dates</div>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] h-full flex items-center justify-center gap-3 font-black transition-all hover:scale-[1.02] shadow-xl shadow-blue-500/20">
                        <Search size={20} /> SEARCH
                    </button>
                </div>
            </div>
        </div>
    </section>
);

export default Hero;