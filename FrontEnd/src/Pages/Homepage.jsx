import React from 'react';
import Hero from '../sections/Hero';
import Destinations from '../sections/Destinations';
import Features from '../sections/Features';
import Newsletter from '../sections/Newsletter';

const Home = () => {
    return (
        <>
            <Hero />
            <div className="pt-64"> {/* Booking Widget එකට ඉඩ තැබීමට */}
                <Features />
                <Destinations />
                <Newsletter />
            </div>
        </>
    );
};

export default Home;