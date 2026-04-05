import { useState, useCallback, useMemo, useEffect, useRef, memo } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  OverlayViewF,
} from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { MapPin, Phone, Mail, Navigation, LocateFixed, X } from 'lucide-react';
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

function BranchMap({ branches, onMarkerClick }: BranchMapProps) {
  const { location: userLocation } = useLocation();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [hoveredCluster, setHoveredCluster] = useState<{
    position: google.maps.LatLngLiteral;
    count: number;
  } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const prevBranchIdsRef = useRef<string>('');

  // Imperative marker refs
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const userMarkersRef = useRef<google.maps.Marker[]>([]);
  const branchLookupRef = useRef<Map<google.maps.Marker, Branch>>(new Map());

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

  // Manage branch markers imperatively with clustering
  useEffect(() => {
    if (!map || !isLoaded) return;

    // Clear previous markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    branchLookupRef.current.clear();

    // Pin-shaped SVG path (teardrop marker)
    const PIN_PATH =
      'M12 0C5.4 0 0 5.4 0 12c0 7.2 12 22 12 22s12-14.8 12-22C24 5.4 18.6 0 12 0zm0 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z';

    const defaultIcon: google.maps.Icon = {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 24 34">
          <path d="${PIN_PATH}" fill="#d4af37" stroke="#fefdfb" stroke-width="1.5"/>
        </svg>`,
      )}`,
      scaledSize: new google.maps.Size(30, 42),
      anchor: new google.maps.Point(15, 42),
    };

    // Create markers imperatively (no React components)
    const newMarkers = branchesWithCoords.map(({ branch, lat, lng }) => {
      const marker = new google.maps.Marker({
        position: { lat, lng },
        icon: defaultIcon,
        title: branch.Name ?? undefined,
      });
      marker.addListener('click', () => {
        setSelectedBranch(branch);
        onMarkerClick?.(branch);
      });
      branchLookupRef.current.set(marker, branch);
      return marker;
    });
    markersRef.current = newMarkers;

    // Set up clusterer
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }
    const lookup = branchLookupRef.current;
    clustererRef.current = new MarkerClusterer({
      map,
      markers: newMarkers,
      renderer: {
        render({ count, position, markers: clusterMarkers }) {
          const size = count < 50 ? 36 : count < 200 ? 44 : 52;
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
            <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#0a1628" opacity="0.85"/>
            <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 3}" fill="none" stroke="#d4af37" stroke-width="2"/>
            <text x="${size / 2}" y="${size / 2}" text-anchor="middle" dominant-baseline="central" fill="#d4af37" font-family="Jost, sans-serif" font-size="${size < 40 ? 12 : 14}" font-weight="600">${count}</text>
          </svg>`;
          const clusterMarker = new google.maps.Marker({
            position,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
              scaledSize: new google.maps.Size(size, size),
              anchor: new google.maps.Point(size / 2, size / 2),
            },
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
          });

          // Resolve branches for this cluster
          const clusterBranches = (clusterMarkers ?? [])
            .map((m) => lookup.get(m as google.maps.Marker))
            .filter((b): b is Branch => b !== undefined);

          clusterMarker.addListener('mouseover', () => {
            const pos = clusterMarker.getPosition();
            if (!pos) return;
            setHoveredCluster({
              position: { lat: pos.lat(), lng: pos.lng() },
              count: clusterBranches.length,
            });
          });
          clusterMarker.addListener('mouseout', () => {
            setHoveredCluster(null);
          });

          return clusterMarker;
        },
      },
    });

    const currentMarkers = markersRef.current;
    const currentLookup = branchLookupRef.current;
    const currentClusterer = clustererRef.current;

    return () => {
      currentMarkers.forEach((m) => {
        google.maps.event.clearInstanceListeners(m);
        m.setMap(null);
      });
      markersRef.current = [];
      currentLookup.clear();
      if (currentClusterer) {
        currentClusterer.clearMarkers();
        clustererRef.current = null;
      }
    };
  }, [map, isLoaded, branchesWithCoords, onMarkerClick]);

  // Highlight selected marker
  useEffect(() => {
    if (!isLoaded) return;

    const PIN_PATH =
      'M12 0C5.4 0 0 5.4 0 12c0 7.2 12 22 12 22s12-14.8 12-22C24 5.4 18.6 0 12 0zm0 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z';

    const selectedIcon: google.maps.Icon = {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="50" viewBox="0 0 24 34">
          <path d="${PIN_PATH}" fill="#0a1628" stroke="#d4af37" stroke-width="1.5"/>
        </svg>`,
      )}`,
      scaledSize: new google.maps.Size(36, 50),
      anchor: new google.maps.Point(18, 50),
    };
    const defaultIcon: google.maps.Icon = {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 24 34">
          <path d="${PIN_PATH}" fill="#d4af37" stroke="#fefdfb" stroke-width="1.5"/>
        </svg>`,
      )}`,
      scaledSize: new google.maps.Size(30, 42),
      anchor: new google.maps.Point(15, 42),
    };

    for (const marker of markersRef.current) {
      const branch = branchLookupRef.current.get(marker);
      marker.setIcon(
        branch && selectedBranch && branch._id === selectedBranch._id
          ? selectedIcon
          : defaultIcon,
      );
    }
  }, [isLoaded, selectedBranch]);

  // Manage user location markers imperatively
  useEffect(() => {
    if (!map || !isLoaded) return;

    // Clear previous user markers
    userMarkersRef.current.forEach((m) => m.setMap(null));
    userMarkersRef.current = [];

    if (!userLocation) return;

    const pos = { lat: userLocation.latitude, lng: userLocation.longitude };

    const halo = new google.maps.Marker({
      position: pos,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#4285F4',
        fillOpacity: 0.15,
        strokeColor: '#4285F4',
        strokeWeight: 1,
        scale: 22,
      },
      clickable: false,
      zIndex: 999,
      map,
    });

    const dot = new google.maps.Marker({
      position: pos,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
        scale: 9,
      },
      title: 'My Location',
      zIndex: 1000,
      map,
    });

    userMarkersRef.current = [halo, dot];

    return () => {
      userMarkersRef.current.forEach((m) => m.setMap(null));
      userMarkersRef.current = [];
    };
  }, [map, isLoaded, userLocation]);

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

  const mapOptions = useMemo<google.maps.MapOptions | undefined>(
    () =>
      isLoaded
        ? {
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
          }
        : undefined,
    [isLoaded],
  );

  // Show placeholder if no API key or load error
  if (!apiKey || loadError) {
    return <MapPlaceholder />;
  }

  if (!isLoaded) {
    return (
      <div className="relative h-[380px] w-full animate-pulse overflow-hidden bg-cream md:h-[480px] sm:rounded-t-[16px] lg:h-[400px] lg:rounded-t-[25px] xl:h-[480px]">
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

  const selectedCoords = selectedBranch
    ? parseCoordinates(selectedBranch.Coordinates)
    : [null, null];

  return (
    <div className="relative h-[380px] w-full overflow-hidden md:h-[480px] sm:rounded-t-[16px] lg:h-[400px] lg:rounded-t-[25px] xl:h-[480px]">
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
        {/* Cluster hover tooltip */}
        {hoveredCluster && (
          <OverlayViewF
            position={hoveredCluster.position}
            mapPaneName="floatPane"
          >
            <div
              style={{
                transform: 'translate(-50%, -100%)',
                marginTop: '-28px',
                fontFamily: "'Jost', sans-serif",
                background: '#fff',
                borderRadius: '6px',
                padding: '5px 10px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#0a1628',
                }}
              >
                {hoveredCluster.count} branches
              </span>
              <span
                style={{
                  fontSize: '0.73rem',
                  color: '#94a3b8',
                  marginLeft: '4px',
                }}
              >
                — click to explore
              </span>
            </div>
          </OverlayViewF>
        )}

        {/* Selected branch popup */}
        {selectedBranch &&
          selectedCoords[0] != null &&
          selectedCoords[1] != null && (
            <OverlayViewF
              position={{
                lat: selectedCoords[0],
                lng: selectedCoords[1],
              }}
              mapPaneName="floatPane"
            >
              <div
                style={{
                  transform: 'translate(-50%, -100%)',
                  marginTop: '-48px',
                  position: 'relative',
                  fontFamily: "'Jost', sans-serif",
                  background: '#fefdfb',
                  borderRadius: '14px',
                  padding: '16px 18px 14px',
                  boxShadow:
                    '0 4px 20px rgba(10, 22, 40, 0.12), 0 1px 4px rgba(10, 22, 40, 0.08)',
                  minWidth: '210px',
                  maxWidth: '270px',
                  border: '1px solid rgba(212, 175, 55, 0.15)',
                }}
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedBranch(null)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'rgba(10, 22, 40, 0.06)',
                    cursor: 'pointer',
                    padding: 0,
                    color: '#64748b',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(10, 22, 40, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(10, 22, 40, 0.06)';
                  }}
                >
                  <X size={13} strokeWidth={2.5} />
                </button>

                {/* Gold accent bar */}
                <div
                  style={{
                    width: '28px',
                    height: '3px',
                    borderRadius: '2px',
                    background: '#d4af37',
                    marginBottom: '10px',
                  }}
                />

                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#0a1628',
                    margin: '0 0 10px',
                    lineHeight: 1.3,
                    paddingRight: '20px',
                    letterSpacing: '-0.3px',
                  }}
                >
                  {selectedBranch.Name ?? 'Unknown Branch'}
                </h3>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '7px',
                      color: '#4a5568',
                      fontSize: '0.82rem',
                      lineHeight: 1.45,
                    }}
                  >
                    <MapPin
                      size={13}
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
                        gap: '7px',
                        fontSize: '0.82rem',
                      }}
                    >
                      <Phone
                        size={12}
                        style={{ flexShrink: 0, color: '#d4af37' }}
                      />
                      <a
                        href={`tel:${selectedBranch.Phone}`}
                        style={{
                          color: '#4a5568',
                          textDecoration: 'none',
                          borderBottom: '1px dashed rgba(74, 85, 104, 0.3)',
                          transition: 'color 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#0a1628';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#4a5568';
                        }}
                      >
                        {selectedBranch.Phone}
                      </a>
                    </div>
                  )}

                  {selectedBranch.Email && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '7px',
                        fontSize: '0.82rem',
                      }}
                    >
                      <Mail
                        size={12}
                        style={{ flexShrink: 0, color: '#d4af37' }}
                      />
                      <a
                        href={`mailto:${selectedBranch.Email}`}
                        style={{
                          color: '#4a5568',
                          textDecoration: 'none',
                          borderBottom: '1px dashed rgba(74, 85, 104, 0.3)',
                          transition: 'color 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#0a1628';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#4a5568';
                        }}
                      >
                        {selectedBranch.Email}
                      </a>
                    </div>
                  )}
                </div>

                <a
                  href={getDirectionsUrl(selectedCoords[0], selectedCoords[1])}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 16px',
                    borderRadius: '20px',
                    background: '#d4af37',
                    color: '#0a1628',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    letterSpacing: '0.3px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#c9a430';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#d4af37';
                  }}
                >
                  <Navigation size={11} />
                  Get Directions
                </a>

                {/* Tail triangle */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '9px solid transparent',
                    borderRight: '9px solid transparent',
                    borderTop: '9px solid #fefdfb',
                    filter: 'drop-shadow(0 2px 2px rgba(10, 22, 40, 0.06))',
                  }}
                />
              </div>
            </OverlayViewF>
          )}
      </GoogleMap>
    </div>
  );
}

export default memo(BranchMap);
