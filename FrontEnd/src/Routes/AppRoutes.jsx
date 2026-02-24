import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Homepage.jsx'; // Path එක නිවැරදි කළා
import Bookingpage from '../Pages/Bookingpage.jsx'; // Path එක නිවැරදි කළා

const AppRoutes = () => {
    return (
        <Routes>
            {/* මුල් පිටුව (Home) */}
            <Route path="/" element={<Home />} />

            {/* Booking පිටුව */}
            <Route path="/booking" element={<Bookingpage />} />
        </Routes>
    );
};

export default AppRoutes;