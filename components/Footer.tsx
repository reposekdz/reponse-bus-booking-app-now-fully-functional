
import React, { useState } from 'react';
import { FacebookIcon, TwitterIcon, LinkedinIcon, PaperAirplaneIcon, PhoneIcon, EnvelopeIcon, MapPinIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} className="text-gray-400 hover:text-yellow-400 hover:pl-2 transition-all duration-300 block mb-2 text-sm">
    {children}
  </a>
);

const FooterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="flex flex-col">
    <h4 className="font-bold text-lg mb-6 text-white relative pb-2">
      {title}
      <span className="absolute bottom-0 left-0 w-12 h-1 bg-yellow-400 rounded-full"></span>
    </h4>
    {children}
  </div>
);

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate API call
    setTimeout(() => {
      showToast('Successfully subscribed to newsletter!', 'success');
      setEmail('');
    }, 800);
  };

  return (
    <footer className="bg-[#0F172A] text-white pt-16 pb-8 relative overflow-hidden border-t border-gray-800">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Newsletter */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-2xl font-extrabold">
              <span>Go<span className="text-yellow-400">Bus</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revolutionizing travel across Rwanda. Seamless bookings, premium service, and nationwide coverage for every passenger.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className="w-full bg-gray-800 text-white pl-4 pr-12 py-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none border border-gray-700 transition-all"
                required
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-yellow-400 text-blue-900 rounded-md hover:bg-yellow-300 transition-colors">
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Company Links */}
          <FooterSection title={t('footer_about')}>
            <FooterLink href="#">About GoBus</FooterLink>
            <FooterLink href="#">Our Partners</FooterLink>
            <FooterLink href="#">Careers & Jobs</FooterLink>
            <FooterLink href="#">Press & Media</FooterLink>
            <FooterLink href="#">Sustainability</FooterLink>
          </FooterSection>

          {/* Services & Routes */}
          <FooterSection title="Top Routes">
            <FooterLink href="#">Kigali - Rubavu</FooterLink>
            <FooterLink href="#">Kigali - Musanze</FooterLink>
            <FooterLink href="#">Kigali - Huye</FooterLink>
            <FooterLink href="#">Kigali - Rusizi</FooterLink>
            <FooterLink href="#">Kigali - Nyagatare</FooterLink>
          </FooterSection>

          {/* Contact & Support */}
          <FooterSection title={t('footer_help')}>
            <div className="space-y-4 text-gray-400 text-sm">
              <p className="flex items-start">
                <MapPinIcon className="w-5 h-5 mr-3 text-blue-500 shrink-0 mt-0.5"/>
                KN 4 Ave, Kigali, Rwanda<br/>Centenary House, 4th Floor
              </p>
              <p className="flex items-center">
                <PhoneIcon className="w-5 h-5 mr-3 text-blue-500 shrink-0"/>
                +250 788 123 456
              </p>
              <p className="flex items-center">
                <EnvelopeIcon className="w-5 h-5 mr-3 text-blue-500 shrink-0"/>
                support@gobus.rw
              </p>
            </div>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors"><FacebookIcon className="h-5 w-5" /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-400 transition-colors"><TwitterIcon className="h-5 w-5" /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-700 transition-colors"><LinkedinIcon className="h-5 w-5" /></a>
            </div>
          </FooterSection>
        </div>

        {/* App Download & Legal */}
        <div className="border-t border-gray-800 pt-8 flex flex-col lg:flex-row justify-between items-center gap-6">
           <div className="flex items-center space-x-4">
              <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded-lg flex items-center transition-all">
                 <span className="text-2xl mr-2">🍎</span>
                 <div className="text-left">
                    <p className="text-[10px] uppercase text-gray-400">Download on the</p>
                    <p className="text-sm font-bold leading-none">App Store</p>
                 </div>
              </button>
               <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded-lg flex items-center transition-all">
                 <span className="text-2xl mr-2">🤖</span>
                 <div className="text-left">
                    <p className="text-[10px] uppercase text-gray-400">Get it on</p>
                    <p className="text-sm font-bold leading-none">Google Play</p>
                 </div>
              </button>
           </div>
           
           <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">{t('footer_legal_terms')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('footer_legal_privacy')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('footer_legal_cookies')}</a>
              <span className="opacity-50">&copy; {new Date().getFullYear()} GoBus Rwanda.</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
