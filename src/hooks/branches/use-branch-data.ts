import { useMemo } from 'react';
import { useBranches } from '@/hooks/use-branches';
import { useAllBranches } from '@/hooks/use-all-branches';
import { filterAndSortBranches } from '@/lib/filter-branches';
import type { Branch } from '@/types/branch';
import type {
  BranchDataParams,
  ServerDataParams,
  AllDataParams,
} from '@/types/hooks';
import type { FilterOptions } from '@/types/branch';

import { ITEMS_PER_PAGE } from '@/constants/config';

export interface BranchDataResult {
  displayBranches: Branch[];
  mapBranches: Branch[];
  totalResults: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isTruncated: boolean;
}

/**
 * Orchestrates the two data sources (server search vs full dataset)
 * and applies client-side filtering, sorting, and pagination.
 */
export function useBranchData(params: BranchDataParams): BranchDataResult {
  const {
    hasSearchQuery,
    debouncedQuery,
    hasClientFilters,
    currentPage,
    isSmartSearch,
    selectedCountry,
    radius,
    effectiveSort,
    userLat,
    userLon,
  } = params;

  // Server-side search (used when text query is active)
  const serverQuery = useBranches({
    query: hasSearchQuery ? debouncedQuery : undefined,
    limit: hasClientFilters ? 100 : ITEMS_PER_PAGE,
    skip: hasClientFilters ? 0 : (currentPage - 1) * ITEMS_PER_PAGE,
    semantic: isSmartSearch,
  });

  // Full dataset (used when client-side filters are active without search)
  const allBranchesQuery = useAllBranches();

  // Destructure stable properties — avoids useMemo recomputing on every render
  // (useQuery returns a new wrapper object each render, but these properties are stable)
  const {
    data: serverData,
    isPlaceholderData: serverIsPlaceholder,
    isLoading: serverIsLoading,
    isError: serverIsError,
    error: serverError,
    refetch: serverRefetch,
  } = serverQuery;
  const {
    data: allData,
    isLoading: allIsLoading,
    isError: allIsError,
    error: allError,
    refetch: allRefetch,
  } = allBranchesQuery;

  // Determine which data source to use and apply client-side filtering
  const country = selectedCountry ?? null;
  const radiusKm = radius ?? null;

  const resolved = useMemo(() => {
    const filterOptions: FilterOptions = {
      country,
      radius: radiusKm,
      sort: effectiveSort,
      userLat,
      userLon,
    };

    if (hasSearchQuery) {
      return resolveServerData({
        serverData,
        serverIsPlaceholder,
        serverIsLoading,
        serverIsError,
        serverError,
        serverRefetch,
        hasClientFilters,
        filterOptions,
        currentPage,
      });
    }

    return resolveAllData({
      allData,
      allIsLoading,
      allIsError,
      allError,
      allRefetch,
      filterOptions,
      currentPage,
    });
  }, [
    hasSearchQuery,
    hasClientFilters,
    serverData,
    serverIsPlaceholder,
    serverIsLoading,
    serverIsError,
    serverError,
    serverRefetch,
    allData,
    allIsLoading,
    allIsError,
    allError,
    allRefetch,
    country,
    radiusKm,
    effectiveSort,
    userLat,
    userLon,
    currentPage,
  ]);

  const totalPages = Math.ceil(resolved.totalResults / ITEMS_PER_PAGE);

  return {
    ...resolved,
    totalPages,
    error: resolved.error as Error | null,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function resolveServerData({
  serverData,
  serverIsPlaceholder,
  serverIsLoading,
  serverIsError,
  serverError,
  serverRefetch,
  hasClientFilters,
  filterOptions,
  currentPage,
}: ServerDataParams) {
  // Treat stale placeholder data as loading — don't show previous results
  if (!serverData || serverIsPlaceholder) {
    return {
      displayBranches: [] as Branch[],
      mapBranches: [] as Branch[],
      totalResults: 0,
      isLoading: serverIsLoading || serverIsPlaceholder,
      isError: serverIsError,
      error: serverError,
      refetch: serverRefetch,
      isTruncated: false,
    };
  }

  if (!hasClientFilters) {
    return {
      displayBranches: serverData.branches,
      mapBranches: serverData.branches,
      totalResults: serverData.total,
      isLoading: false,
      isError: false,
      error: null,
      refetch: serverRefetch,
      isTruncated: false,
    };
  }

  const result = filterAndSortBranches(
    serverData.branches,
    filterOptions,
    currentPage,
    ITEMS_PER_PAGE,
  );

  return {
    displayBranches: result.branches,
    mapBranches: result.allFiltered,
    totalResults: result.total,
    isLoading: false,
    isError: false,
    error: null,
    refetch: serverRefetch,
    isTruncated: hasClientFilters && serverData.total > 100,
  };
}

function resolveAllData({
  allData,
  allIsLoading,
  allIsError,
  allError,
  allRefetch,
  filterOptions,
  currentPage,
}: AllDataParams) {
  if (!allData) {
    return {
      displayBranches: [] as Branch[],
      mapBranches: [] as Branch[],
      totalResults: 0,
      isLoading: allIsLoading,
      isError: allIsError,
      error: allError,
      refetch: allRefetch,
      isTruncated: false,
    };
  }

  const result = filterAndSortBranches(
    allData,
    filterOptions,
    currentPage,
    ITEMS_PER_PAGE,
  );

  return {
    displayBranches: result.branches,
    mapBranches: result.allFiltered,
    totalResults: result.total,
    isLoading: false,
    isError: false,
    error: null,
    refetch: allRefetch,
    isTruncated: false,
  };
}
