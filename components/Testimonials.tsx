import React from 'react';
import StarRating from './StarRating';

const testimonials = [
    { name: 'Grace M.', location: 'Kigali', rating: 5, text: "The booking process was incredibly smooth and fast. I got my e-ticket in seconds. Highly recommend Rwanda Bus for anyone traveling!", avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { name: 'David G.', location: 'Rubavu', rating: 5, text: "I use this platform for all my business trips to Kigali. It's reliable, and I love being able to choose my seat in advance. A game-changer!", avatar: 'https://randomuser.me/api/portraits/men/36.jpg' },
    { name: 'Aline U.', location: 'Musanze', rating: 4, text: "The package delivery service is surprisingly efficient. My parcel arrived on the same day. The tracking feature is also very helpful.", avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
];

const TestimonialCard = ({ testimonial }) => (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg h-full flex flex-col">
        <div className="flex-grow">
            <StarRating rating={testimonial.rating} />
            <p className="mt-4 text-gray-600 dark:text-gray-300 italic">"{testimonial.text}"</p>
        </div>
        <div className="flex items-center mt-6">
            <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover"/>
            <div className="ml-4">
                <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</p>
            </div>
        </div>
    </div>
);

const Testimonials = () => {
    return (
        <section>
            <div className="container mx-auto px-6">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl">What Our Passengers Say</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                        We're proud to connect thousands of people across Rwanda every day.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map(t => (
                        <TestimonialCard key={t.name} testimonial={t} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;