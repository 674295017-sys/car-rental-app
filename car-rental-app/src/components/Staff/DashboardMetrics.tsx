import React from 'react';
import { DollarSign, TrendingUp, Car, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { Vehicle, Booking } from '../../types';

interface DashboardMetricsProps {
  vehicles: Vehicle[];
  bookings: Booking[];
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ vehicles, bookings }) => {
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.rentalTotal || 0), 0);
  const activeBookings = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'ACTIVE');
  const availableCount = vehicles.filter((v) => v.status === 'AVAILABLE').length;
  const rentedCount = vehicles.filter((v) => v.status === 'RENTED').length;
  const maintenanceCount = vehicles.filter((v) => v.status === 'MAINTENANCE').length;
  const occupancyRate = Math.round((rentedCount / (vehicles.length || 1)) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard รายงานธุรกิจและสถานะกองยาน</h1>
        <p className="text-xs text-slate-500 mt-1">สรุปข้อมูลภาพรวมการเช่าและรายได้ประจำวัน/เดือน</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">รายได้รวมจากการเช่า</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ฿{totalRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2% จากเดือนที่แล้ว
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">อัตราการใช้งานรถ (Occupancy)</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {occupancyRate}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              ให้เช่าอยู่ {rentedCount} จาก {vehicles.length} คัน
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Available Cars */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">รถพร้อมให้บริการทันที</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {availableCount} คัน
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              ซ่อมบำรุง {maintenanceCount} คัน
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Active Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">สัญญาเช่าที่เปิดอยู่ (Active)</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {activeBookings.length} สัญญา
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              ชำระเงินเรียบร้อยแล้ว 100%
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">รายการจองล่าสุด (Recent Bookings)</h3>
            <p className="text-xs text-slate-400">ประวัติการทำรายการผ่านระบบออนไลน์</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            {bookings.length} รายการ
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">ผู้เช่า</th>
                <th className="py-3 px-4">รถยนต์</th>
                <th className="py-3 px-4">ช่วงเวลาเช่า</th>
                <th className="py-3 px-4">ยอดเงิน</th>
                <th className="py-3 px-4">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{b.bookingRef}</td>
                  <td className="py-3 px-4">{b.customerName}</td>
                  <td className="py-3 px-4 text-slate-800">{b.vehicle?.name || b.vehicleId}</td>
                  <td className="py-3 px-4 text-slate-500">{b.pickupDate} ถึง {b.returnDate}</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">฿{b.grandTotal.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                      {b.status}
                    </span>
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
