import React, { useState } from 'react';
import { Plane, Briefcase, Clock, ShieldCheck, MapPin, ArrowRightLeft, Compass, Calendar, Search } from 'lucide-react';

const BookingWidget = () => {
    const [activeTab, setActiveTab] = useState('book');
    const [tripType, setTripType] = useState('return');

    const tabs = [
        { id: 'book', icon: Plane, label: 'Book Flight' },
        { id: 'manage', icon: Briefcase, label: 'Manage Booking' },
        { id: 'status', icon: Clock, label: 'Flight Status' },
        { id: 'checkin', icon: ShieldCheck, label: 'Check-in' }
    ];

    return (
        <div className="max-w-7xl mx-auto bg-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] rounded-[2.5rem] overflow-hidden">
            <div className="flex bg-slate-50/80">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-3 py-7 text-[10px] uppercase font-black tracking-widest transition-all relative ${activeTab === tab.id ? 'bg-white text-[#8A1538]' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <tab.icon size={18} /> {tab.label}
                        {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#8A1538]" />}
                    </button>
                ))}
            </div>

            <div className="p-10">
                <div className="flex gap-10 mb-10 border-b border-slate-100 pb-4">
                    {['Return', 'One Way', 'Multi-City'].map(type => (
                        <button
                            key={type}
                            onClick={() => setTripType(type.toLowerCase().replace(' ', ''))}
                            className={`flex items-center gap-2 text-xs font-bold ${tripType === type.toLowerCase().replace(' ', '') ? 'text-[#8A1538]' : 'text-slate-400'}`}
                        >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${tripType === type.toLowerCase().replace(' ', '') ? 'border-[#8A1538]' : 'border-slate-300'}`}>
                                {tripType === type.toLowerCase().replace(' ', '') && <div className="w-2 h-2 rounded-full bg-[#8A1538]" />}
                            </div>
                            {type}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-3 bg-slate-50 rounded-2xl p-5 border border-slate-100 relative">
                        <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">From</span>
                        <div className="flex items-center gap-3">
                            <MapPin size={20} className="text-[#8A1538]" />
                            <span className="font-bold text-slate-700 text-lg">Colombo CMB</span>
                        </div>
                        <div className="absolute -right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border shadow-xl rounded-full hidden md:flex items-center justify-center text-[#8A1538]">
                            <ArrowRightLeft size={16} />
                        </div>
                    </div>
                    {/* ඉතිරි Inputs (To, Date, Search Button) මෙලෙසම ඇතුළත් කරන්න */}
                    <div className="md:col-span-3 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                        <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">To</span>
                        <div className="flex items-center gap-3 text-[#8A1538]">
                            <Compass size={20} /> <span className="font-bold text-lg">Where to?</span>
                        </div>
                    </div>

                    <div className="md:col-span-4 grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Departure</span>
                            <div className="flex items-center gap-3"><Calendar size={20} /> <span className="font-bold">14 Feb</span></div>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Return</span>
                            <div className="flex items-center gap-3"><Calendar size={20} /> <span className="font-bold">21 Feb</span></div>
                        </div>
                    </div>

                    <button className="md:col-span-2 bg-[#8A1538] text-white rounded-2xl font-black uppercase text-[12px] tracking-widest hover:bg-[#6b102c] transition-all flex items-center justify-center gap-3">
                        <Search size={20} /> Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingWidget;