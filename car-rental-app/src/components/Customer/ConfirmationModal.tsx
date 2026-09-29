import React from 'react';
import { CheckCircle, Download, Calendar, MapPin, Car, ShieldCheck } from 'lucide-react';
import { Booking } from '../../types';

interface ConfirmationModalProps {
  booking: Booking;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ booking, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Top celebration banner */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold">การจองสำเร็จเรียบร้อย!</h2>
          <p className="text-xs text-emerald-100 mt-1">
            ระบบได้ส่งหลักฐานการจองและสัญญาเช่าไปยังอีเมล {booking.customerEmail} แล้ว
          </p>
        </div>

        {/* Receipt content */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Booking Reference Number
            </div>
            <div className="font-mono text-2xl font-black text-slate-900 tracking-wider mt-1">
              {booking.bookingRef}
            </div>
            <div className="mt-2 text-xs text-emerald-700 font-semibold bg-emerald-100/60 inline-block px-3 py-1 rounded-full">
              สถานะ: ชำระเงินเรียบร้อยแล้ว (CONFIRMED)
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 border-y border-slate-100 py-3">
            <div className="flex justify-between">
              <span className="text-slate-400 flex items-center gap-1.5"><Car className="w-3.5 h-3.5" /> รถที่เช่า</span>
              <span className="font-semibold text-slate-900">{booking.vehicle?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> สาขารับรถ</span>
              <span className="font-medium text-slate-800">{booking.pickupBranch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> วันที่รับ - คืน</span>
              <span className="font-medium text-slate-800">{booking.pickupDate} - {booking.returnDate} ({booking.days} วัน)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">ผู้จอง</span>
              <span className="font-medium text-slate-800">{booking.customerName} ({booking.customerPhone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">ยอดเงินที่ชำระทั้งหมด</span>
              <span className="font-bold text-slate-900 text-sm text-emerald-600">
                ฿{booking.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3 rounded-xl text-xs flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <span>กรุณาแสดงรหัสการจอง พร้อมบัตรประชาชนและใบขับขี่ตัวจริงต่อพนักงาน ณ จุดรับรถ</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>พิมพ์ใบยืนยัน</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-colors"
            >
              เสร็จสิ้น
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
