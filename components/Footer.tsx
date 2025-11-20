
import React, { useState } from 'react';
import { FacebookIcon, TwitterIcon, LinkedinIcon, PaperAirplaneIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, GoBusLogo, AppStoreIcon, GooglePlayIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} className="text-gray-400 hover:text-[#FCE300] hover:pl-2 transition-all duration-300 block mb-2 text-sm">
    {children}
  </a>
);

const FooterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="flex flex-col">
    <h4 className="font-bold text-lg mb-6 text-white relative pb-2 inline-block">
      {title}
      <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-[#00A3E0] to-[#20603D] rounded-full"></span>
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
    <footer className="bg-[#1e1e24] text-white relative overflow-hidden">
      {/* Premium Top Border Gradient (Rwanda Colors: Blue, Yellow, Green) */}
      <div className="h-2 w-full bg-gradient-to-r from-[#00A3E0] via-[#FCE300] to-[#20603D]"></div>

      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00A3E0]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#20603D]/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-6 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Newsletter */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
              <GoBusLogo className="w-8 h-8" />
              <span>Go<span className="text-[#FCE300]">Bus</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revolutionizing travel across Rwanda. Experience the premium standard of bus booking with real-time tracking and secure payments.
            </p>
            <form onSubmit={handleSubscribe} className="relative group">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className="w-full bg-gray-800/50 text-white pl-4 pr-12 py-3 rounded-lg focus:ring-2 focus:ring-[#00A3E0] outline-none border border-gray-700 transition-all group-hover:border-gray-600"
                required
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#FCE300] text-blue-900 rounded-md hover:bg-yellow-400 transition-colors shadow-lg">
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
              <p className="flex items-start group">
                <MapPinIcon className="w-5 h-5 mr-3 text-[#00A3E0] shrink-0 mt-0.5 group-hover:animate-bounce"/>
                KN 4 Ave, Kigali, Rwanda<br/>Centenary House, 4th Floor
              </p>
              <p className="flex items-center group">
                <PhoneIcon className="w-5 h-5 mr-3 text-[#00A3E0] shrink-0"/>
                <span className="group-hover:text-white transition-colors">+250 788 123 456</span>
              </p>
              <p className="flex items-center group">
                <EnvelopeIcon className="w-5 h-5 mr-3 text-[#00A3E0] shrink-0"/>
                <span className="group-hover:text-white transition-colors">support@gobus.rw</span>
              </p>
            </div>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#1877F2] hover:text-white transition-colors text-gray-400"><FacebookIcon className="h-5 w-5" /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#1DA1F2] hover:text-white transition-colors text-gray-400"><TwitterIcon className="h-5 w-5" /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#0A66C2] hover:text-white transition-colors text-gray-400"><LinkedinIcon className="h-5 w-5" /></a>
            </div>
          </FooterSection>
        </div>

        {/* App Download & Legal */}
        <div className="border-t border-gray-800 pt-8 flex flex-col lg:flex-row justify-between items-center gap-6">
           <div className="flex items-center space-x-4">
              <button className="bg-black hover:bg-gray-900 border border-gray-700 px-4 py-2 rounded-xl flex items-center transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                 <AppStoreIcon className="w-6 h-6 mr-2 text-white"/>
                 <div className="text-left">
                    <p className="text-[10px] uppercase text-gray-400">Download on the</p>
                    <p className="text-sm font-bold leading-none">App Store</p>
                 </div>
              </button>
               <button className="bg-black hover:bg-gray-900 border border-gray-700 px-4 py-2 rounded-xl flex items-center transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                 <GooglePlayIcon className="w-6 h-6 mr-2 text-white"/>
                 <div className="text-left">
                    <p className="text-[10px] uppercase text-gray-400">Get it on</p>
                    <p className="text-sm font-bold leading-none">Google Play</p>
                 </div>
              </button>
           </div>
           
           <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
              <a href="#" className="hover:text-white transition-colors">{t('footer_legal_terms')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('footer_legal_privacy')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('footer_legal_cookies')}</a>
              <span className="opacity-50">&copy; {new Date().getFullYear()} GoBus Rwanda. All rights reserved.</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
