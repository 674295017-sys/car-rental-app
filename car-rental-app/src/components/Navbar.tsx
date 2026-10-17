import React from 'react';
import { Car, UserCheck, LayoutDashboard, Wrench, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export type Tab = 'customer' | 'fleet' | 'inspection' | 'dashboard' | 'login';

interface NavbarProps {
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, isAdmin, logout } = useAuth();

  const tabCls = (active: boolean, dark = false) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? dark
          ? 'bg-slate-900 text-white'
          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentTab('customer')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Car className="w-6 h-6" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">DriveEase</span>
              <span className="block text-[10px] text-slate-400 -mt-1 tracking-wider uppercase font-semibold">Car Rental & Fleet</span>
            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
            <button id="tab-customer" onClick={() => setCurrentTab('customer')} className={tabCls(currentTab === 'customer')}>
              <Car className="w-4 h-4" />
              <span className="hidden md:inline">จองรถเช่า</span>
            </button>

            {/* Backoffice tabs: rendered only for admins (server also enforces) */}
            {isAdmin && (
              <>
                <span className="text-slate-300 mx-1">|</span>
                <button id="tab-fleet" onClick={() => setCurrentTab('fleet')} className={tabCls(currentTab === 'fleet', true)}>
                  <UserCheck className="w-4 h-4" />
                  <span className="hidden lg:inline">จัดการกองยาน</span>
                </button>
                <button id="tab-inspection" onClick={() => setCurrentTab('inspection')} className={tabCls(currentTab === 'inspection', true)}>
                  <Wrench className="w-4 h-4" />
                  <span className="hidden lg:inline">ตรวจสภาพ</span>
                </button>
                <button id="tab-dashboard" onClick={() => setCurrentTab('dashboard')} className={tabCls(currentTab === 'dashboard', true)}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden lg:inline">Dashboard</span>
                </button>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <>
                <div className="flex items-center gap-2 pl-2">
                  {user.picture ? (
                    <img src={user.picture} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-slate-200" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="hidden md:block leading-tight">
                    <div className="text-xs font-semibold text-slate-800 max-w-[140px] truncate">{user.name}</div>
                    {isAdmin ? (
                      <span className="text-[10px] font-bold text-amber-700 flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> ADMIN
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">ผู้ใช้งานทั่วไป</span>
                    )}
                  </div>
                </div>
                <button
                  id="btn-logout"
                  onClick={async () => {
                    await logout();
                    setCurrentTab('customer');
                  }}
                  title="ออกจากระบบ"
                  className="w-9 h-9 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                id="btn-login"
                onClick={() => setCurrentTab('login')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold"
              >
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ระบบ</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
