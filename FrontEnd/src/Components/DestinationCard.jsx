const DestinationCard = ({ dest }) => {
    return (
        <div className="bg-white rounded-3xl shadow hover:shadow-xl transition">
            <img
                src={dest.image}
                className="h-72 w-full object-cover rounded-t-3xl"
            />

            <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{dest.name}</h3>
                <p className="text-blue-600 font-bold">{dest.price}</p>
            </div>
        </div>
    );
};

export default DestinationCard;
