
import React, { useState } from 'react';
import { Page } from './types';
import { LockClosedIcon } from './components/icons';
import { useLanguage } from './contexts/LanguageContext';
import * as api from './services/apiService';

interface ResetPasswordPageProps {
  onNavigate: (page: Page) => void;
  token: string;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigate, token }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
    }
    setIsLoading(true);
    setError('');

    try {
        await api.resetPassword(token, password);
        alert('Password reset successfully! Please login.');
        onNavigate('login');
    } catch (err: any) {
        setError(err.message || 'Failed to reset password.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Set New Password</h2>
        
        {error && <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="New Password"
                    minLength={8}
                />
            </div>
             <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    type="password" 
                    required 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm Password"
                />
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 disabled:opacity-50">
                {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
