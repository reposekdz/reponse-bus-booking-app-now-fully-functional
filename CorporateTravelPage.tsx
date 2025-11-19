import React, { useState } from 'react';
import { Page } from './App';
import { BriefcaseIcon } from './components/icons';
import * as api from './services/apiService';

const CorporateTravelPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const companyName = formData.get('company_name') as string;
        const contactPerson = formData.get('contact_person') as string;
        const contactEmail = formData.get('contact_email') as string;

        try {
            await api.submitContactMessage({
                name: contactPerson,
                email: contactEmail,
                subject: `Corporate Travel Inquiry: ${companyName}`,
                message: `Company: ${companyName}\nContact: ${contactPerson}\nEmail: ${contactEmail}\n\nPlease contact us about setting up a corporate account.`
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
                        <BriefcaseIcon className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                        <h1 className="text-3xl font-bold dark:text-white">Corporate Travel Solutions</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Simplify your business travel with a corporate account.</p>
                    </div>
                    
                    {submitted ? (
                        <div className="text-center p-8">
                            <h2 className="text-xl font-semibold text-green-600">Inquiry Sent!</h2>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">Thank you! Our corporate team will get in touch with you within 2 business days.</p>
                             <button onClick={() => onNavigate('services')} className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Back to Services</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Fill out the form below to get started.</p>
                            <div><label className="block text-sm font-medium">Company Name</label><input type="text" name="company_name" className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700" required /></div>
                            <div><label className="block text-sm font-medium">Contact Person</label><input type="text" name="contact_person" className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700" required /></div>
                            <div><label className="block text-sm font-medium">Contact Email</label><input type="email" name="contact_email" className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700" required /></div>
                            <div className="flex justify-end pt-4"><button type="submit" disabled={isLoading} className="px-6 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg disabled:opacity-50">{isLoading ? 'Submitting...' : 'Submit Inquiry'}</button></div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CorporateTravelPage;