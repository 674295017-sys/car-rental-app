import React, { useEffect, useRef, useState } from 'react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = ['มีรถอะไรให้เช่าบ้าง?', 'ยกเลิกการจองได้ไหม?', 'ต้องใช้เอกสารอะไร?', 'จ่ายเงินช่องทางไหนได้บ้าง?'];

export const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'สวัสดีครับ ผมคือผู้ช่วย DriveEase 🚗 สอบถามเรื่องการเช่ารถ ราคา สาขา หรือวิธีจองได้เลยครับ' },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, loading]);

  const send = async (text: string) => {
    const content = text.trim().slice(0, 500);
    if (!content || loading) return;
    const next = [...messages, { role: 'user' as const, content }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(1).slice(-10) }),
      });
      const data = await res.json();
      const reply =
        res.status === 429
          ? 'ส่งข้อความถี่เกินไป กรุณารอสักครู่ครับ'
          : data.reply || 'ขออภัย ระบบไม่สามารถตอบได้ในขณะนี้';
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'เชื่อมต่อผู้ช่วย AI ไม่ได้ กรุณาลองใหม่ครับ' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        id="chat-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label="เปิดผู้ช่วย AI"
        className="fixed bottom-5 left-5 sm:left-auto sm:right-5 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-xl shadow-emerald-600/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && <span className="absolute top-1 right-1 w-3 h-3 bg-amber-400 rounded-full ring-2 ring-white animate-pulse" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-3 left-3 sm:left-auto sm:right-5 sm:w-96 z-50 bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden max-h-[70vh]">
          <div className="bg-slate-900 text-white px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">DriveEase Assistant</div>
              <div className="text-[11px] text-emerald-400">● ตอบเฉพาะเรื่องการเช่ารถบนเว็บไซต์นี้</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 min-h-[260px]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-md'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-1 px-3 py-3 bg-white border border-slate-200 rounded-2xl w-16">
                {[0, 150, 300].map((d) => (
                  <span key={d} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            )}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="text-[11px] px-3 py-1.5 rounded-full bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="p-3 border-t border-slate-100 flex gap-2"
          >
            <input
              id="chat-input"
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              placeholder="พิมพ์คำถามเกี่ยวกับการเช่ารถ..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-emerald-600 disabled:bg-slate-200 text-white flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
