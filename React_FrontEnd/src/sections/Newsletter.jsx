import React from 'react';
import { Send } from 'lucide-react';

const Newsletter = () => {
    return (
        <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto bg-[#8A1538] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
                {/* අලංකාර පසුබිම් රූපයක් (Abstract) */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>

                <div className="relative z-10">
                    <h2 className="text-white text-3xl md:text-5xl font-serif mb-6">Never miss a journey.</h2>
                    <p className="text-white/70 mb-10 max-w-lg mx-auto">Subscribe to get exclusive offers and the latest travel news directly to your inbox.</p>

                    <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-all"
                        />
                        <button className="bg-white text-[#8A1538] px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                            Subscribe <Send size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;