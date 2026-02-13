import { MapPin, Calendar, Sparkles } from "lucide-react";

const BookingCard = () => {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-lg mt-10 grid md:grid-cols-4 gap-6 text-slate-900">
            <div>
                <label className="text-xs font-bold text-gray-400 flex gap-1">
                    <MapPin size={12} /> From
                </label>
                <input
                    className="border-b-2 w-full font-semibold outline-none"
                    placeholder="Colombo"
                />
            </div>

            <div>
                <label className="text-xs font-bold text-gray-400 flex gap-1">
                    <MapPin size={12} /> To
                </label>
                <input
                    className="border-b-2 w-full font-semibold outline-none"
                    placeholder="Where to?"
                />
            </div>

            <div>
                <label className="text-xs font-bold text-gray-400 flex gap-1">
                    <Calendar size={12} /> Date
                </label>
                <input type="date" className="border-b-2 w-full" />
            </div>

            <button className="bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                <Sparkles size={18} /> Plan with AI
            </button>
        </div>
    );
};

export default BookingCard;
