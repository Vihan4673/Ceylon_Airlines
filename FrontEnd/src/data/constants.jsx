import { Globe, Plane, Star, Gift, HelpCircle } from 'lucide-react';

export const navLinks = [
    { label: 'Explore', items: ['Destinations', 'Flight Schedule', 'Flight Status', 'Travel Requirements', 'Special Offers'], icon: <Globe size={14} /> },
    { label: 'Book', items: ['Book Flight', 'Manage Booking', 'Seat Selection', 'Online Check-in', 'Baggage Add / Extra', 'Booking History'], icon: <Plane size={14} className="-rotate-45" /> },
    { label: 'Experience', items: ['Cabin Classes', 'In-flight Dining', 'Entertainment', 'Lounges', 'Fleet'], icon: <Star size={14} /> },
    { label: 'Privilege Club', items: ['Join Club', 'Check Balance', 'Benefits', 'Partners', 'Family Program'], icon: <Gift size={14} /> },
    { label: 'Help', items: ['Contact Us', 'FAQs', 'Lost & Found', 'Special Assistance', 'Feedback'], icon: <HelpCircle size={14} /> }
];

export const destinationFares = [
    { city: "Paris", price: "185,200", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600", tag: "Romantic" },
    { city: "Tokyo", price: "142,500", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=600", tag: "Cultural" },
    { city: "Maldives", price: "89,000", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=600", tag: "Relaxing" },
    { city: "New York", price: "245,000", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=600", tag: "Metropolis" }
];