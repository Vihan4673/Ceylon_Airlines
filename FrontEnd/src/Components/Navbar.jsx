import React from 'react';
import { Plane, Sparkles } from 'lucide-react';

const Navbar = ({ isScrolled, setIsChatOpen }) => (
    <nav className={`fixed w-full z-50 transition-all duration-500 px-6 py-4 flex justify-center ${
        isScrolled ? 'bg-black/40 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
    }`}>
        <div className="max-w-7xl w-full flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                    <Plane size={22} className="-rotate-45" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-white">CEYLON<span className="text-blue-500">.</span></span>
            </div>

            <div className="hidden lg:flex items-center gap-10 text-sm font-bold uppercase tracking-widest">
                {['Book', 'Discover', 'Experience', 'Loyalty'].map((item) => (
                    <a key={item} href="#" className="hover:text-blue-400 transition-colors relative group">
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
                    </a>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <button onClick={() => setIsChatOpen(true)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <Sparkles size={20} className="text-blue-400" />
                </button>
                <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-black hover:bg-blue-500 hover:text-white transition-all transform active:scale-95 shadow-xl shadow-white/5">
                    MY ACCOUNT
                </button>
            </div>
        </div>
    </nav>
);

export default Navbar;