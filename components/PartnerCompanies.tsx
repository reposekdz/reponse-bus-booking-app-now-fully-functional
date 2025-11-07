import React from 'react';
import type { Page } from '../App';
import StarRating from './StarRating';
import { ArrowRightIcon } from './icons';

interface OurPartnersProps {
    navigate: (page: Page, data?: any) => void;
}

const partners = [
  { id: 'volcano', name: 'Volcano Express', logoText: 'VOLCANO', rating: 4.8, reviews: 250, bgImage: 'https://images.unsplash.com/photo-1593256398246-8853b3815c32?q=80&w=2070&auto=format&fit=crop' },
  { id: 'ritco', name: 'RITCO', logoText: 'RITCO', rating: 4.5, reviews: 120, bgImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2048&auto=format&fit=crop' },
  { id: 'horizon', name: 'Horizon Express', logoText: 'HORIZON', rating: 4.2, reviews: 98, bgImage: 'https://images.unsplash.com/photo-1605641793224-6512a_d8363b?q=80&w=1974&auto=format&fit=crop' },
  { id: 'stellart', name: 'STELLART', logoText: 'STELLART', rating: 4.6, reviews: 150, bgImage: 'https://images.unsplash.com/photo-1616372819235-9b2e1577a2d4?q=80&w=2070&auto=format&fit=crop' },
];

const PartnerCard: React.FC<{ partner: typeof partners[0]; onSelect: () => void }> = ({ partner, onSelect }) => (
    <button 
        onClick={onSelect} 
        className="group relative block w-full h-80 rounded-2xl overflow-hidden shadow-2xl perspective"
        style={{ transformStyle: 'preserve-3d' }}
    >
        <div className="absolute inset-0 transform-gpu transition-transform duration-500 ease-out group-hover:scale-110">
            <img src={partner.bgImage} alt={partner.name} className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        
        <div 
            className="absolute inset-0 p-6 flex flex-col justify-end transform-gpu transition-transform duration-500 ease-out group-hover:[transform:translateZ(40px)]"
            style={{ transformStyle: 'preserve-3d' }}
        >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 mb-4">
                <h3 className="text-xl font-extrabold tracking-widest text-white uppercase">{partner.logoText}</h3>
            </div>
            <h4 className="text-2xl font-bold text-white" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>{partner.name}</h4>
            <div className="flex items-center mt-2 space-x-2">
                <StarRating rating={partner.rating} />
                <span className="text-sm text-gray-300">({partner.reviews} reviews)</span>
            </div>
            
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRightIcon className="w-8 h-8 text-white bg-white/20 p-1.5 rounded-full" />
            </div>
        </div>
    </button>
);


const OurPartners: React.FC<OurPartnersProps> = ({ navigate }) => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl">Our Trusted Partners</h2>
           <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Click a company to learn more about their routes and fleet.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {partners.map(partner => (
            <PartnerCard key={partner.name} partner={partner} onSelect={() => navigate('companyProfile', partner)} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPartners;