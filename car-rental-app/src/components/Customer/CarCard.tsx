import React from 'react';
import { Users, Fuel, Gauge, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { Vehicle } from '../../types';

interface CarCardProps {
  vehicle: Vehicle;
  onBook: (vehicle: Vehicle) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ vehicle, onBook }) => {
  const isAvailable = vehicle.status === 'AVAILABLE';

  const getStatusBadge = () => {
    switch (vehicle.status) {
      case 'AVAILABLE':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> พร้อมให้บริการ</span>;
      case 'RESERVED':
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3 text-amber-600" /> ติดจอง</span>;
      case 'RENTED':
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-semibold px-2.5 py-1 rounded-full">กำลังใช้งาน</span>;
      case 'MAINTENANCE':
        return <span className="bg-slate-200 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full">ซ่อมบำรุง</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Car Image with Category Tag */}
      <div className="relative h-48 sm:h-52 w-full bg-slate-100 overflow-hidden">
        <img
          src={vehicle.imageUrl}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {getStatusBadge()}
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-md uppercase">
            {vehicle.category}
          </span>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[11px] px-2 py-0.5 rounded">
          {vehicle.licensePlate}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-lg text-slate-900 leading-tight">
              {vehicle.name}
            </h3>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              {vehicle.year}
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">{vehicle.model}</p>

          {/* Quick Specs */}
          <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-100 text-xs text-slate-600 mb-3">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{vehicle.seats} ที่นั่ง</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
              <span>{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {vehicle.fuelType === 'ELECTRIC' ? (
                <Zap className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <Fuel className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span className="truncate">{vehicle.fuelType}</span>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-1 mb-4">
            {vehicle.features.slice(0, 2).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-500">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">เริ่มต้นวันละ</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-emerald-600">
                ฿{vehicle.dailyRate.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400">/วัน</span>
            </div>
            <div className="text-[10px] text-slate-400">มัดจำ ฿{vehicle.deposit.toLocaleString()}</div>
          </div>

          <button
            onClick={() => onBook(vehicle)}
            disabled={!isAvailable}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${
              isAvailable
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isAvailable ? 'จองทันที' : 'ไม่ว่าง'}
          </button>
        </div>
      </div>
    </div>
  );
};
