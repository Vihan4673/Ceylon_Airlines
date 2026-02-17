import React, { useState } from 'react';
import { Plane, ChevronDown, Globe, LogIn, UserPlus, ArrowRight } from 'lucide-react';
import { navLinks } from '../data/constants';

const Navbar = ({ isScrolled }) => {
    const [activeMenu, setActiveMenu] = useState(null);

    return (
        <nav
            className={`fixed w-full z-[70] transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4 text-white'}`}
            onMouseLeave={() => setActiveMenu(null)}
        >
            <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
                        <div className="w-10 h-10 bg-[#8A1538] flex items-center justify-center rounded-lg shadow-lg group-hover:rotate-12 transition-transform duration-300">
                            <Plane className="text-white -rotate-45" size={24} />
                        </div>
                        <span className={`text-2xl font-black tracking-tighter ${isScrolled ? 'text-[#8A1538]' : 'text-white'}`}>CEYLONE</span>
                    </div>

                    <div className={`hidden xl:flex gap-8 text-[11px] font-bold uppercase tracking-[0.15em] ${isScrolled ? 'text-slate-600' : 'text-white/90'}`}>
                        {navLinks.map((link) => (
                            <div
                                key={link.label}
                                className="relative py-4 cursor-pointer group"
                                onMouseEnter={() => setActiveMenu(link.label)}
                            >
                                <div className="flex items-center gap-1 hover:text-[#8A1538] transition-colors">
                                    {link.label}
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${activeMenu === link.label ? 'rotate-180' : ''}`} />
                                </div>
                                <div className={`absolute bottom-2 left-0 h-[2px] bg-[#8A1538] transition-all duration-300 ${activeMenu === link.label ? 'w-full' : 'w-0'}`} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`flex items-center gap-6 text-[11px] font-bold ${isScrolled ? 'text-slate-600' : 'text-white'}`}>
                    <div className="hidden md:flex items-center gap-2 cursor-pointer hover:text-[#8A1538] transition-colors uppercase">
                        <Globe size={16} /> <span className="border-b border-transparent hover:border-[#8A1538]">EN</span>
                    </div>
                    <div className="h-6 w-[1px] bg-slate-300/30 hidden md:block"></div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-[#8A1538] transition-colors">
                            <LogIn size={16} /> Log in
                        </div>
                        <button className="bg-[#8A1538] text-white px-5 py-2 rounded-full shadow-lg shadow-[#8A1538]/20 cursor-pointer hover:bg-[#6b102c] transition-all flex items-center gap-2">
                            <UserPlus size={16} /> Sign up
                        </button>
                    </div>
                </div>
            </div>
            {/* Mega Menu implementation here... */}
        </nav>
    );
};

export default Navbar;