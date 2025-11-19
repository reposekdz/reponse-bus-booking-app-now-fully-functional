
import React, { useState } from 'react';
import Modal from './Modal';
import { PhoneIcon } from './icons';

interface WalletTopUpModalProps {
    onClose: () => void;
    onSuccess: (amount: number) => void;
    userPin: string;
}

const WalletTopUpModal: React.FC<WalletTopUpModalProps> = ({ onClose, onSuccess }) => {
    const [amount, setAmount] = useState('10000');
    const [customAmount, setCustomAmount] = useState('');
    const [phone, setPhone] = useState('');
    const [step, setStep] = useState<'amount' | 'processing'>('amount');
    const [error, setError] = useState('');

    const quickAmounts = ['5000', '10000', '20000'];
    const finalAmount = customAmount || amount;

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = Number(finalAmount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }
        if (!phone || phone.length < 10) {
            setError('Please enter a valid MTN phone number.');
            return;
        }
        setError('');
        setStep('processing');

        // Simulate MTN USSD Push
        setTimeout(() => {
            onSuccess(numAmount);
        }, 3000); 
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Deposit to Wallet">
            {step === 'amount' ? (
                <form onSubmit={handleConfirm} className="space-y-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Load money into your GoBus wallet using Mobile Money (MTN).
                    </p>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Amount (RWF)</label>
                        <div className="grid grid-cols-3 gap-2">
                            {quickAmounts.map(val => (
                                <button key={val} type="button" onClick={() => { setAmount(val); setCustomAmount(''); }} className={`p-3 text-center rounded-lg border-2 transition-all ${amount === val && !customAmount ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-bold' : 'dark:border-gray-600 text-gray-600 dark:text-gray-300'}`}>
                                    {new Intl.NumberFormat('fr-RW').format(parseInt(val))}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Or Enter Custom Amount</label>
                        <input 
                            type="number"
                            value={customAmount}
                            onChange={e => { setCustomAmount(e.target.value); setAmount(''); }}
                            placeholder="e.g., 12500"
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-lg font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">MTN Phone Number</label>
                        <div className="relative">
                            <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                            <input 
                                type="tel"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="078..."
                                className="w-full pl-10 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded">{error}</p>}
                    
                    <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg">
                        Confirm Deposit
                    </button>
                </form>
            ) : (
                <div className="text-center py-8">
                    <div className="w-16 h-16 border-4 border-yellow-400/50 border-t-yellow-400 rounded-full animate-spin mx-auto mb-6"></div>
                    <h3 className="text-xl font-bold dark:text-white">Waiting for Confirmation</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Please approve the transaction of <span className="font-bold text-blue-500">{new Intl.NumberFormat('fr-RW').format(Number(finalAmount))} RWF</span> on your phone ({phone}).</p>
                </div>
            )}
        </Modal>
    );
};

export default WalletTopUpModal;
