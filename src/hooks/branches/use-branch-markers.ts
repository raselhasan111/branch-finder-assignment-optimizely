import { useEffect, useRef } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Branch } from '@/types/branch';
import { createDefaultIcon } from '@/lib/map-utils';

import type { UseBranchMarkersOptions } from '@/types/hooks';
export function useBranchMarkers({
  map,
  isLoaded,
  branchesWithCoords,
  onMarkerClick,
  setSelectedBranch,
  setHoveredCluster,
}: UseBranchMarkersOptions) {
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const branchLookupRef = useRef<Map<google.maps.Marker, Branch>>(new Map());

  useEffect(() => {
    if (!map || !isLoaded) return;

    // Clear previous markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    branchLookupRef.current.clear();

    const defaultIcon = createDefaultIcon();

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
  }, [
    map,
    isLoaded,
    branchesWithCoords,
    onMarkerClick,
    setSelectedBranch,
    setHoveredCluster,
  ]);

  return { markersRef, branchLookupRef };
}
