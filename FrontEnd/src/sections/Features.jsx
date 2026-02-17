import React from 'react';
import { ShieldCheck, Coffee, Smartphone, Award } from 'lucide-react';

const Features = () => {
    const features = [
        { icon: <Award className="text-[#8A1538]" size={32} />, title: "Award Winning", desc: "Voted the world's best cabin crew for 5 consecutive years." },
        { icon: <ShieldCheck className="text-[#8A1538]" size={32} />, title: "Safety First", desc: "Leading the industry with the highest safety standards." },
        { icon: <Coffee className="text-[#8A1538]" size={32} />, title: "Fine Dining", desc: "Exquisite multi-course meals prepared by world-class chefs." },
        { icon: <Smartphone className="text-[#8A1538]" size={32} />, title: "Smart Travel", desc: "Manage everything from check-in to luggage on our app." }
    ];

    return (
        <section className="bg-slate-50 py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-[#8A1538] font-bold text-xs uppercase tracking-widest">The Ceylone Advantage</span>
                    <h2 className="text-4xl font-serif mt-2">Redefining the Art of Travel</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {features.map((f, i) => (
                        <div key={i} className="flex flex-col items-center text-center group">
                            <div className="mb-6 p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                                {f.icon}
                            </div>
                            <h4 className="text-lg font-bold mb-2">{f.title}</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;