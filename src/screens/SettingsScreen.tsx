import { useState } from 'react';
import { Lock, EyeOff, BellRing, Smartphone, Shield, KeyRound, ChevronRight } from 'lucide-react';

export function SettingsScreen() {
  return (
    <div className="flex-1 w-full max-w-screen-md mx-auto px-5 py-8 md:pt-24 z-10 relative">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">Security & Settings</h1>
        <p className="text-sm text-on-surface-variant">Configure your safety preferences and stealth modes.</p>
      </div>

      <div className="space-y-6 pb-12">
        <SettingsSection title="Stealth & Privacy">
          <SettingsItem icon={<EyeOff size={20} />} title="Camouflage Mode" description="Disguise app as a calculator" isToggle initialOn={true} />
          <SettingsItem icon={<KeyRound size={20} />} title="Decoy PIN" description="Enter fake PIN to show safe data" isToggle initialOn={false} />
          <SettingsItem icon={<Lock size={20} />} title="Auto-Lock" description="Lock immediately on screen off" isToggle initialOn={true} />
        </SettingsSection>

        <SettingsSection title="Emergency Actions">
          <SettingsItem icon={<Shield size={20} />} title="Trusted Contacts" description="Manage your emergency circle" />
          <SettingsItem icon={<BellRing size={20} />} title="Silent Alarm" description="Triple-tap power button to alert" isToggle initialOn={true} />
          <SettingsItem icon={<Smartphone size={20} />} title="Auto-Wipe Condition" description="Erase all data after 5 failed attempts" isToggle initialOn={false} />
        </SettingsSection>

        <SettingsSection title="App Data">
          <SettingsItem icon={<Lock size={20} />} title="End-to-End Encryption" description="Keys stored locally in Secure Enclave" isStatus status="Active" />
        </SettingsSection>

      </div>
    </div>
  );
}

function SettingsSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">{title}</h3>
      <div className="bg-surface-container-high rounded-xl border border-white/5 overflow-hidden shadow-sm">
        {children}
      </div>
    </div>
  );
}

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isToggle?: boolean;
  initialOn?: boolean;
  isStatus?: boolean;
  status?: string;
}

function SettingsItem({ icon, title, description, isToggle, initialOn = false, isStatus, status }: SettingsItemProps) {
  const [isOn, setIsOn] = useState(initialOn);

  return (
    <div 
      className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer"
      onClick={() => isToggle && setIsOn(!isOn)}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-surface-bright flex items-center justify-center text-on-surface-variant">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-bold text-on-surface">{title}</h4>
          <p className="text-[12px] text-on-surface-variant mt-0.5">{description}</p>
        </div>
      </div>
      
      {isToggle ? (
        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isOn ? 'bg-tertiary' : 'bg-surface-bright'}`}>
          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isOn ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
      ) : isStatus ? (
        <span className="text-xs font-semibold text-tertiary bg-tertiary/10 px-2 py-1 rounded-md border border-tertiary/20">
          {status}
        </span>
      ) : (
        <ChevronRight size={20} className="text-on-surface-variant" />
      )}
    </div>
  );
}
