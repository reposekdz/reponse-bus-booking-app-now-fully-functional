import React from 'react';
import { SparklesIcon, TagIcon, ShieldCheckIcon, PhoneIcon } from './icons';

const features = [
    {
        icon: SparklesIcon,
        title: "Seamless Booking",
        description: "Book your trip in just a few clicks with our intuitive and fast interface."
    },
    {
        icon: TagIcon,
        title: "Best Prices Guaranteed",
        description: "We work with top companies to bring you the most competitive fares."
    },
    {
        icon: ShieldCheckIcon,
        title: "Safe & Secure Travel",
        description: "Travel with peace of mind. All our partners are vetted for safety and quality."
    },
    {
        icon: PhoneIcon,
        title: "24/7 Customer Support",
        description: "Our dedicated support team is always available to help you with any issues."
    }
];

const WhyChooseUs = () => {
    return (
        <section>
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl">Why Travel With RwandaBus?</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">Your journey, simplified and secured.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="group p-8 rounded-2xl bg-white dark:bg-gray-800/80 shadow-lg border border-gray-200 dark:border-gray-700/50 hover:border-blue-400/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-green-400 text-white mb-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
                                <feature.icon className="w-8 h-8"/>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
