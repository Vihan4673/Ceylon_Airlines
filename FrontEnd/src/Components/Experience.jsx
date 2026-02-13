import { Plane, Users, Sparkles } from "lucide-react";

const Experience = () => {
    return (
        <section className="bg-blue-900 text-white py-24">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold mb-12">
                    The Ceylon Experience
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <Plane size={40} className="mx-auto mb-4" />
                        <h3 className="font-bold mb-2">Smart Fleet</h3>
                    </div>

                    <div>
                        <Users size={40} className="mx-auto mb-4" />
                        <h3 className="font-bold mb-2">Island Hospitality</h3>
                    </div>

                    <div>
                        <Sparkles size={40} className="mx-auto mb-4" />
                        <h3 className="font-bold mb-2">AI Travel Guide</h3>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
