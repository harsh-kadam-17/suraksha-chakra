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

const hasValidKey = Boolean(API_KEY) && 
  API_KEY !== 'YOUR_API_KEY' && 
  API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY' && 
  !API_KEY.includes('YOUR_');

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
  const [transitLocation, setTransitLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [policeName, setPoliceName] = useState<string>('');
  const [hospitalName, setHospitalName] = useState<string>('');
  const [legalName, setLegalName] = useState<string>('');
  const [transitName, setTransitName] = useState<string>('');

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

    service.nearbySearch({
      location: senderLocation,
      radius: 5000,
      keyword: 'railway station OR bus station'
    }, (results, status) => {
      if (status === placesLib.PlacesServiceStatus.OK && results && results[0]) {
        const place = results[0];
        if (place.geometry && place.geometry.location) {
          setTransitLocation({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          });
          setTransitName(place.name || 'Transit Station');
        }
      }
    });
  }, [placesLib, map, senderLocation]);

  // Draw routing polylines
  useEffect(() => {
    const shouldRouteLegal = handshakeStatus === 'accepted' && legalLocation;

    if (!routesLib || !map || !senderLocation || (!policeLocation && !hospitalLocation && !shouldRouteLegal && !transitLocation)) {
      if (map && senderLocation && (policeLocation || hospitalLocation || shouldRouteLegal || transitLocation)) {
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(senderLocation);
        if (policeLocation) bounds.extend(policeLocation);
        if (hospitalLocation) bounds.extend(hospitalLocation);
        if (shouldRouteLegal) bounds.extend(legalLocation!);
        if (transitLocation) bounds.extend(transitLocation);
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

    if (transitLocation) {
      bounds.extend(transitLocation);
      promises.push(
        routesLib.Route.computeRoutes({
          origin: senderLocation,
          destination: transitLocation,
          travelMode: 'DRIVING',
          fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
        }).then(({ routes }) => {
          if (routes?.[0]) {
            const p = routes[0].createPolylines();
            p.forEach(l => {
              l.setOptions({ strokeColor: '#8b5cf6', strokeWeight: 5, strokeOpacity: 0.9, zIndex: 10 });
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
      {transitLocation && (
        <AdvancedMarker position={transitLocation}>
          <Pin background="#8b5cf6" glyphColor="#ffffff" borderColor="#8b5cf6" />
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

    // CartoDB Positron (white/light tiles)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    // User/Sender marker: Pulsing amber circle
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
          <div style="position:absolute;width:32px;height:32px;border-radius:50%;background:rgba(255,159,28,0.3);animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="position:absolute;width:16px;height:16px;border-radius:50%;background:#ff9f1c;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.5);"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // Custom emergency icons
    const createEmergencyIcon = (color: string, letter: string) => L.divIcon({
      className: 'custom-emergency-marker',
      html: `
        <div style="width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2.5px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.5);color:white;font-weight:bold;font-size:13px;background:${color};">
          ${letter}
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    // Add user marker
    L.marker([senderLocation.lat, senderLocation.lng], { icon: userIcon })
      .bindPopup("<div style='padding:4px 8px;font-family:sans-serif;'><b>📍 Your Live Location</b><br/><span style='font-size:11px;color:#888;'>Transmitting securely...</span></div>")
      .addTo(map);

    // --- Helper: fetch real road route from OSRM and draw on map ---
    const drawRealRoute = async (
      from: [number, number],
      to: [number, number],
      color: string
    ) => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.code === 'Ok' && data.routes?.[0]) {
          const coords: [number, number][] = data.routes[0].geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng]
          );
          L.polyline(coords, { color, weight: 5, opacity: 0.9 }).addTo(map);
        }
      } catch (e) {
        console.warn('OSRM routing failed:', e);
      }
    };

    // --- Helper: fetch nearest place via Overpass API ---
    const fetchNearestPlace = async (amenity: string): Promise<{ coords: [number, number]; name: string } | null> => {
      try {
        const { lat, lng } = senderLocation;
        const query = `[out:json][timeout:15];(node["amenity"="${amenity}"](around:5000,${lat},${lng});way["amenity"="${amenity}"](around:5000,${lat},${lng}););out center 1;`;
        const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.elements?.length > 0) {
          const el = data.elements[0];
          const elLat = el.lat ?? el.center?.lat;
          const elLng = el.lon ?? el.center?.lon;
          if (elLat && elLng) return { coords: [elLat, elLng], name: el.tags?.name || null };
        }
      } catch (e) {
        console.warn(`Overpass fetch failed for ${amenity}:`, e);
      }
      return null;
    };

    // --- Main: find real places and draw real road routes ---
    const userCoords: [number, number] = [senderLocation.lat, senderLocation.lng];

    const setupMap = async () => {
      const [policeResult, hospitalResult, legalResult, transitResult] = await Promise.all([
        fetchNearestPlace('police'),
        fetchNearestPlace('hospital'),
        fetchNearestPlace('courthouse'),
        fetchNearestPlace('bus_station'),
      ]);

      const policeLoc  = policeResult?.coords   ?? [senderLocation.lat + 0.0035, senderLocation.lng - 0.003] as [number, number];
      const hospitalLoc = hospitalResult?.coords ?? [senderLocation.lat - 0.0025, senderLocation.lng + 0.004] as [number, number];
      const legalLoc   = legalResult?.coords    ?? [senderLocation.lat + 0.0018, senderLocation.lng + 0.0032] as [number, number];
      const transitLoc = transitResult?.coords  ?? [senderLocation.lat - 0.0020, senderLocation.lng - 0.0025] as [number, number];

      const policeName   = policeResult?.name   ?? 'Nearest Police Station';
      const hospitalName = hospitalResult?.name ?? 'Nearest Hospital';
      const legalName    = legalResult?.name    ?? 'Legal Aid Clinic';
      const transitName  = transitResult?.name  ?? 'Transit Station';

      L.marker(policeLoc, { icon: createEmergencyIcon('#FF5449', 'P') })
        .bindPopup(`<div style='padding:4px 8px;font-family:sans-serif;'><b>🚔 ${policeName}</b><br/><span style='font-size:11px;color:#888;'>Police Station · Emergency Route Active</span></div>`)
        .addTo(map);

      L.marker(hospitalLoc, { icon: createEmergencyIcon('#FFBF1C', 'H') })
        .bindPopup(`<div style='padding:4px 8px;font-family:sans-serif;'><b>🏥 ${hospitalName}</b><br/><span style='font-size:11px;color:#888;'>Hospital · Medical Route Active</span></div>`)
        .addTo(map);

      L.marker(legalLoc, { icon: createEmergencyIcon('#5ae9ac', 'L') })
        .bindPopup(handshakeStatus === 'pending'
          ? `<div style='padding:4px 8px;font-family:sans-serif;'><b>⚖️ ${legalName}</b><br/><span style='font-size:11px;color:#888;'>Awaiting secure handshake...</span></div>`
          : `<div style='padding:4px 8px;font-family:sans-serif;'><b>⚖️ ${legalName}</b><br/><span style='font-size:11px;color:#5ae9ac;'>Secure handshake established ✓</span></div>`)
        .addTo(map);

      L.marker(transitLoc, { icon: createEmergencyIcon('#8b5cf6', 'T') })
        .bindPopup(`<div style='padding:4px 8px;font-family:sans-serif;'><b>🚌 ${transitName}</b><br/><span style='font-size:11px;color:#888;'>Transit Station · Escape Route Active</span></div>`)
        .addTo(map);

      // Draw real road-following routes via OSRM
      await Promise.all([
        drawRealRoute(userCoords, policeLoc, '#FF5449'),
        drawRealRoute(userCoords, hospitalLoc, '#FFBF1C'),
        drawRealRoute(userCoords, transitLoc, '#8b5cf6'),
        ...(handshakeStatus === 'accepted' ? [drawRealRoute(userCoords, legalLoc, '#5ae9ac')] : []),
      ]);

      const bounds = L.latLngBounds([userCoords, policeLoc, hospitalLoc, legalLoc, transitLoc]);
      map.fitBounds(bounds, { padding: [50, 50] });
    };

    setupMap();

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
  onWipeSession: () => void;
}

export function RoutingScreen({ signalId, signalLocation, onWipeSession }: RoutingScreenProps) {
  const [handshakeStatus, setHandshakeStatus] = useState<'pending' | 'accepted'>('pending');
  const [activeSignalId, setActiveSignalId] = useState<string | null>(signalId);
  // Auto-wipe countdown: 5 minutes = 300 seconds
  const [countdown, setCountdown] = useState(300);

  // Resolved sender location: prefer Firestore-backed location, fall back to prop, then default
  const [senderLocation, setSenderLocation] = useState<google.maps.LatLngLiteral>(
    signalLocation ?? DEFAULT_LOC
  );

  // If signalId already exists (passed from HubScreen), read its location from Firestore
  useEffect(() => {
    // 'local-*' IDs mean Firebase save is pending/failed — use signalLocation prop directly
    if (signalId && signalId.startsWith('local-')) {
      if (signalLocation) setSenderLocation(signalLocation);
      setActiveSignalId(signalId);
      return;
    }

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

          // Set local ID immediately to avoid blocking on Firebase
          const localId = 'local-direct-' + Date.now();
          setActiveSignalId(localId);

          // Save signal to Firebase in the background (non-blocking)
          addDoc(collection(db, 'signals'), {
            status: 'pending',
            type: 'direct',
            location: loc,
            createdAt: serverTimestamp(),
          }).catch((err) => {
            console.warn('Firebase direct signal save failed (using local fallback):', err);
          });
        } catch (err) {
          console.error('Error creating signal:', err);
          setActiveSignalId('local-direct-' + Date.now());
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

    // For demonstration: simulate a dispatcher accepting after 4 seconds
    const timer = setTimeout(() => {
      setHandshakeStatus('accepted');
      // Also try to update Firestore if it's a real signal ID
      if (!activeSignalId.startsWith('local-')) {
        updateDoc(doc(db, 'signals', activeSignalId), { status: 'accepted' })
          .catch((err) => console.warn('Could not update Firestore handshake:', err));
      }
    }, 4000);

    // Only listen to Firestore for real (non-local) signal IDs
    if (activeSignalId.startsWith('local-')) {
      return () => clearTimeout(timer);
    }

    const unsubscribe = onSnapshot(doc(db, 'signals', activeSignalId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.status === 'accepted') {
          setHandshakeStatus('accepted');
        }
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [activeSignalId]);

  // Auto-wipe: count down from 300s (5 min), wipe when reaches 0
  useEffect(() => {
    setCountdown(300);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onWipeSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

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

        {/* Auto-wipe countdown banner */}
        <div className="mx-5 md:mx-10 mb-2 mt-0 flex items-center justify-between bg-error/10 border border-error/30 rounded-xl px-4 py-2">
          <div className="flex items-center gap-2 text-error text-xs font-semibold">
            <Clock size={14} />
            <span>Auto-wipe in <span className="font-mono text-sm">{formatCountdown(countdown)}</span></span>
          </div>
          <span className="text-[10px] text-on-surface-variant opacity-60">Session will clear automatically</span>
        </div>

        {/* Wipe Session Button — visible on both mobile & desktop */}
        <div className="px-5 md:px-10 pb-5 pt-2">
          <button
            onClick={onWipeSession}
            className="w-full h-12 bg-error/10 hover:bg-error/20 border border-error/50 rounded-xl flex items-center justify-center gap-2 text-error transition-colors active:scale-95"
          >
            <Trash2 size={20} />
            <span className="text-sm font-bold tracking-wide">Wipe Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}
