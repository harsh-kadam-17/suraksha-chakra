export type ScreenState = 'login' | 'hub' | 'forensic' | 'routing' | 'settings' | 'resources' | 'profile';

export interface SignalLocation {
  lat: number;
  lng: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  pin: string;
}
