import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Smartphone, Landmark, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    planName: string;
    amount: number;
}

export default function PaymentModal({ isOpen, onClose, onSuccess, planName, amount }: PaymentModalProps) {
    const [method, setMethod] = useState<'khalti' | 'esewa' | 'fonepay'>('khalti');
    const [step, setStep] = useState<'selection' | 'processing' | 'success'>('selection');

    const handlePay = () => {
        setStep('processing');
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onSuccess();
                onClose();
                setStep('selection');
            }, 2000);
        }, 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-[#E6D5C3] flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-[#1C1B1A]">Complete Payment</h2>
                                <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">{planName} • Rs. {amount.toLocaleString()}</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-[#FAF8F4] rounded-full transition-colors">
                                <X size={20} className="text-[#9CA3AF]" />
                            </button>
                        </div>

                        <div className="p-8 min-h-[400px] flex flex-col justify-center">
                            {step === 'selection' && (
                                <div className="space-y-6">
                                    <p className="text-sm text-[#5A5856] text-center mb-4">Choose a gateway to proceed with your payment securely.</p>

                                    <div className="grid gap-3">
                                        <button
                                            onClick={() => setMethod('khalti')}
                                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${method === 'khalti' ? 'border-[#5C2D91] bg-[#5C2D91]/5 shadow-md' : 'border-[#E6D5C3] hover:border-[#5C2D91]/30'
                                                }`}
                                        >
                                            <img src="/khalti-logo.png" alt="Khalti" className="w-10 h-10 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                            <div className="flex-1 text-left">
                                                <span className="block font-bold text-[#1C1B1A]">Khalti SDK</span>
                                                <span className="text-xs text-[#9CA3AF]">Pay via Khalti Wallet</span>
                                            </div>
                                            <Smartphone className={method === 'khalti' ? 'text-[#5C2D91]' : 'text-[#9CA3AF]'} size={20} />
                                        </button>

                                        <button
                                            onClick={() => setMethod('esewa')}
                                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${method === 'esewa' ? 'border-[#60BB46] bg-[#60BB46]/5 shadow-md' : 'border-[#E6D5C3] hover:border-[#60BB46]/30'
                                                }`}
                                        >
                                            <img src="/esewa-logo.png" alt="eSewa" className="w-10 h-10 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                            <div className="flex-1 text-left">
                                                <span className="block font-bold text-[#1C1B1A]">eSewa</span>
                                                <span className="text-xs text-[#9CA3AF]">Direct Wallet Payment</span>
                                            </div>
                                            <Landmark className={method === 'esewa' ? 'text-[#60BB46]' : 'text-[#9CA3AF]'} size={20} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={handlePay}
                                        className="w-full mt-8 py-4 bg-[#1C1B1A] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#D4755B] transition-all shadow-lg"
                                    >
                                        <ShieldCheck size={20} />
                                        Securely Pay Rs. {amount.toLocaleString()}
                                    </button>
                                </div>
                            )}

                            {step === 'processing' && (
                                <div className="flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 border-4 border-[#D4755B] border-t-transparent rounded-full animate-spin" />
                                    <h3 className="text-xl font-bold text-[#1C1B1A]">Processing Transaction</h3>
                                    <p className="text-sm text-[#9CA3AF]">Please do not refresh or close this window.</p>
                                </div>
                            )}

                            {step === 'success' && (
                                <div className="flex flex-col items-center justify-center text-center space-y-4">
                                    <motion.div
                                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                                        className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg"
                                    >
                                        <CheckCircle2 size={40} />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-[#1C1B1A]">Payment Successful!</h3>
                                    <p className="text-sm text-[#9CA3AF]">Your listing will be live after admin approval.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-[#FAF8F4] text-center">
                            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                                <ShieldCheck size={12} /> SSL Encrypted • Secure Nepal
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
