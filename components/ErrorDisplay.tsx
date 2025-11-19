import React from 'react';
import { XCircleIcon, ArrowPathIcon } from './icons';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry, className }) => {
  if (!message) return null;

  return (
    <div className={`bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-r-lg shadow-md flex items-center justify-between ${className}`}>
      <div className="flex items-center">
        <XCircleIcon className="w-6 h-6 mr-3" />
        <div>
          <p className="font-bold">Error</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="flex items-center px-3 py-1 border border-red-300 dark:border-red-600 rounded-full text-sm font-semibold hover:bg-red-200 dark:hover:bg-red-800/50 transition">
          <ArrowPathIcon className="w-4 h-4 mr-1.5" />
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;