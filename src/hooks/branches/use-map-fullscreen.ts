import { useState, useEffect, useCallback } from 'react';

export function useMapFullscreen(map: google.maps.Map | null) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Exit fullscreen on Escape key
  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Trigger map resize when fullscreen changes
  useEffect(() => {
    if (!map) return;
    const timer = setTimeout(() => {
      google.maps.event.trigger(map, 'resize');
    }, 50);
    return () => clearTimeout(timer);
  }, [map, isFullscreen]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  return { isFullscreen, toggleFullscreen };
}
