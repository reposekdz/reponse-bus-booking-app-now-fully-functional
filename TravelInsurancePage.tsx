import React, { useState } from 'react';
import { Page } from './App';
import { ShieldCheckIcon } from './components/icons';
import * as api from './services/apiService';

const TravelInsurancePage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            await api.submitContactMessage({
                name: data.name as string,
                email: data.email as string,
                subject: `Travel Insurance Quote Request`,
                message: `A customer has requested a travel insurance quote with the following details:\nTravelers: ${data.travelers}\nStart Date: ${data.start_date}\nEnd Date: ${data.end_date}\n\nContact them at ${data.email}.`
            });
            setSubmitted(true);
        } catch (error) {
            alert(`Failed to submit inquiry: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-100/50 dark:bg-gray-900/50 min-h-screen py-12">
            <div className="container mx-auto px-6 max-w-2xl">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl">
                    <div className="text-center">
                        <ShieldCheckIcon className="w-12 h-12 mx-auto text-green-500 mb-4" />
                        <h1 className="text-3xl font-bold dark:text-white">Travel with Peace of Mind</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Get an instant quote for your travel insurance.</p>
                    </div>
                    
                    {submitted ? (
                        <div className="text-center p-8">
                             <h2 className="text-xl font-semibold text-green-600">Inquiry Sent!</h2>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">Thank you! Our insurance partner will contact you shortly with a quote.</p>
                             <button onClick={() => onNavigate('services')} className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Back to Services</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
                            <div><label className="block text-sm font-medium">Your Name</label><input type="text" name="name" className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700" required /></div>
                            <div><label className="block text-sm font-medium">Your Email</label><input type="email" name="email" className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700" required /></div>
                            <div><label className="block text-sm font-medium">Number of Travelers</label><input type="number" name="travelers" defaultValue="1" className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700" required /></div>
                            <div><label className="block text-sm font-medium">Trip Start Date</label><input type="date" name="start_date" className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700" required /></div>
                            <div><label className="block text-sm font-medium">Trip End Date</label><input type="date" name="end_date" className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700" required /></div>
                            <div className="flex justify-end pt-4"><button type="submit" disabled={isLoading} className="px-6 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg disabled:opacity-50">{isLoading ? 'Submitting...' : 'Request Quote'}</button></div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TravelInsurancePage;