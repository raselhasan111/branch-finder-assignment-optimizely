import { useEffect, useRef } from 'react';

export function useUserLocationMarkers(
  map: google.maps.Map | null,
  isLoaded: boolean,
  userLocation: { latitude: number; longitude: number } | null,
) {
  const userMarkersRef = useRef<google.maps.Marker[]>([]);

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
}
