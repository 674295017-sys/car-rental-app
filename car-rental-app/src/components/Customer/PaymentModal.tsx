import React, { useState, useEffect } from 'react';
import { X, QrCode, CreditCard, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Booking } from '../../types';

interface PaymentModalProps {
  booking: Partial<Booking>;
  onClose: () => void;
  onPaymentSuccess: (bookingRef: string, paymentMethod: 'PROMPTPAY' | 'CREDIT_CARD') => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  booking,
  onClose,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<'PROMPTPAY' | 'CREDIT_CARD'>('PROMPTPAY');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes (900 seconds)
  const [isProcessing, setIsProcessing] = useState(false);

  // 15-minute countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess(booking.bookingRef || 'BK-MOCK-REF', method);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-base">ชำระเงินปลอดภัย (Secure Checkout)</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Timer Notification Banner */}
        <div className="bg-amber-50 border-b border-amber-200/60 p-3 px-6 flex items-center justify-between text-xs text-amber-800 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>ล็อกรถไว้ให้คุณชั่วคราว</span>
          </div>
          <div className="font-mono text-sm font-bold bg-amber-200/80 px-2 py-0.5 rounded text-amber-900">
            {formatTimer(timeLeft)}
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Amount to pay */}
          <div className="text-center py-2 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500">ยอดที่ต้องชำระสุทธิ</span>
            <div className="text-3xl font-extrabold text-emerald-600 mt-0.5">
              ฿{booking.grandTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              รหัสการจอง: <span className="font-mono font-bold text-slate-700">{booking.bookingRef}</span>
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setMethod('PROMPTPAY')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                method === 'PROMPTPAY'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-4 h-4 text-blue-600" />
              <span>Thai QR PromptPay</span>
            </button>
            <button
              onClick={() => setMethod('CREDIT_CARD')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                method === 'CREDIT_CARD'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>บัตรเครดิต / เดบิต</span>
            </button>
          </div>

          {/* PromptPay View */}
          {method === 'PROMPTPAY' && (
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
              <div className="bg-blue-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                PromptPay • พร้อมเพย์
              </div>
              
              {/* Mock QR Code Graphic */}
              <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 mb-3">
                <div className="w-44 h-44 bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-between text-white">
                  <div className="flex justify-between w-full">
                    <div className="w-8 h-8 border-2 border-white rounded-md"></div>
                    <div className="w-8 h-8 border-2 border-white rounded-md"></div>
                  </div>
                  <div className="text-center font-mono text-[10px] tracking-widest text-slate-300">
                    SCAN TO PAY<br/>฿{booking.grandTotal?.toFixed(2)}
                  </div>
                  <div className="flex justify-between w-full">
                    <div className="w-8 h-8 border-2 border-white rounded-md"></div>
                    <div className="w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 max-w-xs">
                เปิดแอปธนาคารของคุณ (K PLUS, SCB EASY, Krungthai NEXT) แล้วสแกนเพื่อชำระเงิน
              </p>
            </div>
          )}

          {/* Credit Card View */}
          {method === 'CREDIT_CARD' && (
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">หมายเลขบัตร 16 หลัก</label>
                <input
                  type="text"
                  placeholder="4111 •••• •••• 1111"
                  defaultValue="4111 2222 3333 4444"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">วันหมดอายุ (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="12/28"
                    defaultValue="12/28"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">รหัส CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    defaultValue="888"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit / Simulation Button */}
          <button
            onClick={handleSimulatePayment}
            disabled={isProcessing}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span>กำลังตรวจสอบยอดเงิน...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>จำลองการชำระเงินสำเร็จ (Simulate Pay)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
