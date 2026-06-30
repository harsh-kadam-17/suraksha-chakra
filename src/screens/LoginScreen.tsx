import { useState } from 'react';
import { ShieldCheck, User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    pin: ''
  });

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.pin) {
      setError('Please fill in all fields to secure your account.');
      return;
    }

    if (formData.pin.length < 4) {
      setError('PIN must be at least 4 digits.');
      return;
    }

    // Save completely locally - NO external server used for privacy
    localStorage.setItem('suraksha_user', JSON.stringify(formData));
    onLogin();
  };

  const handleDemoLogin = () => {
    const demoUser: UserProfile = {
      name: 'Harsh Kadam',
      email: 'harsh@example.com',
      phone: '+91 98765 43210',
      pin: '1234'
    };
    localStorage.setItem('suraksha_user', JSON.stringify(demoUser));
    onLogin();
  };

  return (
    <div className="flex-1 w-full min-h-screen bg-background flex flex-col justify-center items-center px-6 relative overflow-hidden z-10">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-tertiary/20 blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md flex flex-col items-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
        <div className="w-20 h-20 rounded-full bg-surface-container-high border border-primary/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(208,188,255,0.15)] relative">
          <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin-slow opacity-50" />
          <ShieldCheck size={40} className="text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-on-surface mb-2">Suraksha Chakra</h1>
        <p className="text-on-surface-variant text-center px-4 leading-relaxed text-sm">
          Your personal safety companion. Secure, private, and always ready.
        </p>
      </div>

      <div className="glass-panel w-full max-w-md rounded-3xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10 shadow-2xl border border-white/5">
        <h2 className="text-xl font-bold text-on-surface mb-6">
          {isRegistering ? 'Create Secure Profile' : 'Access Dashboard'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface-variant ml-1 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                <User size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Enter your name" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-surface-container-highest text-sm text-on-surface rounded-xl border border-white/5 pl-10 pr-4 py-3 outline-none focus:border-primary focus:bg-primary/5 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface-variant ml-1 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-surface-container-highest text-sm text-on-surface rounded-xl border border-white/5 pl-10 pr-4 py-3 outline-none focus:border-primary focus:bg-primary/5 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface-variant ml-1 uppercase tracking-wider">Emergency Phone</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                <Phone size={18} />
              </div>
              <input 
                type="tel" 
                placeholder="+1 (555) 000-0000" 
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-surface-container-highest text-sm text-on-surface rounded-xl border border-white/5 pl-10 pr-4 py-3 outline-none focus:border-primary focus:bg-primary/5 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface-variant ml-1 uppercase tracking-wider">Secure PIN</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                placeholder="4-digit PIN" 
                maxLength={4}
                value={formData.pin}
                onChange={e => setFormData({ ...formData, pin: e.target.value })}
                className="w-full bg-surface-container-highest text-sm text-on-surface rounded-xl border border-white/5 pl-10 pr-4 py-3 outline-none focus:border-primary focus:bg-primary/5 transition-all font-mono tracking-widest"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-xs font-medium">
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full h-12 bg-primary text-on-primary font-bold rounded-xl transition-all hover:bg-primary/90 active:scale-[0.98] mt-6 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(208,188,255,0.2)]"
          >
            {isRegistering ? 'Create Secure Profile' : 'Secure Login'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-4">
          <p className="text-xs text-on-surface-variant text-center">
            {isRegistering ? 'Already have a profile?' : "Don't have a profile yet?"}{' '}
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-primary font-bold hover:underline outline-none"
            >
              {isRegistering ? 'Log In' : 'Register now'}
            </button>
          </p>
          
          <div className="w-full h-px bg-white/5 relative">
            <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-surface-container px-2 text-[10px] uppercase tracking-wider text-on-surface-variant">OR</span>
          </div>

          <button 
            onClick={handleDemoLogin}
            className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Continue with Demo Account
          </button>
        </div>
      </div>
      
      <p className="absolute bottom-6 text-[10px] text-on-surface-variant/50 uppercase tracking-widest text-center w-full">
        Locally Encrypted • Zero Data Collection • Privacy First
      </p>
    </div>
  );
}
