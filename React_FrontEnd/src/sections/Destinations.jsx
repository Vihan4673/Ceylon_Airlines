import React from 'react';
import { ArrowRight } from 'lucide-react';
import { destinationFares } from '../data/constants';

const Destinations = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 mb-32">
            <div className="flex items-center justify-between mb-16">
                <div>
                    <span className="text-[#8A1538] font-bold text-xs uppercase tracking-[0.4em] mb-4 block">Travel Wishlist</span>
                    <h2 className="text-5xl font-serif font-light text-slate-800">Top Destinations</h2>
                </div>
                <button className="bg-slate-50 hover:bg-[#8A1538] hover:text-white px-8 py-3 rounded-full text-slate-600 font-bold text-xs transition-all flex items-center gap-2">
                    Explore More <ArrowRight size={14} />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {destinationFares.map((dest, i) => (
                    <div key={i} className="group relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl hover:-translate-y-3 transition-all duration-700 cursor-pointer">
                        <img src={dest.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={dest.city} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent"></div>
                        <div className="absolute top-8 left-8">
                            <span className="bg-white/10 backdrop-blur-md text-white text-[9px] font-bold uppercase px-4 py-2 rounded-full border border-white/20">{dest.tag}</span>
                        </div>
                        <div className="absolute bottom-10 left-8 right-8 text-white">
                            <h3 className="text-4xl font-serif font-light mb-2">{dest.city}</h3>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-white/50 text-[10px] font-black uppercase mb-1">Economy from</p>
                                    <span className="text-3xl font-black">LKR {dest.price}</span>
                                </div>
                                <div className="w-12 h-12 bg-[#8A1538] rounded-full flex items-center justify-center shadow-xl shadow-[#8A1538]/40"><ArrowRight size={22} /></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Destinations;