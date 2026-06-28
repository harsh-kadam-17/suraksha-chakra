import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { TopBar } from './components/TopBar';
import { HubScreen } from './screens/HubScreen';
import { ForensicScreen } from './screens/ForensicScreen';
import { RoutingScreen } from './screens/RoutingScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ResourcesScreen } from './screens/ResourcesScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ScreenState, SignalLocation } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('hub');
  const [activeSignalId, setActiveSignalId] = useState<string | null>(null);
  const [activeSignalLocation, setActiveSignalLocation] = useState<SignalLocation | null>(null);

  const handleHubAction = (signalId: string, location: SignalLocation) => {
    setActiveSignalId(signalId || null);
    setActiveSignalLocation(location);
    setCurrentScreen('forensic');
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
        <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </div>

      <main className="flex-1 flex flex-col relative min-h-screen w-full md:ml-64">
        {/* Top Bar for Mobile & Desktop (except routing which has special mobile header) */}
        {currentScreen !== 'routing' && <TopBar onNavigate={setCurrentScreen} />}

        <div className="flex-1 overflow-y-auto pb-[90px] md:pb-0 relative hide-scrollbar">
          {currentScreen === 'hub' && <HubScreen onAction={handleHubAction} />}
          {currentScreen === 'routing' && (
            <RoutingScreen signalId={activeSignalId} signalLocation={activeSignalLocation} />
          )}
          {currentScreen === 'resources' && <ResourcesScreen />}
          {currentScreen === 'settings' && <SettingsScreen />}
          {currentScreen === 'profile' && <ProfileScreen />}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
        </div>
      </main>
    </div>
  );
}
