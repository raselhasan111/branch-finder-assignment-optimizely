import { useDeferredValue } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useDebounce } from '@/hooks/use-debounce';
import { useCountryOptions } from '@/hooks/use-all-branches';
import { useLocation } from '@/contexts/LocationContext';
import { useBranchData } from '@/hooks/branches/use-branch-data';
import { useBranchNavigation } from '@/hooks/branches/use-branch-navigation';
import type { SortOption, CountryOption } from '@/types/branch';
import type { BranchNavigationHandlers } from '@/hooks/branches/use-branch-navigation';
import type { BranchDataResult } from '@/hooks/branches/use-branch-data';

interface BranchFinderState extends BranchDataResult, BranchNavigationHandlers {
  // Search
  q: string;
  deferredQuery: string;
  hasSearchQuery: boolean;
  isSmartSearch: boolean;

  // Pagination
  currentPage: number;

  // Filters & sorting
  selectedCountry: string | undefined;
  effectiveSort: SortOption;
  sortOption: SortOption;
  radius: number | undefined;
  hasClientFilters: boolean;

  // Location
  hasLocation: boolean;

  // Countries
  countries: CountryOption[];
  isCountriesLoading: boolean;
}

/**
 * Top-level hook for the BranchFinder page.
 * Composes URL state, data fetching, filtering, and navigation handlers.
 */
export function useBranchFinder(): BranchFinderState {
  // ── URL search params ──────────────────────────────────────────────────
  const {
    q,
    page: currentPage,
    country: selectedCountry,
    sort: sortOption,
    radius,
    smart: isSmartSearch,
  } = useSearch({ from: '/' });

  // ── Derived search state ───────────────────────────────────────────────
  const deferredQuery = useDeferredValue(q);
  const debouncedQuery = useDebounce(deferredQuery, 300);
  const { location } = useLocation();
  const { countries, isLoading: isCountriesLoading } = useCountryOptions();

  const hasSearchQuery = debouncedQuery.trim().length >= 2;

  // Auto-select "distance" when geolocated and no explicit choice
  const effectiveSort: SortOption =
    sortOption === 'relevance' && !hasSearchQuery && location
      ? 'distance'
      : sortOption;

  const hasClientFilters =
    selectedCountry !== undefined ||
    radius !== undefined ||
    effectiveSort !== 'relevance';

  // ── Data fetching + filtering ──────────────────────────────────────────
  const branchData = useBranchData({
    hasSearchQuery,
    debouncedQuery,
    hasClientFilters,
    currentPage,
    isSmartSearch,
    selectedCountry,
    radius,
    effectiveSort,
    userLat: location?.latitude ?? null,
    userLon: location?.longitude ?? null,
  });

  // ── Navigation handlers ────────────────────────────────────────────────
  const navigation = useBranchNavigation();

  return {
    // Search
    q,
    deferredQuery,
    hasSearchQuery,
    isSmartSearch,

    // Pagination
    currentPage,

    // Filters & sorting
    selectedCountry,
    effectiveSort,
    sortOption,
    radius,
    hasClientFilters,

    // Location
    hasLocation: !!location,

    // Countries
    countries,
    isCountriesLoading,

    // Data (spread from useBranchData)
    ...branchData,

    // Navigation (spread from useBranchNavigation)
    ...navigation,
  };
}
