import React from 'react';
import { ArrowRight } from 'lucide-react';

const MegaMenu = ({ activeMenu, navLinks, setActiveMenu }) => {
    if (!activeMenu) return null;

    const currentLink = navLinks.find(l => l.label === activeMenu);

    return (
        <div
            className="absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-2xl animate-in slide-in-from-top-2 duration-300 overflow-hidden"
            onMouseEnter={() => setActiveMenu(activeMenu)}
        >
            <div className="max-w-7xl mx-auto px-10 py-12 grid grid-cols-4 gap-12 text-slate-800">
                <div className="col-span-1">
                    <h3 className="text-[#8A1538] text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                        {currentLink?.icon} {activeMenu} Services
                    </h3>
                    <ul className="space-y-4">
                        {currentLink?.items.map((item, idx) => (
                            <li key={idx} className="group flex items-center justify-between text-sm font-medium hover:text-[#8A1538] cursor-pointer transition-colors border-b border-slate-50 pb-2">
                                {item}
                                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Featured Content */}
                <div className="col-span-3 grid grid-cols-3 gap-6">
                    <div className="relative h-64 rounded-2xl overflow-hidden group">
                        <img src="https://images.unsplash.com/photo-1540339832862-47459980783f?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="promo" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#8A1538]/80 to-transparent flex items-end p-6">
                            <p className="text-white font-bold text-sm">Ceylone Signature Lounges</p>
                        </div>
                    </div>
                    {/* Add more featured cards as needed... */}
                </div>
            </div>
        </div>
    );
};

export default MegaMenu;