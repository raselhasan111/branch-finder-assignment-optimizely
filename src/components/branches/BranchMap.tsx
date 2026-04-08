import { useState, useCallback, useMemo, memo } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import type { Branch, BranchWithCoords, HoveredCluster } from '@/types/branch';
import { useLocation } from '@/contexts/LocationContext';
import { useMapFullscreen } from '@/hooks/branches/use-map-fullscreen';
import { useFitBounds } from '@/hooks/branches/use-fit-bounds';
import { useBranchMarkers } from '@/hooks/branches/use-branch-markers';
import { useSelectedMarker } from '@/hooks/branches/use-selected-marker';
import { useUserLocationMarkers } from '@/hooks/branches/use-user-location-markers';
import MapError from './MapError';
import BranchPopup from './BranchPopup';
import ClusterTooltip from './ClusterTooltip';
import MapControls from './MapControls';
import { DEFAULT_CENTER, DEFAULT_ZOOM, MAP_STYLES } from '@/constants/map.ts';
import { parseCoordinates } from '@/lib/utils.ts';

interface BranchMapProps {
  branches: Branch[];
  onMarkerClick?: (branch: Branch) => void;
}

function BranchMap({ branches, onMarkerClick }: BranchMapProps) {
  const { location: userLocation } = useLocation();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [hoveredCluster, setHoveredCluster] = useState<HoveredCluster | null>(
    null,
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  const { isFullscreen, toggleFullscreen } = useMapFullscreen(map);

  const branchesWithCoords = useMemo<BranchWithCoords[]>(
    () =>
      branches
        .map((branch) => {
          const [lat, lng] = parseCoordinates(branch.Coordinates);
          return lat != null && lng != null ? { branch, lat, lng } : null;
        })
        .filter((item): item is BranchWithCoords => item !== null),
    [branches],
  );

  useFitBounds(map, isLoaded, branchesWithCoords);

  const { markersRef, branchLookupRef } = useBranchMarkers({
    map,
    isLoaded,
    branchesWithCoords,
    onMarkerClick,
    setSelectedBranch,
    setHoveredCluster,
  });

  useSelectedMarker(isLoaded, selectedBranch, markersRef, branchLookupRef);
  useUserLocationMarkers(map, isLoaded, userLocation);

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
            zoomControl: false,
            gestureHandling: window.innerWidth < 640 ? 'cooperative' : 'greedy',
            minZoom: 2,
            maxZoom: 18,
            clickableIcons: false,
          }
        : undefined,
    [isLoaded],
  );

  if (!apiKey || loadError) {
    return <MapError />;
  }

  if (!isLoaded) {
    return (
      <div className="relative h-95 w-full animate-pulse overflow-hidden bg-cream md:h-120 sm:rounded-t-[16px] lg:rounded-t-[25px] xl:h-[50vh]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[0.9rem] font-medium uppercase tracking-[3px] text-sage">
            Loading Map...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-1200 h-screen w-screen'
          : 'relative h-95 w-full overflow-hidden md:h-120 sm:rounded-t-[16px] lg:rounded-t-[25px] xl:h-[50vh]'
      }
    >
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
        onClick={() => setSelectedBranch(null)}
      >
        <ClusterTooltip hoveredCluster={hoveredCluster} />
        <BranchPopup
          selectedBranch={selectedBranch}
          onClose={() => setSelectedBranch(null)}
        />
      </GoogleMap>
      <MapControls
        map={map}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        userLocation={userLocation}
        onMyLocation={handleMyLocation}
      />
    </div>
  );
}

export default memo(BranchMap);
