import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Destinations from "../components/Destinations";
import Experience from "../components/Experience";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <div className="bg-slate-50 text-slate-900">
            <Navbar />
            <Hero />
            <Destinations />
            <Experience />
            <Footer />
        </div>
    );
};

export default Home;
