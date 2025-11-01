import React from 'react';
import type { Page } from '../App';

interface PartnerCompaniesProps {
    navigate: (page: Page, data?: any) => void;
}

const partners = [
  { id: 'ritco', name: 'RITCO', logoText: 'RITCO', slogan: 'Urugendo Rwiza' },
  { id: 'volcano', name: 'VOLCANO EXPRESS', logoText: 'VOLCANO', slogan: 'The People\'s Choice' },
  { id: 'horizon', name: 'HORIZON EXPRESS', logoText: 'HORIZON', slogan: 'Comfort and Safety' },
  { id: 'trinity', name: 'TRINITY EXPRESS', logoText: 'TRINITY', slogan: 'Connecting Rwanda' },
  { id: 'international', name: 'INTERNATIONAL EXPRESS', logoText: 'INTL', slogan: 'Your Travel Partner' },
  { id: 'stellart', name: 'STELLART', logoText: 'STELLART', slogan: 'Excellence in Motion' },
  { id: 'select', name: 'SELECT', logoText: 'SELECT', slogan: 'Ride with Class' },
  { id: 'onatra', name: 'ONATRACOM', logoText: 'ONATRA', slogan: 'The Classic Ride' }
];

const PartnerCard: React.FC<{ partner: typeof partners[0]; onSelect: () => void }> = ({ partner, onSelect }) => (
    <button onClick={onSelect} className="group perspective">
        <div className="relative w-full h-40 preserve-3d group-hover:-translate-y-2 transition-transform duration-500 ease-in-out">
            <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center p-4 border dark:border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 shadow-inner">
                    <h3 className="text-2xl font-extrabold tracking-widest text-white uppercase">{partner.logoText}</h3>
                </div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mt-3">{partner.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{partner.slogan}</p>
            </div>
            <div className="absolute inset-0 bg-yellow-400 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-4 translate-y-4 rotate-6 -z-10"></div>
        </div>
    </button>
);


const PartnerCompanies: React.FC<PartnerCompaniesProps> = ({ navigate }) => {
  return (
    <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl">Ibigo by'Ingendo Dukorana</h2>
           <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Kanda ku kigo kugira ngo umenye byinshi ku ngendo zacyo n'imodoka zikoreshwa.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {partners.map(partner => (
            <PartnerCard key={partner.name} partner={partner} onSelect={() => navigate('companyProfile', partner)} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerCompanies;