
import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, XIcon, QuestionMarkCircleIcon } from './icons';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };
  
  const Icon = {
      success: CheckCircleIcon,
      error: XCircleIcon,
      info: QuestionMarkCircleIcon
  }[type];

  return (
    <div className={`fixed top-4 right-4 z-[100] ${styles[type]} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-4 animate-fade-in-down min-w-[300px] transform transition-all duration-300 hover:scale-105 cursor-pointer`} onClick={onClose}>
      <Icon className="w-6 h-6" />
      <p className="flex-1 font-medium">{message}</p>
      <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="hover:bg-white/20 p-1 rounded-full">
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
