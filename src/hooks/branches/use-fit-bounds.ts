import { useEffect, useRef } from 'react';
import type { BranchWithCoords } from '@/types/branch';

export function useFitBounds(
  map: google.maps.Map | null,
  isLoaded: boolean,
  branchesWithCoords: BranchWithCoords[],
) {
  const prevBranchIdsRef = useRef<string>('');

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
}
