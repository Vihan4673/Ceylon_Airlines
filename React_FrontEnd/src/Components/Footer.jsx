import React from 'react';
import { Plane, Facebook, Instagram, Twitter } from 'lucide-react';
import { navLinks } from '../data/constants';

const Footer = () => {
    return (
        <footer className="bg-[#0f0f0f] text-white py-16">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-12 h-12 bg-[#8A1538] flex items-center justify-center rounded-xl">
                        <Plane className="text-white -rotate-45" size={26} />
                    </div>
                    <span className="text-3xl font-black tracking-tighter">CEYLONE</span>
                </div>

                {/* Quick Links */}
                <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-[0.2em] mb-12 text-slate-500">
                    {navLinks.map((l) => (
                        <span key={l.label} className="hover:text-[#8A1538] cursor-pointer transition-colors">
              {l.label}
            </span>
                    ))}
                </div>

                {/* Social Media */}
                <div className="flex gap-8 mb-16">
                    {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                        <a key={idx} href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#8A1538] transition-all">
                            <Icon size={20} />
                        </a>
                    ))}
                </div>

                {/* Copyright */}
                <p className="text-slate-700 text-[10px] font-black uppercase tracking-widest">
                    © 2026 Ceylone Airlines. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;