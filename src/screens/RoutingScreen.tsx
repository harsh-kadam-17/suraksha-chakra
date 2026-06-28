import { MapPin, ShieldCheck, Scale, Clock, Trash2 } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useState } from 'react';
import { collection, addDoc, onSnapshot, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SignalLocation } from '../types';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

const DEFAULT_LOC = { lat: 28.6139, lng: 77.2090 }; // New Delhi fallback

interface SecureMapContentProps {
  handshakeStatus: 'pending' | 'accepted';
  senderLocation: google.maps.LatLngLiteral;
}

function SecureMapContent({ handshakeStatus, senderLocation }: SecureMapContentProps) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const placesLib = useMapsLibrary('places');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  const [policeLocation, setPoliceLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [hospitalLocation, setHospitalLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [legalLocation, setLegalLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [policeName, setPoliceName] = useState<string>('');
  const [hospitalName, setHospitalName] = useState<string>('');
  const [legalName, setLegalName] = useState<string>('');

  // Center map on sender's location immediately
  useEffect(() => {
    if (map && senderLocation) {
      map.panTo(senderLocation);
      map.setZoom(15);
    }
  }, [map, senderLocation]);

  // Find nearby places relative to the sender's location
  useEffect(() => {
    if (!placesLib || !map || !senderLocation) return;

    const service = new placesLib.PlacesService(map);

    service.nearbySearch({
      location: senderLocation,
      radius: 5000,
      keyword: 'police station'
    }, (results, status) => {
      if (status === placesLib.PlacesServiceStatus.OK && results && results[0]) {
        const place = results[0];
        if (place.geometry && place.geometry.location) {
          setPoliceLocation({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          });
          setPoliceName(place.name || 'Police Station');
        }
      }
    });

    service.nearbySearch({
      location: senderLocation,
      radius: 5000,
      keyword: 'hospital'
    }, (results, status) => {
      if (status === placesLib.PlacesServiceStatus.OK && results && results[0]) {
        const place = results[0];
        if (place.geometry && place.geometry.location) {
          setHospitalLocation({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          });
          setHospitalName(place.name || 'Hospital');
        }
      }
    });

    service.nearbySearch({
      location: senderLocation,
      radius: 5000,
      keyword: 'legal clinic OR lawyer OR NGO'
    }, (results, status) => {
      if (status === placesLib.PlacesServiceStatus.OK && results && results[0]) {
        const place = results[0];
        if (place.geometry && place.geometry.location) {
          setLegalLocation({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          });
          setLegalName(place.name || 'Legal Aid');
        }
      }
    });
  }, [placesLib, map, senderLocation]);

  // Draw routing polylines
  useEffect(() => {
    const shouldRouteLegal = handshakeStatus === 'accepted' && legalLocation;

    if (!routesLib || !map || !senderLocation || (!policeLocation && !hospitalLocation && !shouldRouteLegal)) {
      if (map && senderLocation && (policeLocation || hospitalLocation || shouldRouteLegal)) {
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(senderLocation);
        if (policeLocation) bounds.extend(policeLocation);
        if (hospitalLocation) bounds.extend(hospitalLocation);
        if (shouldRouteLegal) bounds.extend(legalLocation!);
        map.fitBounds(bounds, { top: 100, bottom: 150, left: 50, right: 50 });
      }
      return;
    }

    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(senderLocation);

    const promises = [];
    if (policeLocation) {
      bounds.extend(policeLocation);
      promises.push(
        routesLib.Route.computeRoutes({
          origin: senderLocation,
          destination: policeLocation,
          travelMode: 'DRIVING',
          fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
        }).then(({ routes }) => {
          if (routes?.[0]) {
            const p = routes[0].createPolylines();
            p.forEach(l => {
              l.setOptions({ strokeColor: '#3b82f6', strokeWeight: 5, strokeOpacity: 0.9, zIndex: 10 });
              l.setMap(map);
            });
            polylinesRef.current.push(...p);
          }
        }).catch(console.warn)
      );
    }

    if (hospitalLocation) {
      bounds.extend(hospitalLocation);
      promises.push(
        routesLib.Route.computeRoutes({
          origin: senderLocation,
          destination: hospitalLocation,
          travelMode: 'DRIVING',
          fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
        }).then(({ routes }) => {
          if (routes?.[0]) {
            const p = routes[0].createPolylines();
            p.forEach(l => {
              l.setOptions({ strokeColor: '#ef4444', strokeWeight: 5, strokeOpacity: 0.9, zIndex: 10 });
              l.setMap(map);
            });
            polylinesRef.current.push(...p);
          }
        }).catch(console.warn)
      );
    }

    if (shouldRouteLegal) {
      bounds.extend(legalLocation!);
      promises.push(
        routesLib.Route.computeRoutes({
          origin: senderLocation,
          destination: legalLocation!,
          travelMode: 'DRIVING',
          fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
        }).then(({ routes }) => {
          if (routes?.[0]) {
            const p = routes[0].createPolylines();
            p.forEach(l => {
              l.setOptions({ strokeColor: '#eab308', strokeWeight: 5, strokeOpacity: 0.9, zIndex: 10 });
              l.setMap(map);
            });
            polylinesRef.current.push(...p);
          }
        }).catch(console.warn)
      );
    }

    Promise.all(promises).then(() => {
      map.fitBounds(bounds, { top: 100, bottom: 150, left: 50, right: 50 });
    });

    return () => polylinesRef.current.forEach(p => p.setMap(null));
  }, [routesLib, map, senderLocation, policeLocation, hospitalLocation, legalLocation, handshakeStatus]);

  return (
    <>
      {/* Sender's live location marker (Primary Purple) */}
      <AdvancedMarker position={senderLocation}>
        <Pin background="#7d52b3" glyphColor="#ffffff" borderColor="#7d52b3" />
      </AdvancedMarker>
      {policeLocation && (
        <AdvancedMarker position={policeLocation}>
          <Pin background="#3b82f6" glyphColor="#ffffff" borderColor="#3b82f6" />
        </AdvancedMarker>
      )}
      {hospitalLocation && (
        <AdvancedMarker position={hospitalLocation}>
          <Pin background="#ef4444" glyphColor="#ffffff" borderColor="#ef4444" />
        </AdvancedMarker>
      )}
      {handshakeStatus === 'accepted' && legalLocation && (
        <AdvancedMarker position={legalLocation}>
          <Pin background="#10b981" glyphColor="#ffffff" borderColor="#10b981" />
        </AdvancedMarker>
      )}
    </>
  );
}

interface LeafletMapFallbackProps {
  senderLocation: { lat: number; lng: number };
  handshakeStatus: 'pending' | 'accepted';
}

function LeafletMapFallback({ senderLocation, handshakeStatus }: LeafletMapFallbackProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) {
      console.warn("Leaflet library not loaded yet.");
      return;
    }

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([senderLocation.lat, senderLocation.lng], 14);
    mapRef.current = map;

    // CartoDB Positron Light tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    // User/Sender marker: Pulsing amber circle
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="relative w-8 h-8 flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-[#ff9f1c]/30 animate-ping"></div>
          <div class="absolute w-4 h-4 rounded-full bg-[#ff9f1c] border-2 border-white shadow-lg"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // Custom emergency icons
    const createEmergencyIcon = (color: string, letter: string) => L.divIcon({
      className: 'custom-emergency-marker',
      html: `
        <div class="w-8 h-8 rounded-full flex flex-col items-center justify-center border-2 border-white shadow-lg text-white font-bold text-xs" style="background-color: ${color}">
          ${letter}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // Add user marker
    L.marker([senderLocation.lat, senderLocation.lng], { icon: userIcon })
      .bindPopup("<div style='padding: 2px 6px;'><b>Your Current Location</b><br/>Transmitting live telemetry...</div>")
      .addTo(map);

    // Calculated offsets for mock nearby safe zones
    const policeLoc: [number, number] = [senderLocation.lat + 0.0035, senderLocation.lng - 0.003];
    const hospitalLoc: [number, number] = [senderLocation.lat - 0.0025, senderLocation.lng + 0.004];
    const legalLoc: [number, number] = [senderLocation.lat + 0.0018, senderLocation.lng + 0.0032];

    // Add Police Station marker
    L.marker(policeLoc, { icon: createEmergencyIcon('#FF5449', 'P') })
      .bindPopup("<div style='padding: 2px 6px;'><b>Police Station (Safe Zone)</b><br/>Primary routing node connected.</div>")
      .addTo(map);

    // Add Hospital marker
    L.marker(hospitalLoc, { icon: createEmergencyIcon('#FFBF1C', 'H') })
      .bindPopup("<div style='padding: 2px 6px;'><b>Emergency Hospital</b><br/>Medical emergency node active.</div>")
      .addTo(map);

    // Add Legal Aid Clinic marker
    const legalMarker = L.marker(legalLoc, { icon: createEmergencyIcon('#5ae9ac', 'L') })
      .bindPopup(handshakeStatus === 'pending'
        ? "<div style='padding: 2px 6px;'><b>Legal Clinic</b><br/>Awaiting secure handshake...</div>"
        : "<div style='padding: 2px 6px;'><b>Legal Clinic (Connected)</b><br/>Secure handshake established.</div>")
      .addTo(map);

    // Draw route polylines connecting user to safe zones
    const routeToPolice = L.polyline([[senderLocation.lat, senderLocation.lng], policeLoc], {
      color: '#FF5449',
      weight: 3,
      opacity: 0.7,
      dashArray: '4, 8'
    }).addTo(map);

    const routeToHospital = L.polyline([[senderLocation.lat, senderLocation.lng], hospitalLoc], {
      color: '#FFBF1C',
      weight: 3,
      opacity: 0.7,
      dashArray: '4, 8'
    }).addTo(map);

    let routeToLegal: any = null;
    if (handshakeStatus === 'accepted') {
      routeToLegal = L.polyline([[senderLocation.lat, senderLocation.lng], legalLoc], {
        color: '#5ae9ac',
        weight: 3,
        opacity: 0.8,
        dashArray: '4, 8'
      }).addTo(map);
    }

    // Adjust map bounds to include all markers
    const bounds = L.latLngBounds([
      [senderLocation.lat, senderLocation.lng],
      policeLoc,
      hospitalLoc,
      legalLoc
    ]);
    map.fitBounds(bounds, { padding: [30, 30] });

    return () => {
      map.remove();
    };
  }, [senderLocation, handshakeStatus]);

  return (
    <div ref={mapContainerRef} className="w-full h-full min-h-[250px]" />
  );
}

interface RoutingScreenProps {
  signalId: string | null;
  signalLocation: SignalLocation | null;
}

export function RoutingScreen({ signalId, signalLocation }: RoutingScreenProps) {
  const [handshakeStatus, setHandshakeStatus] = useState<'pending' | 'accepted'>('pending');
  const [activeSignalId, setActiveSignalId] = useState<string | null>(signalId);

  // Resolved sender location: prefer Firestore-backed location, fall back to prop, then default
  const [senderLocation, setSenderLocation] = useState<google.maps.LatLngLiteral>(
    signalLocation ?? DEFAULT_LOC
  );

  // If signalId already exists (passed from HubScreen), read its location from Firestore
  useEffect(() => {
    if (!signalId) {
      // No existing signal — create a new one for direct navigation to routing
      const createSignal = async () => {
        try {
          // Try to get the current device location
          const loc = await new Promise<{ lat: number; lng: number }>((resolve) => {
            if (!navigator.geolocation) { resolve(DEFAULT_LOC); return; }
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
              () => resolve(DEFAULT_LOC),
              { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
            );
          });
          setSenderLocation(loc);
          const docRef = await addDoc(collection(db, 'signals'), {
            status: 'pending',
            type: 'direct',
            location: loc,
            createdAt: serverTimestamp(),
          });
          setActiveSignalId(docRef.id);
        } catch (err) {
          console.error('Error creating signal:', err);
        }
      };
      createSignal();
      return;
    }

    // signalId exists — read location from Firestore (source of truth)
    const loadSignalLocation = async () => {
      try {
        const snap = await getDoc(doc(db, 'signals', signalId));
        if (snap.exists()) {
          const data = snap.data();
          if (data.location?.lat && data.location?.lng) {
            setSenderLocation({ lat: data.location.lat, lng: data.location.lng });
          }
        }
      } catch (err) {
        console.warn('Could not load signal location from Firestore, using prop fallback:', err);
        if (signalLocation) setSenderLocation(signalLocation);
      }
    };
    loadSignalLocation();
    setActiveSignalId(signalId);
  }, [signalId]);

  // Listen for handshake updates
  useEffect(() => {
    if (!activeSignalId) return;

    const unsubscribe = onSnapshot(doc(db, 'signals', activeSignalId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.status === 'accepted') {
          setHandshakeStatus('accepted');
        }
      }
    });

    // For demonstration: simulate a dispatcher accepting after 4 seconds
    const timer = setTimeout(async () => {
      try {
        await updateDoc(doc(db, 'signals', activeSignalId), { status: 'accepted' });
      } catch (err) {
        console.error('Error updating signal:', err);
      }
    }, 4000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [activeSignalId]);

  return (
    <div className="flex flex-col h-full md:h-screen w-full relative">
      {/* Mobile TopBar overlaying the map */}
      <div className="md:hidden z-50 absolute top-0 w-full">
        <TopBar onNavigate={() => {}} hideNav />
      </div>

      <div className="relative h-[45vh] md:h-[50vh] w-full flex-shrink-0 bg-surface/50 flex flex-col justify-center items-center">
        {hasValidKey ? (
          <>
            <APIProvider apiKey={API_KEY} version="weekly">
              <Map
                defaultCenter={senderLocation}
                defaultZoom={15}
                mapId="DEMO_MAP_ID"
                colorScheme="LIGHT"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                style={{ width: '100%', height: '100%' }}
                disableDefaultUI={true}
                gestureHandling="greedy"
              >
                <SecureMapContent
                  handshakeStatus={handshakeStatus}
                  senderLocation={senderLocation}
                />
              </Map>
            </APIProvider>

            <div className="absolute inset-x-0 bottom-0 h-32 map-overlay-gradient pointer-events-none z-10" />

            <div className="absolute inset-0 pointer-events-none p-4 md:p-8 flex flex-col pt-24 md:pt-8 z-20">
              <div className="glass-panel self-start rounded-full px-4 py-2 flex items-center space-x-2 pointer-events-auto shadow-lg backdrop-blur-md">
                <MapPin className="text-tertiary" size={16} />
                <span className="text-[12px] font-bold text-on-surface tracking-wide uppercase">Secure Routing Active</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <LeafletMapFallback
              senderLocation={senderLocation}
              handshakeStatus={handshakeStatus}
            />
            <div className="absolute inset-x-0 bottom-0 h-32 map-overlay-gradient pointer-events-none z-10" />

            <div className="absolute inset-0 pointer-events-none p-4 md:p-8 flex flex-col justify-between pt-24 md:pt-8 z-20">
              <div className="glass-panel self-start rounded-full px-4 py-2 flex items-center space-x-2 pointer-events-auto shadow-lg backdrop-blur-md">
                <MapPin className="text-tertiary" size={16} />
                <span className="text-[12px] font-bold text-on-surface tracking-wide uppercase">OpenStreetMap Secure Fallback Active</span>
              </div>
              
              <div className="glass-panel self-center rounded-xl p-3 px-4 text-center pointer-events-auto shadow-lg backdrop-blur-md border border-primary/20 text-xs font-semibold text-primary max-w-xs md:max-w-md">
                ℹ️ Running in open-source fallback. Configure <code>VITE_GOOGLE_MAPS_PLATFORM_KEY</code> in <code>.env</code> for Google Maps.
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 bg-background z-20 relative flex flex-col md:rounded-tl-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="px-5 md:px-10 py-6 flex justify-between items-end border-b border-white/5">
          <div>
            <h2 className="text-2xl font-bold text-on-surface mb-1">Active Signals</h2>
            <p className="text-base text-on-surface-variant opacity-80">Monitoring legal and resource routing.</p>
          </div>
          <div className="flex items-center space-x-2 text-tertiary">
            <ShieldCheck size={20} />
            <span className="text-sm font-semibold">Encrypted</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 md:px-10 py-6 space-y-4">
          {/* Card 1 */}
          <div className="glass-panel rounded-xl p-5 flex flex-col gap-4 shadow-lg">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Nearest Safe Zones</h3>
                  <p className="text-[12px] text-on-surface-variant font-medium">Police Station &amp; Hospital</p>
                </div>
              </div>
              <span className="text-[12px] font-semibold text-tertiary bg-tertiary/10 px-3 py-1 rounded-full border border-tertiary/20">
                Routing Active
              </span>
            </div>
            <div className="bg-surface-container rounded-lg p-3 border border-white/5">
              <p className="text-base text-on-surface">Live location transmitting securely to authorities.</p>
              <div className="flex items-center mt-2 text-primary text-sm font-semibold gap-2">
                <Clock size={16} />
                <span>Navigating safely</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className={`glass-panel rounded-xl p-5 flex flex-col gap-4 shadow-lg transition-all duration-1000 ${handshakeStatus === 'pending' ? 'opacity-70 grayscale' : 'opacity-100 grayscale-0'}`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${handshakeStatus === 'pending' ? 'bg-surface-bright text-on-surface-variant' : 'bg-tertiary/20 text-tertiary'}`}>
                  <Scale size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Legal Aid Clinic - West</h3>
                  <p className="text-[12px] text-on-surface-variant font-medium">Secondary Routing</p>
                </div>
              </div>
              <span className={`text-[12px] font-semibold px-3 py-1 rounded-full transition-colors ${handshakeStatus === 'pending' ? 'text-on-surface-variant bg-surface-bright' : 'text-tertiary bg-tertiary/10 border border-tertiary/20'}`}>
                {handshakeStatus === 'pending' ? 'Pending' : 'Accepted'}
              </span>
            </div>
            <div className="bg-surface-container rounded-lg p-3 border border-white/5">
              <p className={`text-base transition-colors ${handshakeStatus === 'pending' ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                {handshakeStatus === 'pending' ? 'Awaiting secure handshake confirmation.' : 'Secure handshake established. Legal support notified.'}
              </p>
              {handshakeStatus === 'accepted' && (
                <div className="flex items-center mt-2 text-primary text-sm font-semibold gap-2 animate-in fade-in zoom-in duration-500">
                  <ShieldCheck size={16} />
                  <span>Standing by for secure comms</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Wipe Session Button */}
        <div className="p-5 mt-auto border-t border-white/5 bg-background md:hidden">
          <button className="w-full h-12 bg-error/10 hover:bg-error/20 border border-error/50 rounded-xl flex items-center justify-center gap-2 text-error transition-colors active:scale-95">
            <Trash2 size={20} />
            <span className="text-sm font-bold tracking-wide">Wipe Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}
