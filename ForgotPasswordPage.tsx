
import React, { useState } from 'react';
import { Page } from './types';
import { EnvelopeIcon } from './components/icons';
import { useLanguage } from './contexts/LanguageContext';
import * as api from './services/apiService';

interface ForgotPasswordPageProps {
  onNavigate: (page: Page) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
        const res = await api.forgotPassword(email);
        setMessage(`Password reset link sent! (Debug Link: /reset-password/${res.debugToken})`);
    } catch (err: any) {
        setError(err.message || 'Failed to send reset link.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Enter your email to receive a reset link.</p>
        
        {message && <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm break-all">{message}</div>}
        {error && <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                />
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 disabled:opacity-50">
                {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
        </form>
        <button onClick={() => onNavigate('login')} className="mt-4 w-full text-center text-sm text-blue-600 hover:underline">
            Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
