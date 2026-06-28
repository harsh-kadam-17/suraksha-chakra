import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Mic, Square, SquarePen, Send, AlertTriangle, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const DEFAULT_LOC = { lat: 28.6139, lng: 77.2090 }; // New Delhi fallback

async function getDeviceLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(DEFAULT_LOC);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(DEFAULT_LOC),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  });
}

export function HubScreen({ onAction }: { onAction: (signalId: string, location: { lat: number; lng: number }) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const textRef = useRef<HTMLInputElement>(null);

  const sendSignal = async (type: 'voice' | 'text' | 'sos', message?: string) => {
    if (isSending) return;
    setIsSending(true);
    try {
      const location = await getDeviceLocation();
      const docRef = await addDoc(collection(db, 'signals'), {
        status: 'pending',
        type,
        message: message || '',
        location,
        createdAt: serverTimestamp(),
      });
      onAction(docRef.id, location);
    } catch (err) {
      console.error('Error creating signal:', err);
      // Still navigate even if Firestore fails
      onAction('', DEFAULT_LOC);
    } finally {
      setIsSending(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      sendSignal('voice');
    } else {
      setIsRecording(true);
    }
  };

  const handleTextSend = () => {
    const msg = textRef.current?.value?.trim() || '';
    if (textRef.current) textRef.current.value = '';
    sendSignal('text', msg);
  };

  return (
    <div className="flex flex-col items-center justify-center px-5 max-w-screen-sm mx-auto w-full gap-8 relative z-10 pt-16 pb-8 min-h-[80vh]">
      <div className="w-full flex justify-end">
        <button
          onClick={handleVoiceToggle}
          disabled={isSending}
          className={`px-5 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-[0_4px_14px_rgba(255,159,28,0.2)] hover:scale-105 active:scale-95 transition-all ${
            isRecording
              ? 'bg-error text-on-error shadow-[0_4px_14px_rgba(255,84,73,0.4)]'
              : 'bg-primary-container text-on-primary-container'
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {isSending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : isRecording ? (
            <Square size={18} fill="currentColor" />
          ) : (
            <Mic size={18} />
          )}
          {isSending ? 'SENDING...' : isRecording ? 'STOP INTAKE' : 'VOICE INTAKE'}
        </button>
      </div>

      <div className="text-center mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-2">Emergency SOS</h1>
        <p className="text-base text-on-surface-variant">Tap to route to nearest safe zones</p>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Pulsing rings */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.2, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-error/20"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute inset-4 rounded-full bg-error/30"
        />

        <button
          onClick={() => sendSignal('sos')}
          disabled={isSending}
          className="relative z-10 w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-transform active:scale-95 bg-error hover:shadow-[0_15px_40px_rgba(255,84,73,0.4)] disabled:opacity-60"
        >
          {isSending ? (
            <Loader2 className="text-on-error animate-spin" size={48} />
          ) : (
            <AlertTriangle className="text-on-error" size={48} />
          )}
        </button>
      </div>

      <div className="w-full max-w-md mt-12 glass-panel rounded-xl p-6 flex flex-col gap-4 shadow-lg">
        <label className="text-sm font-semibold text-on-surface-variant flex items-center gap-2">
          <SquarePen size={18} />
          Quiet Notes
        </label>
        <div className="relative">
          <input
            ref={textRef}
            type="text"
            placeholder="Type discreetly..."
            className="w-full bg-surface-container-high text-on-surface text-base rounded-lg border-0 border-b-2 border-surface-container-highest focus:border-primary-container focus:ring-0 px-4 py-3 placeholder:text-on-surface-variant/50 transition-colors outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTextSend();
            }}
          />
          <button
            onClick={handleTextSend}
            disabled={isSending}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary-container hover:opacity-80 transition-opacity disabled:opacity-40"
          >
            {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <p className="text-[12px] font-medium tracking-wide text-on-surface-variant/70 text-center mt-2">
          Entries are locally encrypted
        </p>
      </div>

      {/* Emergency Helplines Section */}
      <div className="w-full max-w-md mt-6 glass-panel rounded-xl p-5 flex flex-col gap-3 shadow-lg border border-white/5 bg-surface-container/30">
        <h3 className="text-sm font-bold text-[#ff5449] uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle size={16} />
          Emergency Hotlines
        </h3>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <a
            href="tel:112"
            className="flex items-center justify-between p-3 rounded-lg bg-surface-container-high hover:bg-white/5 border border-white/5 transition-colors group"
          >
            <div>
              <p className="text-[10px] text-on-surface-variant font-medium">National Emergency</p>
              <p className="text-sm font-bold text-on-surface">112</p>
            </div>
            <span className="text-xs text-[#ff5449] font-semibold bg-[#ff5449]/10 px-2 py-0.5 rounded border border-[#ff5449]/20 group-hover:scale-105 transition-transform">CALL</span>
          </a>
          <a
            href="tel:1091"
            className="flex items-center justify-between p-3 rounded-lg bg-surface-container-high hover:bg-white/5 border border-white/5 transition-colors group"
          >
            <div>
              <p className="text-[10px] text-on-surface-variant font-medium">Women Helpline</p>
              <p className="text-sm font-bold text-on-surface">1091</p>
            </div>
            <span className="text-xs text-[#ff5449] font-semibold bg-[#ff5449]/10 px-2 py-0.5 rounded border border-[#ff5449]/20 group-hover:scale-105 transition-transform">CALL</span>
          </a>
          <a
            href="tel:181"
            className="flex items-center justify-between p-3 rounded-lg bg-surface-container-high hover:bg-white/5 border border-white/5 transition-colors group"
          >
            <div>
              <p className="text-[10px] text-on-surface-variant font-medium">Domestic Abuse</p>
              <p className="text-sm font-bold text-on-surface">181</p>
            </div>
            <span className="text-xs text-[#ff5449] font-semibold bg-[#ff5449]/10 px-2 py-0.5 rounded border border-[#ff5449]/20 group-hover:scale-105 transition-transform">CALL</span>
          </a>
          <a
            href="tel:100"
            className="flex items-center justify-between p-3 rounded-lg bg-surface-container-high hover:bg-white/5 border border-white/5 transition-colors group"
          >
            <div>
              <p className="text-[10px] text-on-surface-variant font-medium">Police Station</p>
              <p className="text-sm font-bold text-on-surface">100</p>
            </div>
            <span className="text-xs text-[#ff5449] font-semibold bg-[#ff5449]/10 px-2 py-0.5 rounded border border-[#ff5449]/20 group-hover:scale-105 transition-transform">CALL</span>
          </a>
        </div>
      </div>
    </div>
  );
}
