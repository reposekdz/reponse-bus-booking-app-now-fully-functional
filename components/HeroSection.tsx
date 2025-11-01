import React from 'react';
import SearchForm from './SearchForm';

interface HeroSectionProps {
  onSearch: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center text-white">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2048&auto=format&fit=crop')" }}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-green-900/40 z-10"></div>
      <div className="relative z-20 container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-shadow-lg tracking-tight">Tembera u Rwanda</h1>
        <p className="text-lg md:text-xl font-light mb-8 max-w-2xl mx-auto">
          Kata itike ya bisi mu buryo bworoshye kandi bwizewe. Urugendo rwawe ruhebuje rutangirira hano.
        </p>
        <div className="bg-gradient-to-br from-white/20 to-white/0 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto border border-white/20">
           <SearchForm onSearch={onSearch} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;