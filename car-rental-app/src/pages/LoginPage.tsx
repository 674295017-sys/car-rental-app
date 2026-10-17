import React, { useEffect, useRef, useState } from 'react';
import { Car, ShieldCheck, Sparkles, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

interface LoginPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBack, onSuccess }) => {
  const { loginWithGoogle } = useAuth();
  const btnRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID || CLIENT_ID.startsWith('REPLACE')) {
      setError('ยังไม่ได้ตั้งค่า VITE_GOOGLE_CLIENT_ID กรุณาดูไฟล์ .env.example');
      return;
    }
    let tries = 0;
    const init = () => {
      const g = (window as any).google;
      if (!g?.accounts?.id) {
        if (tries++ < 50) setTimeout(init, 100);
        else setError('โหลด Google Sign-In ไม่สำเร็จ');
        return;
      }
      g.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async (resp: { credential: string }) => {
          setBusy(true);
          setError('');
          try {
            await loginWithGoogle(resp.credential);
            onSuccess();
          } catch (e) {
            setError('เข้าสู่ระบบไม่สำเร็จ: ' + (e as Error).message);
          } finally {
            setBusy(false);
          }
        },
      });
      if (btnRef.current) {
        g.accounts.id.renderButton(btnRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: 'signin_with',
          width: 320,
          locale: 'th',
        });
      }
    };
    init();
  }, [loginWithGoogle, onSuccess]);

  return (
    <main className="flex-1 min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Brand side */}
      <section className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-12 flex-col justify-between">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold">DriveEase</span>
        </div>
        <div className="relative space-y-5">
          <h2 className="text-4xl font-black leading-tight">
            เช่ารถง่าย ปลอดภัย<br />
            <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
              ในไม่กี่คลิก
            </span>
          </h2>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> เข้าสู่ระบบอย่างปลอดภัยด้วยบัญชี Google</li>
            <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-400" /> ผู้ช่วย AI พร้อมตอบคำถามตลอด 24 ชม.</li>
          </ul>
        </div>
        <p className="relative text-xs text-slate-500">© 2026 DriveEase</p>
      </section>

      {/* Form side */}
      <section className="flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 space-y-6">
          <button onClick={onBack} className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> กลับหน้าหลัก
          </button>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">เข้าสู่ระบบ</h1>
            <p className="text-xs text-slate-500">ใช้บัญชี Google ของคุณเพื่อจองรถและติดตามการจอง</p>
          </div>

          <div className="flex justify-center min-h-[44px]">
            <div ref={btnRef} id="google-signin-button" />
          </div>

          {busy && <p className="text-center text-xs text-emerald-700">กำลังตรวจสอบบัญชี...</p>}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-[11px] text-center text-slate-400">
            การเข้าสู่ระบบถือว่าคุณยอมรับเงื่อนไขการใช้บริการและนโยบายความเป็นส่วนตัว (PDPA)
          </p>
        </div>
      </section>
    </main>
  );
};
