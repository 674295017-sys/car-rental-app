import React, { useState } from 'react';
import { Car, RefreshCw, Plus, Wrench, Shield, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Vehicle, VehicleStatus } from '../../types';
import { BRANCHES } from '../../data/mockVehicles';

interface FleetManagerProps {
  vehicles: Vehicle[];
  onUpdateStatus: (vehicleId: string, newStatus: VehicleStatus) => void;
}

export const FleetManager: React.FC<FleetManagerProps> = ({ vehicles, onUpdateStatus }) => {
  const [filterBranch, setFilterBranch] = useState('ทุกสาขา');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredVehicles = vehicles.filter((v) => {
    const matchBranch = filterBranch === 'ทุกสาขา' || v.branch === filterBranch;
    const matchStatus = filterStatus === 'ALL' || v.status === filterStatus;
    return matchBranch && matchStatus;
  });

  const getStatusBadge = (status: VehicleStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> ว่าง (พร้อมเช่า)</span>;
      case 'RESERVED':
        return <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-600" /> จองแล้ว</span>;
      case 'RENTED':
        return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><Car className="w-3.5 h-3.5 text-blue-600" /> ให้เช่าอยู่</span>;
      case 'MAINTENANCE':
        return <span className="bg-rose-100 text-rose-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><Wrench className="w-3.5 h-3.5 text-rose-600" /> ซ่อมบำรุง</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">จัดการกองยานพาหนะ (Fleet Management)</h1>
          <p className="text-xs text-slate-500 mt-1">
            ควบคุมและตรวจสอบสถานะรถยนต์ทั้งหมดในระบบ ({vehicles.length} คัน)
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2 outline-none"
          >
            {BRANCHES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2 outline-none"
          >
            <option value="ALL">ทุกสถานะ</option>
            <option value="AVAILABLE">ว่าง (AVAILABLE)</option>
            <option value="RESERVED">จองแล้ว (RESERVED)</option>
            <option value="RENTED">ให้เช่าอยู่ (RENTED)</option>
            <option value="MAINTENANCE">ซ่อมบำรุง (MAINTENANCE)</option>
          </select>
        </div>
      </div>

      {/* Vehicle Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">รถยนต์ / ทะเบียน</th>
                <th className="py-3.5 px-4">สาขาประจำ</th>
                <th className="py-3.5 px-4">เลขไมล์สะสม</th>
                <th className="py-3.5 px-4">ระดับน้ำมัน / แบต</th>
                <th className="py-3.5 px-4">อัตราค่าเช่า</th>
                <th className="py-3.5 px-4">สถานะปัจจุบัน</th>
                <th className="py-3.5 px-4 text-center">ปรับเปลี่ยนสถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredVehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={v.imageUrl}
                        alt={v.name}
                        className="w-14 h-10 object-cover rounded-lg border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{v.name}</div>
                        <div className="text-[11px] font-mono text-slate-500">{v.licensePlate} ({v.year})</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{v.branch}</td>
                  <td className="py-3 px-4 font-mono">{v.currentMileage.toLocaleString()} กม.</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${
                            v.fuelLevelPercent > 50 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${v.fuelLevelPercent}%` }}
                        ></div>
                      </div>
                      <span className="font-mono text-[11px]">{v.fuelLevelPercent}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-600">฿{v.dailyRate.toLocaleString()} /วัน</td>
                  <td className="py-3 px-4">{getStatusBadge(v.status)}</td>
                  <td className="py-3 px-4 text-center">
                    <select
                      value={v.status}
                      onChange={(e) => onUpdateStatus(v.id, e.target.value as VehicleStatus)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold rounded-lg px-2.5 py-1.5 border border-slate-200 outline-none cursor-pointer"
                    >
                      <option value="AVAILABLE">AVAILABLE (ว่าง)</option>
                      <option value="RESERVED">RESERVED (จองแล้ว)</option>
                      <option value="RENTED">RENTED (ให้เช่าอยู่)</option>
                      <option value="MAINTENANCE">MAINTENANCE (ซ่อมบำรุง)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
