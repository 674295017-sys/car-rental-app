import React, { useCallback, useEffect, useState } from 'react';
import { Navbar, Tab } from './components/Navbar';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { ChatWidget } from './components/ChatWidget';
import { CarSearch } from './components/Customer/CarSearch';
import { CarCard } from './components/Customer/CarCard';
import { BookingModal } from './components/Customer/BookingModal';
import { PaymentModal } from './components/Customer/PaymentModal';
import { ConfirmationModal } from './components/Customer/ConfirmationModal';
import { FleetManager } from './components/Staff/FleetManager';
import { VehicleInspection } from './components/Staff/VehicleInspection';
import { DashboardMetrics } from './components/Staff/DashboardMetrics';
import { INITIAL_VEHICLES, INITIAL_BOOKINGS } from './data/mockVehicles';
import { Vehicle, Booking, VehicleStatus } from './types';
import { Shield, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

const ADMIN_TABS: Tab[] = ['fleet', 'inspection', 'dashboard'];

const AppInner: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  // Navigation State
  const [currentTab, setCurrentTab] = useState<Tab>('customer');
  const [pendingVehicleAfterLogin, setPendingVehicleAfterLogin] = useState<Vehicle | null>(null);

  // UI-level guard: non-admins can never stay on a backoffice tab
  useEffect(() => {
    if (!loading && !isAdmin && ADMIN_TABS.includes(currentTab)) setCurrentTab('customer');
  }, [currentTab, isAdmin, loading]);

  // Application Data State
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Search & Filter State
  const [selectedBranch, setSelectedBranch] = useState('ทุกสาขา');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [pickupDate, setPickupDate] = useState('2026-10-05');
  const [returnDate, setReturnDate] = useState('2026-10-08');

  // Modal Flow State
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState<Vehicle | null>(null);
  const [pendingBooking, setPendingBooking] = useState<Partial<Booking> | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const loginSuccessRef = React.useRef(() => {
    setCurrentTab('customer');
    if (pendingVehicleAfterLogin) {
      setSelectedVehicleForBooking(pendingVehicleAfterLogin);
      setPendingVehicleAfterLogin(null);
    }
  });
  loginSuccessRef.current = () => {
    setCurrentTab('customer');
    if (pendingVehicleAfterLogin) {
      setSelectedVehicleForBooking(pendingVehicleAfterLogin);
      setPendingVehicleAfterLogin(null);
    }
  };
  const handleLoginSuccess = useCallback(() => loginSuccessRef.current(), []);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchBranch = selectedBranch === 'ทุกสาขา' || v.branch === selectedBranch;
    const matchCat = selectedCategory === 'ALL' || v.category === selectedCategory;
    return matchBranch && matchCat;
  });

  // Handle vehicle status update (Staff Fleet)
  const handleUpdateStatus = (vehicleId: string, newStatus: VehicleStatus) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, status: newStatus } : v))
    );
    showToast(`อัปเดตสถานะรถเป็น ${newStatus} สำเร็จ`);
  };

  // Handle booking confirmation after payment
  const handlePaymentSuccess = (bookingRef: string, paymentMethod: 'PROMPTPAY' | 'CREDIT_CARD') => {
    if (!pendingBooking) return;

    const newBooking: Booking = {
      ...(pendingBooking as Booking),
      status: 'CONFIRMED',
      paymentMethod,
      paidAt: new Date().toISOString(),
    };

    // Update fleet status to RESERVED (Double booking prevention)
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === newBooking.vehicleId ? { ...v, status: 'RESERVED' } : v
      )
    );

    setBookings((prev) => [newBooking, ...prev]);
    setPendingBooking(null);
    setConfirmedBooking(newBooking);
    showToast(`การจอง ${bookingRef} ชำระเงินเรียบร้อยแล้ว!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Tab 1: Customer Rental View */}
      {currentTab === 'customer' && (
        <main className="flex-1 pb-16">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-12 pb-20 px-4">
            <div className="max-w-5xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>รับประกันราคาตรงปก • ไม่มีค่าธรรมเนียมแอบแฝง (All-inclusive)</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                ขับขี่อย่างมั่นใจ เช่ารถง่ายใน 3 นาที
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto">
                เลือกรถใหม่ สะอาด ได้รับการตรวจสภาพทุกรอบ พร้อมประกันภัยชั้น 1 และบริการช่วยเหลือฉุกเฉินตลอด 24 ชั่วโมง
              </p>
            </div>
          </section>

          {/* Search Bar */}
          <section className="px-4">
            <CarSearch
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              pickupDate={pickupDate}
              setPickupDate={setPickupDate}
              returnDate={returnDate}
              setReturnDate={setReturnDate}
            />
          </section>

          {/* Car Catalog */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">รายการรถยนต์ที่พร้อมให้บริการ</h2>
                <p className="text-xs text-slate-500">พบ {filteredVehicles.length} คัน ตรงตามเงื่อนไขที่คุณเลือก</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <CarCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onBook={(v) => {
                    if (!user) {
                      setPendingVehicleAfterLogin(v);
                      setCurrentTab('login');
                      showToast('กรุณาเข้าสู่ระบบก่อนทำการจอง');
                      return;
                    }
                    setSelectedVehicleForBooking(v);
                  }}
                />
              ))}
            </div>
          </section>

          {/* Trust Banner */}
          <section className="max-w-6xl mx-auto px-4 mt-16">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">ประกันภัย & เงินมัดจำปลอดภัย</h3>
                  <p className="text-xs text-slate-500 mt-1">คืนเงินประกัน 100% ภายใน 3 วันทำการหลังตรวจรับรถเรียบร้อย</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">ยกเลิกฟรีก่อน 48 ชั่วโมง</h3>
                  <p className="text-xs text-slate-500 mt-1">คืนเงินเต็มจำนวน 100% ไม่มีหักค่าธรรมเนียมใดๆ</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">ตรวจสภาพด้วยรูปถ่ายรอบคัน</h3>
                  <p className="text-xs text-slate-500 mt-1">โปร่งใส ตรวจสอบได้ทุกรอย บันทึกสภาพรถทั้งตอนรับและตอนคืน</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {currentTab === 'login' && (
        <LoginPage
          onBack={() => setCurrentTab('customer')}
          onSuccess={handleLoginSuccess}
        />
      )}

      {/* Tab 2: Staff Fleet Management (admin only) */}
      {isAdmin && currentTab === 'fleet' && (
        <FleetManager
          vehicles={vehicles}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Tab 3: Vehicle Inspection */}
      {isAdmin && currentTab === 'inspection' && (
        <VehicleInspection
          vehicles={vehicles}
          bookings={bookings}
          onCompleteInspection={(msg) => showToast(msg)}
        />
      )}

      {/* Tab 4: Executive Dashboard */}
      {isAdmin && currentTab === 'dashboard' && (
        <DashboardMetrics
          vehicles={vehicles}
          bookings={bookings}
        />
      )}

      {/* Booking Modal */}
      {selectedVehicleForBooking && (
        <BookingModal
          vehicle={selectedVehicleForBooking}
          defaultName={user?.name}
          defaultEmail={user?.email}
          pickupDate={pickupDate}
          returnDate={returnDate}
          pickupBranch={selectedBranch === 'ทุกสาขา' ? selectedVehicleForBooking.branch : selectedBranch}
          onClose={() => setSelectedVehicleForBooking(null)}
          onProceedToPayment={(bookingData) => {
            setSelectedVehicleForBooking(null);
            setPendingBooking(bookingData);
          }}
        />
      )}

      {/* Payment Modal */}
      {pendingBooking && (
        <PaymentModal
          booking={pendingBooking}
          onClose={() => setPendingBooking(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Confirmation Modal */}
      {confirmedBooking && (
        <ConfirmationModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
        />
      )}

      <ChatWidget />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 text-center">
        <p>© 2026 DriveEase Car Rental System — Cloudflare Edge Ready Architecture</p>
      </footer>
    </div>
  );
};


export const App: React.FC = () => (
  <AuthProvider>
    <AppInner />
  </AuthProvider>
);

export default App;
