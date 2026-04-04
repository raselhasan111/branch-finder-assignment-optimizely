import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
} from '@react-google-maps/api';
import { MapPin, Phone, Navigation, LocateFixed } from 'lucide-react';
import type { Branch } from '@/types/branch';
import { parseCoordinates } from '@/types/branch';
import { useLocation } from '@/contexts/LocationContext';
import MapPlaceholder from './MapPlaceholder';

interface BranchMapProps {
  branches: Branch[];
  onMarkerClick?: (branch: Branch) => void;
}

// Plain objects — no google.maps references at module level
const MAP_STYLES = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#c9d8e8' }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#f0ede6' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#d4d0c8' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#bcb8b0' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.fill',
    stylers: [{ color: '#e8e4dc' }],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry.fill',
    stylers: [{ color: '#f5f2ec' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#dfd8c8' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' as const }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' as const }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#c8c0b4' }],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b6560' }],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#fefdfb' }, { weight: 3 }],
  },
];

const DEFAULT_CENTER = { lat: 30, lng: 0 };
const DEFAULT_ZOOM = 2;

function getDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export default function BranchMap({ branches, onMarkerClick }: BranchMapProps) {
  const { location: userLocation } = useLocation();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const prevBranchIdsRef = useRef<string>('');

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  // Parse coordinates for all branches once
  const branchesWithCoords = useMemo(
    () =>
      branches
        .map((branch) => {
          const [lat, lng] = parseCoordinates(branch.Coordinates);
          return lat != null && lng != null ? { branch, lat, lng } : null;
        })
        .filter(
          (item): item is { branch: Branch; lat: number; lng: number } =>
            item !== null,
        ),
    [branches],
  );

  // Fit bounds when branches change
  useEffect(() => {
    if (!map || !isLoaded || branchesWithCoords.length === 0) return;

    const currentIds = branchesWithCoords
      .map((b) => b.branch._id)
      .sort()
      .join(',');
    if (currentIds === prevBranchIdsRef.current) return;
    prevBranchIdsRef.current = currentIds;

    if (branchesWithCoords.length === 1) {
      map.panTo({
        lat: branchesWithCoords[0].lat,
        lng: branchesWithCoords[0].lng,
      });
      map.setZoom(14);
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    branchesWithCoords.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
  }, [map, isLoaded, branchesWithCoords]);

  const handleMarkerClick = useCallback(
    (branch: Branch) => {
      setSelectedBranch(branch);
      onMarkerClick?.(branch);
    },
    [onMarkerClick],
  );

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMyLocation = useCallback(() => {
    if (!map || !userLocation) return;
    map.panTo({ lat: userLocation.latitude, lng: userLocation.longitude });
    map.setZoom(14);
  }, [map, userLocation]);

  // Show placeholder if no API key or load error
  if (!apiKey || loadError) {
    return <MapPlaceholder />;
  }

  if (!isLoaded) {
    return (
      <div className="relative h-[260px] w-full animate-pulse overflow-hidden bg-cream sm:h-[360px] sm:rounded-[16px] lg:h-[420px] lg:rounded-[25px] xl:h-[480px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="text-[0.9rem] font-medium uppercase tracking-[3px] text-sage"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Loading Map...
          </div>
        </div>
      </div>
    );
  }

  // These use google.maps — safe here because isLoaded is true above
  const mapOptions: google.maps.MapOptions = {
    styles: MAP_STYLES,
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM,
    },
    gestureHandling: window.innerWidth < 640 ? 'cooperative' : 'greedy',
    minZoom: 2,
    maxZoom: 18,
    clickableIcons: false,
  };

  function createMarkerIcon(isSelected: boolean): google.maps.Symbol {
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: isSelected ? '#0a1628' : '#d4af37',
      fillOpacity: 1,
      strokeColor: '#fefdfb',
      strokeWeight: 2.5,
      scale: isSelected ? 10 : 8,
    };
  }

  const userLocationIcon: google.maps.Symbol = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#4285F4',
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 3,
    scale: 9,
  };

  const userLocationHaloIcon: google.maps.Symbol = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#4285F4',
    fillOpacity: 0.15,
    strokeColor: '#4285F4',
    strokeWeight: 1,
    scale: 22,
  };

  const selectedCoords = selectedBranch
    ? parseCoordinates(selectedBranch.Coordinates)
    : [null, null];

  return (
    <div className="relative h-[260px] w-full overflow-hidden sm:h-[360px] sm:rounded-[16px] lg:h-[420px] lg:rounded-[25px] xl:h-[480px]">
      {/* My Location button — above zoom controls */}
      {userLocation && (
        <button
          onClick={handleMyLocation}
          title="Go to my location"
          className="absolute bottom-[120px] right-[10px] z-10 flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-sm border-0 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.3)] transition-colors hover:bg-gray-100"
        >
          <LocateFixed className="h-5 w-5 text-[#666]" />
        </button>
      )}
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
        onClick={() => setSelectedBranch(null)}
      >
        {/* Branch markers */}
        {branchesWithCoords.map(({ branch, lat, lng }) => (
          <MarkerF
            key={branch._id}
            position={{ lat, lng }}
            icon={createMarkerIcon(selectedBranch?._id === branch._id)}
            onClick={() => handleMarkerClick(branch)}
            title={branch.Name ?? undefined}
          />
        ))}

        {/* User location marker with halo */}
        {userLocation && (
          <>
            <MarkerF
              position={{
                lat: userLocation.latitude,
                lng: userLocation.longitude,
              }}
              icon={userLocationHaloIcon}
              clickable={false}
              zIndex={999}
            />
            <MarkerF
              position={{
                lat: userLocation.latitude,
                lng: userLocation.longitude,
              }}
              icon={userLocationIcon}
              title="My Location"
              zIndex={1000}
            />
          </>
        )}

        {/* InfoWindow */}
        {selectedBranch &&
          selectedCoords[0] != null &&
          selectedCoords[1] != null && (
            <InfoWindowF
              position={{
                lat: selectedCoords[0],
                lng: selectedCoords[1],
              }}
              onCloseClick={() => setSelectedBranch(null)}
              options={{ pixelOffset: new google.maps.Size(0, -12) }}
            >
              <div
                style={{
                  fontFamily: "'Jost', sans-serif",
                  minWidth: '180px',
                  maxWidth: '260px',
                  padding: '4px',
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: '#0a1628',
                    margin: '0 0 6px',
                    lineHeight: 1.3,
                  }}
                >
                  {selectedBranch.Name ?? 'Unknown Branch'}
                </h3>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '6px',
                    marginBottom: '6px',
                    color: '#64748b',
                    fontSize: '0.85rem',
                    lineHeight: 1.4,
                  }}
                >
                  <MapPin
                    size={14}
                    style={{
                      flexShrink: 0,
                      marginTop: '2px',
                      color: '#d4af37',
                    }}
                  />
                  <span>
                    {[
                      selectedBranch.Street,
                      selectedBranch.City,
                      selectedBranch.Country,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </div>

                {selectedBranch.Phone && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '8px',
                      color: '#64748b',
                      fontSize: '0.85rem',
                    }}
                  >
                    <Phone
                      size={13}
                      style={{ flexShrink: 0, color: '#d4af37' }}
                    />
                    <span>{selectedBranch.Phone}</span>
                  </div>
                )}

                <a
                  href={getDirectionsUrl(selectedCoords[0], selectedCoords[1])}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    background: '#d4af37',
                    color: '#0a1628',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'opacity 0.2s',
                  }}
                >
                  <Navigation size={12} />
                  Get Directions
                </a>
              </div>
            </InfoWindowF>
          )}
      </GoogleMap>
    </div>
  );
}
