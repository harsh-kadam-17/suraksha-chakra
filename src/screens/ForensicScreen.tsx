import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield } from 'lucide-react';

const STATUS_TEXTS = [
  "Scrubbing PII...",
  "Anonymizing Identity...",
  "Generating Zero-Knowledge Proof...",
  "Encrypting Artifacts..."
];

interface Props {
  onComplete: () => void;
}

export function ForensicScreen({ onComplete }: Props) {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % STATUS_TEXTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 relative flex flex-col items-center justify-center p-6 sm:p-12 z-10 pt-20">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px] z-0" />
      
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center z-10 mb-12">
        {/* Pulse Rings */}
        <motion.div
          animate={{ scale: [0.8, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full border border-tertiary-container/30"
        />
        <motion.div
          animate={{ scale: [0.8, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1 }}
          className="absolute inset-4 rounded-full border border-tertiary-container/20"
        />
        
        {/* Core Structure */}
        <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-surface-container-highest border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-br from-tertiary/10 to-transparent opacity-50" />
          
          {/* Rotating SVG Nodes */}
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-full h-full opacity-40"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" className="text-tertiary" />
            <circle cx="20" cy="20" r="2" className="fill-tertiary" />
            <circle cx="80" cy="30" r="1.5" className="fill-tertiary" />
            <circle cx="70" cy="80" r="2.5" className="fill-tertiary" />
            <circle cx="30" cy="70" r="1" className="fill-tertiary" />
          </motion.svg>

          {/* Scan line */}
          <motion.div
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-tertiary/50 to-transparent"
          />

          <Shield className="text-tertiary drop-shadow-[0_0_15px_rgba(90,233,172,0.6)]" size={64} />
        </div>
      </div>

      <div className="text-center z-10 max-w-md w-full">
        <h2 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">Forensic Engine Active</h2>
        <p className="text-base text-on-surface-variant opacity-80 mb-6">Securing digital footprint...</p>
        
        <div className="h-12 relative flex items-center justify-center w-full bg-surface-container-high rounded-lg border border-white/5 shadow-inner overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-semibold text-tertiary tracking-widest uppercase absolute w-full text-center"
            >
              {STATUS_TEXTS[textIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
        
        <button 
          onClick={onComplete}
          className="mt-8 text-sm font-semibold text-primary/70 hover:text-primary transition-colors underline underline-offset-4"
        >
          Proceed to Routing
        </button>
      </div>
    </div>
  );
}
