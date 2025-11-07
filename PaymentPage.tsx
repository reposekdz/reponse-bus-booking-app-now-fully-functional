import React, { useState } from 'react';
import { Page } from './App';
import { CreditCardIcon, PhoneIcon, LockClosedIcon, ArrowRightIcon } from './components/icons';
import LoadingSpinner from './components/LoadingSpinner';

const PaymentPage: React.FC<{ bookingDetails: any, onNavigate: (page: Page, data?: any) => void }> = ({ bookingDetails, onNavigate }) => {
    const [paymentMethod, setPaymentMethod] = useState('momo');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!bookingDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading booking details...</p>
            </div>
        )
    };

    const handlePayment = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            onNavigate('bookingConfirmation', bookingDetails);
        }, 2500);
    };

    return (
        <>
        {isProcessing && <LoadingSpinner />}
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 order-last lg:order-first">
                    <h2 className="text-2xl font-bold mb-6 dark:text-white">Order Summary</h2>
                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Route:</span><span className="font-semibold">{bookingDetails.from} to {bookingDetails.to}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Company:</span><span className="font-semibold">{bookingDetails.company}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Seats:</span><span className="font-semibold">{bookingDetails.seats}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Departure:</span><span className="font-semibold">{bookingDetails.departureTime}</span></div>
                        {bookingDetails.pointsUsed > 0 && (
                             <div className="flex justify-between text-green-600"><span className="text-gray-500 dark:text-gray-400">GoPoints Discount:</span><span className="font-semibold">- {new Intl.NumberFormat('fr-RW').format(bookingDetails.pointsUsed)} RWF</span></div>
                        )}
                        <div className="border-t dark:border-gray-700 pt-4 mt-4 flex justify-between items-baseline">
                            <span className="text-lg font-bold dark:text-white">Total to Pay:</span>
                            <span className="text-3xl font-extrabold text-green-600">{new Intl.NumberFormat('fr-RW').format(bookingDetails.totalPrice)} RWF</span>
                        </div>
                    </div>
                </div>

                {/* Payment Form */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold mb-6 dark:text-white">Secure Payment</h2>
                    <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg p-1 mb-6">
                        <button onClick={() => setPaymentMethod('momo')} className={`flex-1 py-2 rounded-md font-semibold text-sm transition ${paymentMethod === 'momo' ? 'bg-blue-600 text-white shadow' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Mobile Money</button>
                        <button onClick={() => setPaymentMethod('card')} className={`flex-1 py-2 rounded-md font-semibold text-sm transition ${paymentMethod === 'card' ? 'bg-blue-600 text-white shadow' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Credit Card</button>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-4">
                        {paymentMethod === 'momo' && (
                            <div className="animate-fade-in">
                                <label className="text-sm font-medium dark:text-gray-300">Phone Number</label>
                                <div className="relative mt-1">
                                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="tel" className="w-full pl-10 pr-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500" placeholder="078..." required />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">You will receive a prompt on your phone to authorize the payment by entering your PIN.</p>
                            </div>
                        )}
                        {paymentMethod === 'card' && (
                            <div className="space-y-4 animate-fade-in">
                                <div>
                                    <label className="text-sm font-medium dark:text-gray-300">Card Number</label>
                                    <div className="relative mt-1">
                                        <CreditCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input type="text" className="w-full pl-10 pr-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500" placeholder="**** **** **** ****" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                     <div>
                                        <label className="text-sm font-medium dark:text-gray-300">Expiry Date</label>
                                        <input type="text" className="w-full mt-1 py-3 px-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500" placeholder="MM / YY" required />
                                    </div>
                                     <div>
                                        <label className="text-sm font-medium dark:text-gray-300">CVC</label>
                                        <input type="text" className="w-full mt-1 py-3 px-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500" placeholder="***" required />
                                    </div>
                                </div>
                            </div>
                        )}
                        <button type="submit" className="w-full mt-6 py-4 bg-green-600 text-white font-bold rounded-lg text-lg hover:bg-green-700 transition flex items-center justify-center">
                            Pay Now <ArrowRightIcon className="w-5 h-5 ml-2"/>
                        </button>
                         <p className="text-xs text-gray-500 text-center flex items-center justify-center mt-2"><LockClosedIcon className="w-3 h-3 mr-1"/> Payments are secure and encrypted.</p>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
};

export default PaymentPage;
