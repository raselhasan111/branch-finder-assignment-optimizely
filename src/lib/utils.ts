import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FLAG_OFFSET } from '@/constants/ui.ts';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export function countryFlag(code: string): string {
  if (code.length !== 2) return '';
  return String.fromCodePoint(
    code.charCodeAt(0) - 65 + FLAG_OFFSET,
    code.charCodeAt(1) - 65 + FLAG_OFFSET,
  );
}

export function parseCoordinates(
  coords: string | null,
): [number | null, number | null] {
  if (!coords) return [null, null];
  const parts = coords.split(',').map((s) => parseFloat(s.trim()));
  if (parts.length !== 2 || parts.some(isNaN)) return [null, null];
  return [parts[0], parts[1]];
}
