import { useState, useEffect } from 'react';
import { Lock, EyeOff, BellRing, Smartphone, Shield, KeyRound, ChevronRight, X, Phone, Trash2 } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

export function SettingsScreen() {
  const [showContacts, setShowContacts] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('trusted_contacts');
    if (saved) {
      try { setContacts(JSON.parse(saved)); } catch (e) {}
    }

    if (sessionStorage.getItem('open_trusted_contacts') === 'true') {
      setShowContacts(true);
      sessionStorage.removeItem('open_trusted_contacts');
    }
  }, []);

  const saveContacts = (newContacts: Contact[]) => {
    setContacts(newContacts);
    localStorage.setItem('trusted_contacts', JSON.stringify(newContacts));
  };

  const addContact = () => {
    if (!newName.trim() || !newPhone.trim()) return;
    const newContact: Contact = {
      id: Date.now().toString(),
      name: newName.trim(),
      phone: newPhone.trim()
    };
    saveContacts([...contacts, newContact]);
    setNewName('');
    setNewPhone('');
  };

  const deleteContact = (id: string) => {
    saveContacts(contacts.filter(c => c.id !== id));
  };

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
          <SettingsItem icon={<Shield size={20} />} title="Trusted Contacts" description="Manage your emergency circle" onClick={() => setShowContacts(true)} />
          <SettingsItem icon={<BellRing size={20} />} title="Silent Alarm" description="Triple-tap power button to alert" isToggle initialOn={true} />
          <SettingsItem icon={<Smartphone size={20} />} title="Auto-Wipe Condition" description="Erase all data after 5 failed attempts" isToggle initialOn={false} />
        </SettingsSection>

        <SettingsSection title="App Data">
          <SettingsItem icon={<Lock size={20} />} title="End-to-End Encryption" description="Keys stored locally in Secure Enclave" isStatus status="Active" />
        </SettingsSection>

      </div>
      {/* Trusted Contacts Modal */}
      {showContacts && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-4 text-on-surface bg-background shadow-2xl border border-primary/20">
            <button 
              onClick={() => setShowContacts(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mt-2">
              <Shield className="text-primary" size={24} />
              <h2 className="text-xl font-bold text-primary">Trusted Contacts</h2>
            </div>
            
            <div className="space-y-3 mt-2 max-h-64 overflow-y-auto pr-2 hide-scrollbar">
              {contacts.length === 0 ? (
                <p className="text-sm text-on-surface-variant text-center py-4">No trusted contacts added yet.</p>
              ) : (
                contacts.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-container border border-white/5">
                    <div>
                      <p className="text-sm font-bold text-on-surface">{c.name}</p>
                      <p className="text-xs text-on-surface-variant">{c.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a 
                        href={`tel:${c.phone}`} 
                        className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                        title="Call Contact"
                      >
                        <Phone size={16} />
                      </a>
                      <button 
                        onClick={() => deleteContact(c.id)}
                        className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center text-error hover:bg-error/20 transition-colors"
                        title="Delete Contact"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-2 space-y-2 border-t border-white/10 pt-4">
              <input 
                type="text" 
                placeholder="Contact Name" 
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full bg-surface-container-highest text-sm text-on-surface rounded-lg border border-white/10 px-3 py-2 outline-none focus:border-primary transition-colors"
              />
              <div className="flex gap-2">
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  className="flex-1 bg-surface-container-highest text-sm text-on-surface rounded-lg border border-white/10 px-3 py-2 outline-none focus:border-primary transition-colors"
                  onKeyDown={e => { if (e.key === 'Enter') addContact(); }}
                />
                <button 
                  onClick={addContact}
                  className="px-4 bg-primary text-on-primary rounded-lg font-bold text-sm flex items-center justify-center hover:bg-primary/90 transition-colors active:scale-95"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
  onClick?: () => void;
}

function SettingsItem({ icon, title, description, isToggle, initialOn = false, isStatus, status, onClick }: SettingsItemProps) {
  const [isOn, setIsOn] = useState(initialOn);

  return (
    <div 
      className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer"
      onClick={() => {
        if (isToggle) setIsOn(!isOn);
        if (onClick) onClick();
      }}
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
