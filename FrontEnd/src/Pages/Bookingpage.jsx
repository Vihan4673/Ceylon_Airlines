import React, { useState } from 'react';
import { Plane, Calendar, User, ShoppingCart, Filter, Info, ChevronDown, Clock } from 'lucide-react';

const App = () => {
    const [selectedFlight, setSelectedFlight] = useState(null);

    const dates = [
        { day: 'Mon 23', price: '305,000' },
        { day: 'Tue 24', price: '279,000' },
        { day: 'Wed 25', price: '222,600' },
        { day: 'Thu 26', price: '222,600' },
        { day: 'Fri 27', price: '208,500', active: true },
        { day: 'Sat 28', price: '208,500' },
        { day: 'Sun 1', price: '197,600' },
    ];

    const flights = [
        {
            id: 1,
            departure: '00:25',
            arrival: '15:55',
            from: 'CMB',
            to: 'MEL',
            duration: '10h 30min',
            type: 'Non-stop',
            airline: 'SriLankan Airlines',
            price: '208,500',
            seats: 4
        },
        {
            id: 2,
            departure: '00:05',
            arrival: '22:35',
            from: 'CMB',
            to: 'MEL',
            duration: '17h 00min',
            type: '1 stop',
            airline: 'SriLankan Airlines / Qantas',
            price: '261,463',
            seats: 8
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Top Navigation Bar */}
            <nav className="bg-[#0054a6] text-white p-3 flex justify-between items-center sticky top-0 z-50 shadow-lg">
                <div className="flex gap-8 overflow-x-auto no-scrollbar items-center">
                    <div className="flex flex-col min-w-[80px]">
                        <span className="text-[10px] opacity-80 uppercase tracking-tighter">CMB</span>
                        <span className="text-xs font-bold truncate">Colombo</span>
                    </div>
                    <Plane size={14} className="rotate-90 opacity-60 shrink-0" />
                    <div className="flex flex-col min-w-[80px]">
                        <span className="text-[10px] opacity-80 uppercase tracking-tighter">MEL</span>
                        <span className="text-xs font-bold truncate">Melbourne</span>
                    </div>
                    <div className="flex flex-col border-l border-white/20 pl-4">
                        <span className="text-[10px] opacity-80 uppercase tracking-tighter">Depart</span>
                        <span className="text-xs font-bold">Fri, 27 Feb</span>
                    </div>
                    <div className="flex flex-col border-l border-white/20 pl-4">
                        <span className="text-[10px] opacity-80 uppercase tracking-tighter">Return</span>
                        <span className="text-xs font-bold">Thu, 12 Mar</span>
                    </div>
                    <div className="flex flex-col border-l border-white/20 pl-4">
                        <span className="text-[10px] opacity-80 uppercase tracking-tighter">Passenger</span>
                        <span className="text-xs font-bold">1 Adult</span>
                    </div>
                </div>
                <button className="bg-[#00a6e2] hover:bg-[#008cc0] px-4 py-2 rounded flex items-center gap-2 text-xs font-bold transition-all shadow-md shrink-0">
                    <ShoppingCart size={16} />
                    <span className="hidden sm:inline">Booking Summary</span>
                </button>
            </nav>

            {/* Hero Background Image Section */}
            <div className="relative h-48 md:h-64 bg-slate-800">
                <img
                    src="https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&q=80&w=2000"
                    alt="Coastal View"
                    className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <button className="bg-white/90 text-slate-800 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-2 mb-4">
                        Modify <ChevronDown size={14} />
                    </button>
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 px-8 py-3 rounded text-white font-medium shadow-2xl">
                        Colombo to Melbourne
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 -mt-10 relative z-10 pb-20">

                {/* Date Selector */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-6 border border-slate-200">
                    <div className="text-center py-4 border-b border-slate-100 font-bold text-slate-700">
                        Friday, 27 February 2026
                    </div>
                    <div className="grid grid-cols-7 divide-x divide-slate-100">
                        {dates.map((d, i) => (
                            <div
                                key={i}
                                className={`p-3 text-center cursor-pointer transition-all hover:bg-slate-50 ${d.active ? 'bg-[#0054a6] text-white' : 'text-slate-600'}`}
                            >
                                <div className="text-[10px] uppercase font-medium">{d.day}</div>
                                <div className="text-[10px] mt-1 opacity-70">LKR</div>
                                <div className="text-xs font-bold">{d.price}</div>
                                {d.active && <div className="mt-1 flex justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filters & Info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <button className="flex items-center gap-2 border border-slate-300 px-4 py-2 rounded-lg bg-white text-slate-600 text-sm hover:bg-slate-50 transition-colors">
                        <Filter size={16} /> Filters
                    </button>
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 italic">
                            <Info size={12} />
                            The flights are not displayed in neutral order and certain airlines' fare, schedule or availability information is given preferential treatment.
                        </div>
                        <div className="text-sm text-slate-600 font-medium">Sort by: <span className="text-[#0054a6] cursor-pointer">Most Relevant</span></div>
                    </div>
                </div>

                {/* Flight List */}
                <div className="space-y-4">
                    {flights.map((flight) => (
                        <div key={flight.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 overflow-hidden">
                            <div className="flex flex-col lg:flex-row">
                                {/* Flight Details Section */}
                                <div className="flex-1 p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-slate-800">{flight.departure}</div>
                                            <div className="text-xs text-slate-400 font-bold uppercase">{flight.from}</div>
                                            <div className="text-[10px] text-slate-400 leading-tight">Bandaranaike<br/>International</div>
                                        </div>

                                        <div className="flex-1 px-8 flex flex-col items-center">
                                            <div className="text-[10px] text-slate-400 mb-1">{flight.type}</div>
                                            <div className="w-full h-px bg-slate-200 relative">
                                                <Plane size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300 rotate-90" />
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <div className="text-xl font-bold text-slate-800">{flight.arrival}</div>
                                            <div className="text-xs text-slate-400 font-bold uppercase">{flight.to}</div>
                                            <div className="text-[10px] text-slate-400 leading-tight">Melbourne Airport<br/>Terminal 2</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-1">
                                            <Clock size={14} /> Duration {flight.duration}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <img src="https://upload.wikimedia.org/wikipedia/en/2/24/SriLankan_Airlines_Logo.svg" alt="UL" className="h-4" />
                                            {flight.airline}
                                        </div>
                                        <button className="text-[#0054a6] font-bold text-[10px] ml-auto uppercase tracking-wider">See itinerary details</button>
                                    </div>
                                </div>

                                {/* Pricing Section */}
                                <div className="lg:w-64 bg-slate-50 border-l border-slate-100 p-0 flex flex-col relative">
                                    <div className="bg-[#0054a6] text-white text-[10px] px-3 py-1 self-end rounded-bl-lg font-bold">
                                        {flight.seats} seats left
                                    </div>
                                    <div className="flex-1 p-6 flex flex-col justify-center items-center group cursor-pointer hover:bg-[#00a6e2] hover:text-white transition-all">
                                        <div className="text-xs font-bold mb-1">Economy</div>
                                        <div className="text-[10px] opacity-70">from LKR</div>
                                        <div className="text-2xl font-black">{flight.price}</div>
                                        <ChevronDown className="mt-2 opacity-50 group-hover:translate-y-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer Branding */}
            <footer className="bg-slate-900 text-white/40 py-8 text-center text-xs">
                &copy; 2026 Airline Booking System. All rights reserved.
            </footer>
        </div>
    );
};

export default App;