import { User, Mail, Phone, ShieldCheck, Edit3 } from 'lucide-react';

export function ProfileScreen() {
  return (
    <div className="flex-1 w-full max-w-screen-md mx-auto px-5 py-8 md:pt-24 z-10 relative">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">My Profile</h1>
          <p className="text-sm text-on-surface-variant">Manage your identity and trusted details.</p>
        </div>
        <button className="flex items-center gap-2 bg-surface-bright text-on-surface px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
          <Edit3 size={16} />
          <span className="text-sm font-semibold">Edit</span>
        </button>
      </div>

      <div className="flex flex-col items-center mb-10">
        <div className="w-24 h-24 rounded-full bg-surface-bright border-4 border-surface-container-highest flex items-center justify-center text-on-surface-variant mb-4 shadow-lg">
          <User size={48} />
        </div>
        <h2 className="text-xl font-bold text-on-surface">Anonymous User</h2>
        <span className="text-xs font-semibold text-tertiary bg-tertiary/10 px-3 py-1 rounded-full mt-2 border border-tertiary/20 flex items-center gap-1">
          <ShieldCheck size={14} />
          Identity Masked
        </span>
      </div>

      <div className="space-y-4 pb-12">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Contact Information</h3>
        <div className="bg-surface-container-high rounded-xl border border-white/5 overflow-hidden shadow-sm">
          <ProfileField icon={<Mail size={20} />} label="Email" value="user@masked.secure" />
          <ProfileField icon={<Phone size={20} />} label="Recovery Phone" value="***-***-1234" />
        </div>

        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mt-8 mb-2">Security Status</h3>
        <div className="bg-surface-container-high rounded-xl border border-white/5 overflow-hidden shadow-sm p-5 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-on-surface">Forensic Engine</span>
            <span className="text-xs font-semibold text-tertiary">Active</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-on-surface">Decoy PIN</span>
            <span className="text-xs font-semibold text-on-surface-variant">Not Configured</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-on-surface">Data Wipe</span>
            <span className="text-xs font-semibold text-error">Armed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-white/5 last:border-0">
      <div className="w-10 h-10 rounded-full bg-surface-bright flex items-center justify-center text-on-surface-variant flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[12px] text-on-surface-variant font-medium">{label}</p>
        <p className="text-sm font-bold text-on-surface">{value}</p>
      </div>
    </div>
  );
}
