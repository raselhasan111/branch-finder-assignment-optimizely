/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type LocationData = {
  latitude: number;
  longitude: number;
} | null;

interface LocationContextType {
  location: LocationData;
  isLocating: boolean;
  error: string | null;
  fetchLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationData>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasTriedAutoLocate, setHasTriedAutoLocate] = useState(false);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLocating(false);
        setHasTriedAutoLocate(true);
      },
      (err) => {
        setError(err.message);
        setIsLocating(false);
        setHasTriedAutoLocate(true);
      },
    );
  };

  useEffect(() => {
    if (!hasTriedAutoLocate && !location && !isLocating) {
      fetchLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LocationContext.Provider
      value={{ location, isLocating, error, fetchLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
