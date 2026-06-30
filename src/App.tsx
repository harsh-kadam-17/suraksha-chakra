import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { TopBar } from './components/TopBar';
import { HubScreen } from './screens/HubScreen';
import { ForensicScreen } from './screens/ForensicScreen';
import { RoutingScreen } from './screens/RoutingScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ResourcesScreen } from './screens/ResourcesScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { LoginScreen } from './screens/LoginScreen';
import { ScreenState, SignalLocation } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('hub');
  const [activeSignalId, setActiveSignalId] = useState<string | null>(null);
  const [activeSignalLocation, setActiveSignalLocation] = useState<SignalLocation | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('suraksha_user');
    if (!user) {
      setCurrentScreen('login');
    }
  }, []);

  const wipeSession = () => {
    setActiveSignalId(null);
    setActiveSignalLocation(null);
    setCurrentScreen('hub');
  };

  const handleHubAction = (signalId: string, location: SignalLocation) => {
    setActiveSignalId(signalId || null);
    setActiveSignalLocation(location);
    setCurrentScreen('routing');
  };

  // Forensic screen is an immersive overlay that hides standard navigation
  if (currentScreen === 'forensic') {
    return (
      <div className="bg-background text-on-surface min-h-screen flex flex-col font-sans overflow-hidden">
        <TopBar onNavigate={setCurrentScreen} hideNav />
        <ForensicScreen onComplete={() => setCurrentScreen('routing')} />
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row antialiased select-none font-sans overflow-hidden">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        {currentScreen !== 'login' && <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} onWipeSession={wipeSession} />}
      </div>

      <main className={`flex-1 flex flex-col relative min-h-screen w-full ${currentScreen !== 'login' ? 'md:ml-64' : ''}`}>
        {/* Top Bar for Mobile & Desktop (except routing and login which have special headers/no headers) */}
        {currentScreen !== 'routing' && currentScreen !== 'login' && <TopBar onNavigate={setCurrentScreen} currentScreen={currentScreen} />}

        <div className="flex-1 overflow-y-auto pb-[90px] md:pb-0 relative hide-scrollbar">
          {currentScreen === 'hub' && <HubScreen onAction={handleHubAction} onNavigate={setCurrentScreen} />}
          {currentScreen === 'routing' && (
            <RoutingScreen signalId={activeSignalId} signalLocation={activeSignalLocation} onWipeSession={wipeSession} />
          )}
          {currentScreen === 'resources' && <ResourcesScreen />}
          {currentScreen === 'settings' && <SettingsScreen />}
          {currentScreen === 'profile' && <ProfileScreen onNavigate={setCurrentScreen} />}
          {currentScreen === 'login' && <LoginScreen onLogin={() => setCurrentScreen('hub')} />}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          {currentScreen !== 'login' && <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} onWipeSession={wipeSession} />}
        </div>
      </main>
    </div>
  );
}
