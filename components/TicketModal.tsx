
import React, { useRef, useEffect } from 'react';
import { toCanvas } from 'qrcode';
import { XIcon, BusIcon, ShieldCheckIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

const generateSignature = (data: string) => {
  // Simple hash function to simulate a digital signature for the QR payload
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; 
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
};

const RealQRCode: React.FC<{ ticketData: any; size: number }> = ({ ticketData, size }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && ticketData) {
      // Create a dense, informative payload
      const rawData = `${ticketData.id}${ticketData.passenger}${ticketData.seats}${ticketData.date}`;
      const signature = generateSignature(rawData);
      
      const qrPayload = JSON.stringify({
        ver: 'v1',
        bid: ticketData.id,
        psg: ticketData.passenger,
        rt: `${ticketData.from} > ${ticketData.to}`,
        dt: `${ticketData.date} ${ticketData.time}`,
        st: ticketData.seats,
        pl: ticketData.busPlate,
        sig: signature // Simulated security signature
      });

      toCanvas(canvasRef.current, qrPayload, {
        width: size,
        margin: 1,
        color: {
          dark: '#111827', // Dark gray/black for better contrast scanning
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'Q', // Good balance of density and error correction
      }, (error) => {
        if (error) console.error('QR Code generation failed:', error);
      });
    }
  }, [ticketData, size]);

  return <canvas ref={canvasRef} className="rounded-md shadow-sm border border-gray-100" style={{ width: size, height: size }} />;
};


const InfoRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight = false }) => (
    <div className="flex justify-between items-center py-3 border-b border-dashed border-gray-200 dark:border-gray-700/50 last:border-0">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
        <p className={`font-bold text-right ${highlight ? 'text-blue-600 dark:text-blue-400 text-lg' : 'text-gray-900 dark:text-white'}`}>{value}</p>
    </div>
);

export const TicketModal: React.FC<{ ticket: any; onClose: () => void, isActive?: boolean }> = ({ ticket, onClose, isActive = false }) => {
  const { t } = useLanguage();
  if (!ticket) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-transform duration-300 scale-95 animate-scale-in relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative Header Gradient */}
        <div className="h-32 bg-gradient-to-br from-[#0033A0] to-[#00574B] relative p-6">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors z-10">
                <XIcon className="w-5 h-5"/>
            </button>
            <div className="flex flex-col items-center justify-center h-full text-white relative z-0">
                <BusIcon className="w-10 h-10 mb-2 opacity-90"/>
                <h2 className="text-xl font-bold tracking-tight">GoBus E-Ticket</h2>
                <p className="text-xs font-medium opacity-80 uppercase tracking-widest mt-1">{ticket.company}</p>
            </div>
        </div>

        {/* Main Content */}
        <div className="px-6 pb-6 -mt-6 relative z-10">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-1 border border-gray-100 dark:border-gray-700">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 flex flex-col items-center">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
                        <RealQRCode ticketData={ticket} size={180} />
                    </div>
                    <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                        <ShieldCheckIcon className="w-4 h-4 text-green-600 dark:text-green-400"/>
                        <span className="text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wide">Secure Ticket</span>
                    </div>
                     {isActive && (
                        <p className="text-center font-bold text-sm text-blue-600 dark:text-blue-400 mt-3 animate-pulse">
                            {t('ticket_modal_activated')}
                        </p>
                    )}
                </div>

                <div className="px-4 pb-4 mt-4">
                    <InfoRow label={t('ticket_modal_passenger')} value={ticket.passenger} />
                    <InfoRow label={t('ticket_modal_route')} value={`${ticket.from} → ${ticket.to}`} />
                    <InfoRow label={t('ticket_modal_datetime')} value={`${ticket.date} • ${ticket.time}`} />
                    <div className="flex border-t border-dashed border-gray-200 dark:border-gray-700 pt-3 mt-2">
                         <div className="w-1/2 border-r border-dashed border-gray-200 dark:border-gray-700 pr-4">
                             <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">{t('ticket_modal_seats')}</p>
                             <p className="font-bold text-xl text-gray-900 dark:text-white">{ticket.seats}</p>
                         </div>
                         <div className="w-1/2 pl-4">
                             <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">{t('ticket_modal_plate')}</p>
                             <p className="font-bold text-xl text-gray-900 dark:text-white">{ticket.busPlate}</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Footer Ticket ID */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 text-center border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs font-mono text-gray-400">ID: {ticket.id}</p>
        </div>
      </div>
      
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
