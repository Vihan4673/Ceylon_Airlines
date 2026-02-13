import DestinationCard from "./DestinationCard";

const destinations = [
    {
        name: "Ella, Sri Lanka",
        price: "LKR 12,500",
        image:
            "https://images.unsplash.com/photo-1546708973-b339540b5162",
    },
    {
        name: "London, UK",
        price: "LKR 285,000",
        image:
            "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad",
    },
];

const Destinations = () => {
    return (
        <section className="py-24 max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16">
                Popular Destinations
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
                {destinations.map((d, i) => (
                    <DestinationCard key={i} dest={d} />
                ))}
            </div>
        </section>
    );
};

export default Destinations;
