import { useEffect } from 'react';
import type { Branch } from '@/types/branch';
import { createDefaultIcon, createSelectedIcon } from '@/lib/map-utils';
import type { RefObject } from 'react';

export function useSelectedMarker(
  isLoaded: boolean,
  selectedBranch: Branch | null,
  markersRef: RefObject<google.maps.Marker[]>,
  branchLookupRef: RefObject<Map<google.maps.Marker, Branch>>,
) {
  useEffect(() => {
    if (!isLoaded) return;

    const selectedIcon = createSelectedIcon();
    const defaultIcon = createDefaultIcon();

    for (const marker of markersRef.current) {
      const branch = branchLookupRef.current.get(marker);
      marker.setIcon(
        branch && selectedBranch && branch._id === selectedBranch._id
          ? selectedIcon
          : defaultIcon,
      );
    }
  }, [isLoaded, selectedBranch, markersRef, branchLookupRef]);
}
