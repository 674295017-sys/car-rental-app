import React from 'react';
import { Calendar, MapPin, Search, Filter } from 'lucide-react';
import { BRANCHES } from '../../data/mockVehicles';
import { VehicleCategory } from '../../types';

interface CarSearchProps {
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  pickupDate: string;
  setPickupDate: (date: string) => void;
  returnDate: string;
  setReturnDate: (date: string) => void;
}

export const CarSearch: React.FC<CarSearchProps> = ({
  selectedBranch,
  setSelectedBranch,
  selectedCategory,
  setSelectedCategory,
  pickupDate,
  setPickupDate,
  returnDate,
  setReturnDate,
}) => {
  const categories: { label: string; value: string }[] = [
    { label: 'ทั้งหมด', value: 'ALL' },
    { label: 'Eco Car (ประหยัด)', value: 'ECO' },
    { label: 'Sedan (เก๋งซีดาน)', value: 'SEDAN' },
    { label: 'SUV (อเนกประสงค์)', value: 'SUV' },
    { label: 'EV (ไฟฟ้า 100%)', value: 'EV' },
    { label: 'VIP Van (ตู้ 9 ที่นั่ง)', value: 'VAN' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100 -mt-8 relative z-20 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Branch */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            จุดรับ - ส่งรถ
          </label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          >
            {BRANCHES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Pickup Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            วันที่รับรถ
          </label>
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Return Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            วันที่คืนรถ
          </label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Search Info / Button */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
            <span>สถานะความพร้อม</span>
            <span className="text-emerald-600 font-semibold">อัปเดตแบบ Real-time</span>
          </div>
          <button 
            type="button"
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all text-sm"
          >
            <Search className="w-4 h-4" />
            <span>ค้นหารถว่าง</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 pr-2">
          <Filter className="w-3.5 h-3.5" /> ประเภท:
        </span>
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setSelectedCategory(c.value)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
              selectedCategory === c.value
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
};
