import React from 'react';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from './components/icons';

const ContactPage: React.FC = () => {
  return (
    <div className="py-16 sm:py-24 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Twandikire</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                Twishimira kumva icyo udutekerezaho! Niba ufite ikibazo, igitekerezo, cyangwa icyifuzo, itsinda ryacu ryiteguye kugusubiza.
            </p>
        </div>
        
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800/50 rounded-xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Amakuru Rusange</h2>
                    <div className="space-y-4 text-gray-600 dark:text-gray-300">
                        <div className="flex items-start">
                            <MapPinIcon className="w-6 h-6 text-blue-500 mr-4 mt-1 flex-shrink-0" />
                            <span>KN 4 Ave, Kiyovu, Kigali, Rwanda</span>
                        </div>
                        <div className="flex items-center">
                            <PhoneIcon className="w-6 h-6 text-blue-500 mr-4" />
                            <span>+250 788 123 456</span>
                        </div>
                        <div className="flex items-center">
                            <EnvelopeIcon className="w-6 h-6 text-blue-500 mr-4" />
                            <span>contact@rwandabus.rw</span>
                        </div>
                    </div>
                </div>
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                    <img src="https://www.africa-expert.com/wp-content/uploads/2018/12/kigali-city-rwanda.jpg" alt="Map of Kigali" className="w-full h-full object-cover opacity-30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition">Fungura mu Ikarita</button>
                    </div>
                </div>
            </div>
             <div className="p-8 md:p-12 bg-gray-50 dark:bg-gray-800">
                 <form className="space-y-6">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Amazina Yuzuye</label>
                        <input type="text" id="name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label htmlFor="email-contact" className="text-sm font-medium text-gray-700 dark:text-gray-300">Imeri</label>
                        <input type="email" id="email-contact" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">Ubutumwa</label>
                        <textarea id="message" rows={5} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600"></textarea>
                    </div>
                    <div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-[#0033A0] bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-300">
                            Ohereza Ubutumwa
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;