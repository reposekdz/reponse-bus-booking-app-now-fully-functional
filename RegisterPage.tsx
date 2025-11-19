
import React, { useState } from 'react';
import { Page } from './types';
import { EyeIcon, EyeOffIcon, LockClosedIcon, GoogleIcon, UserCircleIcon, PhoneIcon, EnvelopeIcon } from './components/icons';
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';

interface RegisterPageProps {
  onNavigate: (page: Page) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError(t('register_error_password_mismatch'));
      return;
    }
    if (formData.password.length < 6) {
        setError(t('register_error_password_length'));
        return;
    }
    try {
        await register(formData);
        onNavigate('registrationSuccess'); // Navigate to success page
    } catch(err: any) {
        setError(err.message || t('register_error_generic'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="relative flex flex-col md:flex-row w-full max-w-4xl bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1605641793224-6512a8g8363b?q=80&w=1974&auto=format&fit=crop')"}}>
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('register_title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{t('register_subtitle')}</p>
          
          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="relative">
              <UserCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input name="name" type="text" required onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition" placeholder={t('register_name_placeholder')} />
            </div>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input name="email" type="email" required onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition" placeholder={t('register_email_placeholder')} />
            </div>
             <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input name="phone" type="tel" required onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition" placeholder={t('register_phone_placeholder')} />
            </div>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input name="password" type={showPassword ? 'text' : 'password'} required onChange={handleChange} className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition" placeholder={t('register_password_placeholder')} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 dark:text-gray-400">
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
             <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required onChange={handleChange} className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition" placeholder={t('register_confirm_password_placeholder')} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 dark:text-gray-400">
                {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
            <div>
              <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-[#0033A0] bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-300 shadow-lg disabled:opacity-50">
                {isLoading ? t('register_button_loading') : t('register_button_main')}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('register_have_account_prompt')}{' '}
            <button onClick={() => onNavigate('login')} className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
              {t('register_login_link')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
