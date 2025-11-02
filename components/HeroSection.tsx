import React, { useState } from 'react';
import SearchForm from './SearchForm';
import AITripPlanner from './AITripPlanner';
import { SparklesIcon } from './icons';

interface HeroSectionProps {
  onSearch: (from?: string, to?: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [showAiPlanner, setShowAiPlanner] = useState(false);

  return (
    <>
      <section className="relative h-screen min-h-[700px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2048&auto=format&fit=crop')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-green-900/40 z-10"></div>
        <div className="relative z-20 container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-shadow-lg tracking-tight">Tegura Urugendo Rwawe Kare Muburyo Bworoshye</h1>
          <p className="text-lg md:text-xl font-light mb-8 max-w-2xl mx-auto">
            Kata itike ya bisi mu buryo bworoshye kandi bwizewe. Urugendo rwawe ruhebuje rutangirira hano.
          </p>
          <div className="bg-gradient-to-br from-white/20 to-white/0 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto border border-white/20">
            <SearchForm onSearch={onSearch} />
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onSearch()}
              className="px-8 py-3 rounded-full bg-transparent border-2 border-yellow-300 text-yellow-300 font-bold text-lg hover:bg-yellow-300 hover:text-[#0033A0] transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Kata Itike Nonaha
            </button>
             <button 
              onClick={() => setShowAiPlanner(true)}
              className="flex items-center px-6 py-3 rounded-full bg-white/10 border-2 border-transparent text-white font-bold text-lg hover:bg-white/20 transform hover:scale-105 transition-all duration-300 shadow-lg backdrop-blur-sm"
            >
              <SparklesIcon className="w-6 h-6 mr-2 text-yellow-300" />
              Tegura Urugendo na AI
            </button>
          </div>
        </div>
      </section>
      {showAiPlanner && <AITripPlanner onClose={() => setShowAiPlanner(false)} onPlanTrip={onSearch} />}
    </>
  );
};

export default HeroSection;