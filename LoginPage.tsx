
import React, { useState } from 'react';
import { Page } from './types';
import { EyeIcon, EyeOffIcon, GoogleIcon } from './components/icons';
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';

interface LoginPageProps {
  onNavigate: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, isLoading } = useAuth();
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      try {
          await login({ email: emailOrPhone, password });
          // The App component will handle navigation based on the user's role
      } catch (err: any) {
          setError(err.message || t('login_error_credentials'));
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="relative flex flex-col md:flex-row w-full max-w-4xl bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2048&auto=format&fit=crop')"}}>
          <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[2px]"></div>
          <div className="absolute bottom-10 left-10 right-10 text-white">
             <h3 className="text-2xl font-bold mb-2">Welcome back to GoBus</h3>
             <p className="text-sm opacity-90">Your journey across Rwanda starts here.</p>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('login_title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{t('login_subtitle')}</p>
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="relative">
              <label htmlFor="email-address" className="sr-only">{t('login_email_label')}</label>
              <input id="email-address" name="email" type="text" autoComplete="email" required 
                className="w-full pl-4 pr-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                placeholder={t('login_email_or_phone_placeholder')}
                value={emailOrPhone}
                onChange={e => setEmailOrPhone(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">{t('login_password_label')}</label>
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required 
                className="w-full pl-4 pr-10 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                placeholder={t('login_password_placeholder')}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 dark:text-gray-400">
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>

             {error && <p className="text-red-500 text-sm font-semibold bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</p>}
            <div>
              <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg disabled:opacity-50">
                {isLoading ? t('login_button_loading') : t('login_button_main')}
              </button>
            </div>
          </form>
          <div className="my-6 flex items-center justify-center">
            <span className="w-full border-t dark:border-gray-600"></span>
            <span className="px-2 text-xs uppercase text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 -mt-0.5">{t('login_or_divider')}</span>
            <span className="w-full border-t dark:border-gray-600"></span>
          </div>
          <div className="flex space-x-4">
            <button className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition">
              <GoogleIcon className="w-5 h-5 mr-2" /> {t('login_google_button')}
            </button>
          </div>
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('login_no_account_prompt')}{' '}
            <button onClick={() => onNavigate('register')} className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
              {t('login_register_link')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
