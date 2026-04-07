import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the window width is below a certain breakpoint.
 * Defaults to 640px (Tailwind's 'sm' breakpoint).
 */
export function useIsMobile(breakpoint: number = 640): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const handleValueChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    // Initial check
    handleValueChange(mediaQuery);

    mediaQuery.addEventListener('change', handleValueChange);
    return () => mediaQuery.removeEventListener('change', handleValueChange);
  }, [breakpoint]);

  return isMobile;
}
