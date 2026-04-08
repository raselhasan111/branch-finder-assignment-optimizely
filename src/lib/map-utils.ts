import { PIN_PATH } from '@/constants/map.ts';

export function getDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/** Requires google.maps to be loaded — only call after isLoaded is true */
export function createDefaultIcon(): google.maps.Icon {
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 24 34">
          <path d="${PIN_PATH}" fill="#d4af37" stroke="#fefdfb" stroke-width="1.5"/>
        </svg>`,
    )}`,
    scaledSize: new google.maps.Size(30, 42),
    anchor: new google.maps.Point(15, 42),
  };
}

/** Requires google.maps to be loaded — only call after isLoaded is true */
export function createSelectedIcon(): google.maps.Icon {
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="50" viewBox="0 0 24 34">
          <path d="${PIN_PATH}" fill="#0a1628" stroke="#d4af37" stroke-width="1.5"/>
        </svg>`,
    )}`,
    scaledSize: new google.maps.Size(36, 50),
    anchor: new google.maps.Point(18, 50),
  };
}
