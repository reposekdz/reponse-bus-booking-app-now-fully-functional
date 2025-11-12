import React, { useState } from 'react';
import type { Page } from './App';
import { EyeIcon, EyeOffIcon, LockClosedIcon, GoogleIcon } from './components/icons';
import { useAuth } from './contexts/AuthContext';

interface LoginPageProps {
  onNavigate: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('passenger@gobus.rw');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const { login, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      try {
          await login({ email, password });
          // The App component will handle navigation based on the user's role
      } catch (err) {
          setError(err.message || 'Login failed. Please check your credentials.');
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="relative flex flex-col md:flex-row w-full max-w-4xl bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2048&auto=format&fit=crop')"}}>
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ikaze!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Injira muri konti yawe kugirango ukomeze.</p>
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="relative">
              <label htmlFor="email-address" className="sr-only">Imeri</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required 
                className="w-full pl-4 pr-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition" 
                placeholder="Imeri" 
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Ijambobanga</label>
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required 
                className="w-full pl-4 pr-10 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition" 
                placeholder="Ijambobanga" 
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 dark:text-gray-400">
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
             <p className="text-xs text-gray-400">Demo Emails: passenger@gobus.rw, company@gobus.rw, driver1@gobus.rw, admin@gobus.rw (password: "password")</p>
             {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
            <div>
              <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-[#0033A0] bg-gradient-to-r from-yellow-400 to-yellow-500 hover:saturate-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-300 shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50">
                {isLoading ? 'Logging in...' : 'Injira'}
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
              <GoogleIcon className="w-5 h-5 mr-2" /> Injira na Google
            </button>
          </div>
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Nta konti ufite?{' '}
            <button onClick={() => onNavigate('register')} className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
              Iyandikishe
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
