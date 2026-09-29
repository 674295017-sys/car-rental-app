import React, { useState } from 'react';
import { Camera, CheckSquare, Wrench, ShieldAlert, CheckCircle, Upload } from 'lucide-react';
import { Vehicle, Booking } from '../../types';

interface VehicleInspectionProps {
  vehicles: Vehicle[];
  bookings: Booking[];
  onCompleteInspection: (notes: string) => void;
}

export const VehicleInspection: React.FC<VehicleInspectionProps> = ({
  vehicles,
  bookings,
  onCompleteInspection,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || '');
  const [inspectionType, setInspectionType] = useState<'CHECKOUT' | 'CHECKIN'>('CHECKIN');
  const [mileage, setMileage] = useState('12850');
  const [fuelLevel, setFuelLevel] = useState('100');
  const [hasDamage, setHasDamage] = useState(false);
  const [damageNotes, setDamageNotes] = useState('');
  const [damageCost, setDamageCost] = useState('0');
  const [isSuccess, setIsSuccess] = useState(false);

  // Photos checklist simulation
  const [photosUploaded, setPhotosUploaded] = useState({
    front: true,
    rear: true,
    left: true,
    right: true,
  });

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onCompleteInspection(`ตรวจสภาพสำเร็จ: ${selectedVehicle?.name} (${inspectionType}) ไมล์ ${mileage} กม.`);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">ระบบตรวจสภาพรถยนต์ (Inspection & Handover)</h1>
              <p className="text-xs text-slate-400">บันทึกรูปถ่าย สภาพรถ และระดับน้ำมันก่อนส่งมอบและรับคืน</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Inspection Type Selector */}
          <div className="grid grid-cols-2 gap-3 bg-slate-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setInspectionType('CHECKOUT')}
              className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                inspectionType === 'CHECKOUT'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>1. ส่งมอบรถให้ลูกค้า (Check-out)</span>
            </button>
            <button
              type="button"
              onClick={() => setInspectionType('CHECKIN')}
              className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                inspectionType === 'CHECKIN'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>2. ตรวจรับรถคืนจากลูกค้า (Check-in)</span>
            </button>
          </div>

          {/* Vehicle Select */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">เลือกรถยนต์</label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} — {v.licensePlate} ({v.branch})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">พนักงานผู้ตรวจสอบ</label>
              <input
                type="text"
                readOnly
                value="นายวิชาญ ใจซื่อ (Staff ID: ST-042)"
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-600 outline-none"
              />
            </div>
          </div>

          {/* Mileage & Fuel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">เลขไมล์หน้าปัดปัจจุบัน (กม.) *</label>
              <input
                type="number"
                required
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">ระดับน้ำมัน / แบตเตอรี่ (%) *</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fuelLevel}
                  onChange={(e) => setFuelLevel(e.target.value)}
                  className="flex-1 accent-emerald-600"
                />
                <span className="font-mono font-bold text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
                  {fuelLevel}%
                </span>
              </div>
            </div>
          </div>

          {/* Photo Inspection Checklist */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              รูปถ่ายสภาพรถรอบคัน (Photo Checklist 4 ทิศทาง)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: 'front', label: 'ด้านหน้า (Front)' },
                { key: 'rear', label: 'ด้านหลัง (Rear)' },
                { key: 'left', label: 'ด้านซ้าย (Left)' },
                { key: 'right', label: 'ด้านขวา (Right)' },
              ].map((side) => (
                <div
                  key={side.key}
                  className="border border-dashed border-emerald-300 bg-emerald-50/40 rounded-2xl p-3 text-center flex flex-col items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-[11px] font-bold text-slate-700">{side.label}</span>
                  <span className="text-[10px] text-emerald-700">อัปโหลดเรียบร้อย</span>
                </div>
              ))}
            </div>
          </div>

          {/* Damage / Incident Report */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-slate-800">พบความเสียหายหรือรอยขูดขีดใหม่หรือไม่?</span>
              </div>
              <input
                type="checkbox"
                checked={hasDamage}
                onChange={(e) => setHasDamage(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
            </div>

            {hasDamage && (
              <div className="pt-2 space-y-2">
                <textarea
                  placeholder="ระบุจุดที่เสียหาย เช่น รอยครูดกันชนหน้าด้านซ้าย ยาว 10 ซม."
                  value={damageNotes}
                  onChange={(e) => setDamageNotes(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs outline-none"
                  rows={2}
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">ประเมินค่าเสียหายส่วนเกิน:</span>
                  <input
                    type="number"
                    value={damageCost}
                    onChange={(e) => setDamageCost(e.target.value)}
                    className="w-32 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono font-bold outline-none"
                  />
                  <span className="text-xs text-slate-500">บาท (หักจากเงินประกัน)</span>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl text-xs shadow-lg shadow-slate-900/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {isSuccess ? (
              <span className="text-emerald-400">✓ บันทึกผลการตรวจสภาพเรียบร้อยแล้ว!</span>
            ) : (
              <>
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>ยืนยันการบันทึกตรวจสภาพรถ</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
