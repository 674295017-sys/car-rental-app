import React, { useState } from 'react';
import { X, Calendar, Shield, CreditCard, AlertTriangle, Check, User, Phone, Mail, FileText } from 'lucide-react';
import { Vehicle, Booking } from '../../types';

interface BookingModalProps {
  vehicle: Vehicle;
  pickupDate: string;
  returnDate: string;
  pickupBranch: string;
  onClose: () => void;
  onProceedToPayment: (bookingData: Partial<Booking>) => void;
  defaultName?: string;
  defaultEmail?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  vehicle,
  pickupDate,
  returnDate,
  pickupBranch,
  onClose,
  onProceedToPayment,
  defaultName = '',
  defaultEmail = '',
}) => {
  // Form State
  const [customerName, setCustomerName] = useState(defaultName);
  const [customerEmail, setCustomerEmail] = useState(defaultEmail);
  const [customerPhone, setCustomerPhone] = useState('');
  const [idCard, setIdCard] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [includeFullInsurance, setIncludeFullInsurance] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate rental duration in days
  const start = new Date(pickupDate);
  const end = new Date(returnDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const calculatedDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const dailyInsurance = includeFullInsurance ? 250 : 0;
  const rentalTotal = vehicle.dailyRate * calculatedDays;
  const insuranceTotal = dailyInsurance * calculatedDays;
  const subtotalBeforeVat = rentalTotal + insuranceTotal;
  const vatAmount = subtotalBeforeVat * 0.07;
  const depositAmount = vehicle.deposit;
  const grandTotal = subtotalBeforeVat + vatAmount + depositAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !idCard || !licenseNumber) {
      setErrorMsg('กรุณากรอกข้อมูลผู้เช่าให้ครบทุกช่อง');
      return;
    }
    if (!agreedToTerms) {
      setErrorMsg('กรุณายอมรับเงื่อนไขและข้อตกลงการเช่ารถ');
      return;
    }

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingRef = `BK-202610-${randomSuffix}`;

    onProceedToPayment({
      bookingRef,
      vehicleId: vehicle.id,
      vehicle,
      customerName,
      customerEmail,
      customerPhone,
      idCardOrPassport: idCard,
      licenseNumber,
      pickupBranch,
      returnBranch: pickupBranch,
      pickupDate,
      returnDate,
      days: calculatedDays,
      dailyRate: vehicle.dailyRate,
      rentalTotal,
      insuranceFee: insuranceTotal,
      vatAmount,
      depositAmount,
      grandTotal,
      status: 'PENDING_PAYMENT',
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h2 className="text-lg font-bold">ยืนยันรายละเอียดการจอง</h2>
              <p className="text-xs text-slate-400">{vehicle.name} ({vehicle.licensePlate})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Car & Rental Summary Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4">
            <img
              src={vehicle.imageUrl}
              alt={vehicle.name}
              className="w-28 h-20 rounded-xl object-cover"
            />
            <div className="flex-1 text-sm">
              <div className="font-bold text-slate-900">{vehicle.name}</div>
              <div className="text-xs text-slate-500">{vehicle.branch}</div>
              <div className="mt-1 flex items-center gap-4 text-xs font-semibold text-emerald-700">
                <span>{pickupDate} ถึง {returnDate}</span>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {calculatedDays} วัน
                </span>
              </div>
            </div>
          </div>

          {/* Customer Information (BR-01) */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-600" />
              ข้อมูลผู้เช่า (ต้องมีอายุ ≥ 21 ปี และมีใบขับขี่ที่ยังไม่หมดอายุ)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">ชื่อ - นามสกุล *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น นายสมชาย ใจดี"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">เบอร์โทรศัพท์ *</label>
                <input
                  type="tel"
                  required
                  placeholder="08X-XXX-XXXX"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">อีเมลสำหรับรับใบเสร็จ *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">เลขบัตรประชาชน / พาสปอร์ต *</label>
                <input
                  type="text"
                  required
                  placeholder="1-XXXX-XXXXX-XX-X"
                  value={idCard}
                  onChange={(e) => setIdCard(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">เลขที่ใบอนุญาตขับขี่ *</label>
                <input
                  type="text"
                  required
                  placeholder="DL-XXXXXXXX"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Add-on: Insurance */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-emerald-50/50 flex items-start gap-3">
            <input
              type="checkbox"
              id="insurance"
              checked={includeFullInsurance}
              onChange={(e) => setIncludeFullInsurance(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="insurance" className="flex-1 cursor-pointer text-xs">
              <span className="font-bold text-slate-900 block text-sm">
                ประกันภัยคุ้มครองครอบคลุมชั้น 1 (+฿250/วัน)
              </span>
              <span className="text-slate-500">
                คุ้มครองอุบัติเหตุ ไร้กังวลกรณีเกิดรอยขีดข่วนหรือเฉี่ยวชน ไม่ต้องจ่ายค่าเสียหายส่วนแรก (Deductible = ฿0)
              </span>
            </label>
          </div>

          {/* Pricing Breakdown (BR-03, BR-06, BR-12) */}
          <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>ค่าเช่ารถ ({vehicle.dailyRate.toLocaleString()} × {calculatedDays} วัน)</span>
              <span>฿{rentalTotal.toLocaleString()}</span>
            </div>
            {includeFullInsurance && (
              <div className="flex justify-between text-slate-600">
                <span>ประกันภัยเสริม (250 × {calculatedDays} วัน)</span>
                <span>฿{insuranceTotal.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>ภาษีมูลค่าเพิ่ม VAT 7%</span>
              <span>฿{vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200 font-semibold">
              <span>เงินมัดจำความเสียหาย (ได้คืนหลังคืนรถ 100%)</span>
              <span className="text-emerald-700">฿{depositAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-300">
              <span>ยอดรวมที่ต้องชำระทันที</span>
              <span className="text-emerald-600">
                ฿{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="terms" className="text-xs text-slate-500 cursor-pointer">
              ข้าพเจ้ายินยอมปฏิบัติตามกฎระเบียบการเช่ารถ (อายุ ≥ 21 ปี, นโยบายยกเลิกล่วงหน้า 48 ชม. ได้รับเงินคืน 100%)
            </label>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl text-xs transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl text-xs shadow-lg shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>ดำเนินการชำระเงิน</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
