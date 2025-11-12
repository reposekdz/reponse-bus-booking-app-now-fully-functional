
import React from 'react';
import { TagIcon, ArrowRightIcon } from './icons';

const offers = [
    {
        title: "Weekend Getaway Discount",
        company: "Volcano Express",
        description: "Get 10% off on all round-trip tickets booked for Saturday & Sunday travel.",
        code: "WEEKEND10",
        bgGradient: "from-yellow-400 to-orange-500"
    },
    {
        title: "Student Special",
        company: "RITCO",
        description: "Show your student ID and get a 15% discount on any route, any day.",
        code: "STUDENT15",
        bgGradient: "from-blue-400 to-indigo-500"
    },
    {
        title: "Early Bird Bonus",
        company: "Horizon Express",
        description: "Book your ticket more than 7 days in advance and enjoy a 5% discount on your fare.",
        code: "EARLYBIRD5",
        bgGradient: "from-green-400 to-teal-500"
    }
];

const SpecialOffers = ({ onSearch }) => {
    return (
        <section>
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl">Special Offers & Promotions</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                        Save on your next journey with our exclusive deals from top companies.
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {offers.map((offer, index) => (
                        <div key={index} className={`relative rounded-2xl shadow-xl overflow-hidden text-white p-8 flex flex-col justify-between h-72 group bg-gradient-to-br ${offer.bgGradient}`}>
                             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                             <div className="relative z-10">
                                 <div className="flex items-center space-x-2 mb-2 opacity-80">
                                     <TagIcon className="w-5 h-5"/>
                                     <p className="font-bold">{offer.company}</p>
                                 </div>
                                 <h3 className="text-3xl font-bold leading-tight">{offer.title}</h3>
                             </div>
                             <div className="relative z-10">
                                 <p className="text-sm opacity-90 mb-4">{offer.description}</p>
                                 <button onClick={() => onSearch()} className="w-full flex items-center justify-center px-5 py-3 rounded-lg bg-white/20 backdrop-blur-sm font-bold hover:bg-white/30 transition-colors duration-300 transform group-hover:scale-105">
                                    Book a Trip <ArrowRightIcon className="w-5 h-5 ml-2"/>
                                 </button>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SpecialOffers;
