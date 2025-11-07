import React, { useState } from 'react';
import type { Page } from './App';
import { EyeIcon, EyeOffIcon, LockClosedIcon, GoogleIcon, FacebookIcon } from './components/icons';

interface RegisterPageProps {
  onNavigate: (page: Page) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (referralCode.trim()) {
        alert("Welcome! You and your friend have received 500 bonus GoPoints!");
    } else {
        alert("Registration successful!");
    }
    // In a real app, you would navigate after successful registration
    // onNavigate('login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="relative flex flex-col md:flex-row w-full max-w-4xl bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1605641793224-6512a8d8363b?q=80&w=1974&auto=format&fit=crop')"}}>
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Fungura Konti</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Tangira urugendo rwawe natwe uyu munsi.</p>
          
          <form className="space-y-6" onSubmit={handleRegister}>
            <div className="relative">
                <label htmlFor="full-name" className="sr-only">Amazina Yuzuye</label>
                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                </span>
                <input id="full-name" name="name" type="text" required className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition" placeholder="Amazina Yuzuye" />
            </div>
            <div className="relative">
                <label htmlFor="email-address-reg" className="sr-only">Imeri</label>
                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                </span>
                <input id="email-address-reg" name="email" type="email" required className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition" placeholder="Imeri" />
            </div>
            <div className="relative">
              <label htmlFor="password-reg" className="sr-only">Ijambobanga</label>
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </span>
              <input id="password-reg" name="password" type={showPassword ? 'text' : 'password'} required className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition" placeholder="Ijambobanga" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 dark:text-gray-400">
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
             <div className="relative">
                <label htmlFor="referral-code" className="sr-only">Referral Code</label>
                <input id="referral-code" name="referral" type="text" value={referralCode} onChange={e => setReferralCode(e.target.value)} className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition" placeholder="Referral Code (Optional)" />
            </div>
            <div>
              <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-[#0033A0] bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-300 shadow-lg">
                Iyandikishe
              </button>
            </div>
          </form>
          <div className="my-6 flex items-center justify-center">
            <span className="w-full border-t dark:border-gray-600"></span>
            <span className="px-2 text-xs uppercase text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 -mt-0.5">Cyangwa</span>
            <span className="w-full border-t dark:border-gray-600"></span>
          </div>
           <div className="flex space-x-4">
              <button className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                  <GoogleIcon className="w-5 h-5 mr-2" /> Iyandikishe na Google
              </button>
          </div>
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Usanzwe ufite konti?{' '}
            <button onClick={() => onNavigate('login')} className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
              Injira
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;