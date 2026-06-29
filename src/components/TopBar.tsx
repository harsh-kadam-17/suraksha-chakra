import { Globe, User, ShieldAlert, ArrowLeft } from 'lucide-react';
import { ScreenState } from '../types';

interface Props {
  onNavigate: (s: ScreenState) => void;
  hideNav?: boolean;
  currentScreen?: ScreenState;
}

export function TopBar({ onNavigate, hideNav, currentScreen }: Props) {
  const showBack = currentScreen && currentScreen !== 'hub';
  return (
    <header className="fixed md:absolute top-0 w-full bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-3xl border-b border-white/10 shadow-sm transition-opacity duration-200 flex justify-between items-center px-5 h-16 z-50">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            onClick={() => onNavigate('hub')}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors active:scale-95"
            title="Back to Home"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-semibold hidden sm:inline">Home</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 hover:opacity-80 cursor-pointer">
            <Globe className="text-primary" size={20} />
            <span className="text-sm font-semibold text-on-surface-variant hidden sm:inline-block">EN/MR</span>
          </div>
        )}
      </div>
      <button 
        onClick={() => onNavigate('hub')}
        className="text-xl font-bold text-primary tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity"
        title="Go to Home"
      >
        Suraksha-Chakra
      </button>
      <div className="flex items-center gap-4">
        {!hideNav && (
          <button onClick={() => onNavigate('forensic')} className="text-error animate-pulse md:hidden" title="Emergency">
            <ShieldAlert size={20} />
          </button>
        )}
        <button onClick={() => onNavigate('profile')} className="hover:opacity-80 cursor-pointer text-on-surface-variant flex items-center justify-center" title="Profile">
          <User size={24} />
        </button>
      </div>
    </header>
  );
}
