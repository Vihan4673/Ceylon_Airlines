import React from 'react';
import { ChevronRight } from 'lucide-react';

const DestinationGrid = ({ destinations, askGemini, setIsChatOpen }) => (
    <section className="section">
        <div className="section-header">
            <span style={{ color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Top Offers</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Popular Destinations</h2>
        </div>
        <div className="dest-grid">
            {destinations.map((dest, idx) => (
                <div key={idx} className="card">
                    <div className="card-img-wrap">
                        <img src={dest.image} alt={dest.name} />
                    </div>
                    <div className="card-content">
                        <h3>{dest.name}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ color: '#2563eb', fontWeight: 800 }}>{dest.price}</p>
                            <button onClick={() => { setIsChatOpen(true); askGemini(`${dest.name} info.`); }} className="icon-btn">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

export default DestinationGrid;