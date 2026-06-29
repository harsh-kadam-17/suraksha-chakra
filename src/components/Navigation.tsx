import { Shield, BookOpen, Scale, Settings, LogOut, Trash2 } from 'lucide-react';
import { ScreenState } from '../types';

interface Props {
  currentScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
  onWipeSession: () => void;
}

export function Navigation({ currentScreen, onNavigate, onWipeSession }: Props) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col p-4 bg-surface-container-high h-screen w-64 shadow-2xl z-40 fixed left-0 top-0">
        <div className="mb-8 px-4 py-2">
          <span className="text-xl font-semibold text-primary">Safety Utilities</span>
        </div>
        <nav className="flex-1 space-y-2">
          <NavItem icon={<Shield size={20} />} label="Home" active={currentScreen === 'hub'} onClick={() => onNavigate('hub')} />
          <NavItem icon={<BookOpen size={20} />} label="Resources" active={currentScreen === 'resources'} onClick={() => onNavigate('resources')} />
          <NavItem icon={<Scale size={20} />} label="Legal" active={currentScreen === 'routing'} onClick={() => onNavigate('routing')} />
          <NavItem icon={<Settings size={20} />} label="Settings" active={currentScreen === 'settings'} onClick={() => onNavigate('settings')} />
        </nav>
        <div className="mt-auto space-y-2 border-t border-white/10 pt-4">
          <button onClick={() => onNavigate('hub')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-on-surface hover:bg-white/5 transition-colors">
            <LogOut size={20} />
            <span className="text-sm font-semibold">Quick Exit</span>
          </button>
          <button onClick={onWipeSession} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-error hover:bg-error/10 transition-colors group">
            <Trash2 size={20} className="group-hover:text-error" />
            <span className="text-sm font-bold group-hover:text-error">Wipe Session</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 pb-8 bg-surface/80 dark:bg-surface-container/80 backdrop-blur-3xl border-t border-white/10 shadow-lg rounded-t-xl">
        <MobileNavItem icon={<Shield size={24} />} label="Home" active={currentScreen === 'hub'} onClick={() => onNavigate('hub')} />
        <MobileNavItem icon={<BookOpen size={24} />} label="Resources" active={currentScreen === 'resources'} onClick={() => onNavigate('resources')} />
        <MobileNavItem icon={<Scale size={24} />} label="Legal" active={currentScreen === 'routing'} onClick={() => onNavigate('routing')} />
        <MobileNavItem icon={<Settings size={24} />} label="Settings" active={currentScreen === 'settings'} onClick={() => onNavigate('settings')} />
      </nav>
    </>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        active ? 'text-primary bg-primary/10' : 'text-on-surface hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

function MobileNavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 active:scale-95 transition-transform ${
        active ? 'bg-primary-container text-on-primary-container rounded-xl px-4 py-1 w-20' : 'text-on-surface-variant hover:text-primary'
      }`}
    >
      <div className="mb-1">{icon}</div>
      <span className={`text-[12px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </button>
  );
}
