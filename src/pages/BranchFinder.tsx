import { useMemo, useDeferredValue, useRef } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import BranchMap from '@/components/branches/BranchMap';
import SearchBar from '@/components/branches/SearchBar';
import CountryFilter from '@/components/branches/CountryFilter';
import SortSelect from '@/components/branches/SortSelect';
import DistanceRadius from '@/components/branches/DistanceRadius';
import ActiveFilters from '@/components/branches/ActiveFilters';
import BranchCard from '@/components/branches/BranchCard';
import Pagination from '@/components/branches/Pagination';
import BranchListSkeleton from '@/components/branches/BranchListSkeleton';
import BranchError from '@/components/branches/BranchError';
import { useBranches } from '@/hooks/use-branches';
import { useDebounce } from '@/hooks/use-debounce';
import { useAllBranches, useCountryOptions } from '@/hooks/use-all-branches';
import { useLocation } from '@/contexts/LocationContext';
import { filterAndSortBranches } from '@/lib/filter-branches';
import type { SortOption } from '@/types/branch';

const ITEMS_PER_PAGE = 12;

export default function BranchFinder() {
  const {
    q,
    page: currentPage,
    country: selectedCountry,
    sort: sortOption,
    radius,
    smart: isSmartSearch,
  } = useSearch({ from: '/' });
  const navigate = useNavigate({ from: '/' });
  const resultsRef = useRef<HTMLElement>(null);

  const deferredQuery = useDeferredValue(q);
  const debouncedQuery = useDebounce(deferredQuery, 300);
  const { location } = useLocation();
  const { countries, isLoading: isCountriesLoading } = useCountryOptions();

  const hasSearchQuery = debouncedQuery.trim().length >= 2;

  // Derive effective sort: auto-select "distance" when geolocated and no explicit choice
  const effectiveSort: SortOption =
    sortOption === 'relevance' && !hasSearchQuery && location
      ? 'distance'
      : sortOption;

  const hasClientFilters =
    selectedCountry !== undefined ||
    radius !== undefined ||
    effectiveSort !== 'relevance';

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
  const {
    displayBranches,
    mapBranches,
    totalResults,
    isLoading,
    isError,
    error,
    refetch,
    isTruncated,
  } = useMemo(() => {
    // When searching: use server results, optionally post-filter
    if (hasSearchQuery) {
      // Treat stale placeholder data as loading — don't show previous results
      if (!serverData || serverIsPlaceholder)
        return {
          displayBranches: [],
          mapBranches: [],
          totalResults: 0,
          isLoading: serverIsLoading || serverIsPlaceholder,
          isError: serverIsError,
          error: serverError,
          refetch: serverRefetch,
          isTruncated: false,
        };

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
        {
          country: selectedCountry ?? null,
          radius: radius ?? null,
          sort: effectiveSort,
          userLat: location?.latitude ?? null,
          userLon: location?.longitude ?? null,
        },
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

    // No search query: use full dataset with client-side filtering
    if (!allData)
      return {
        displayBranches: [],
        mapBranches: [],
        totalResults: 0,
        isLoading: allIsLoading,
        isError: allIsError,
        error: allError,
        refetch: allRefetch,
        isTruncated: false,
      };

    const result = filterAndSortBranches(
      allData,
      {
        country: selectedCountry ?? null,
        radius: radius ?? null,
        sort: effectiveSort,
        userLat: location?.latitude ?? null,
        userLon: location?.longitude ?? null,
      },
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
    selectedCountry,
    radius,
    effectiveSort,
    location,
    currentPage,
  ]);

  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  const handleSearchChange = (value: string) => {
    void navigate({
      search: (prev) => ({ ...prev, q: value, page: 1 }),
      replace: true,
    });
  };

  const handleCountrySelect = (code: string | null) => {
    void navigate({
      search: (prev) => ({ ...prev, country: code ?? undefined, page: 1 }),
      replace: true,
    });
  };

  const handleSortChange = (sort: SortOption) => {
    void navigate({
      search: (prev) => ({ ...prev, sort, page: 1 }),
      replace: true,
    });
  };

  const handleRadiusChange = (r: number | null) => {
    void navigate({
      search: (prev) => ({ ...prev, radius: r ?? undefined, page: 1 }),
      replace: true,
    });
  };

  const handleSmartSearchToggle = (enabled: boolean) => {
    void navigate({
      search: (prev) => ({ ...prev, smart: enabled, page: 1 }),
      replace: true,
    });
  };

  const handleClearAll = () => {
    void navigate({
      search: (prev) => ({
        ...prev,
        country: undefined,
        radius: undefined,
        sort: 'relevance' as SortOption,
        page: 1,
      }),
      replace: true,
    });
  };

  return (
    <div>
      {/* Hero Map */}
      <BranchMap branches={mapBranches} />

      {/* Search */}
      <SearchBar
        value={q}
        onChange={handleSearchChange}
        isSmartSearch={isSmartSearch}
        onSmartSearchChange={handleSmartSearchToggle}
      />

      {/* Country Filter */}
      <CountryFilter
        countries={countries}
        selected={selectedCountry ?? null}
        isLoading={isCountriesLoading}
        onSelect={handleCountrySelect}
      />

      {/* Results */}
      <section
        ref={resultsRef}
        className="mx-auto max-w-[1400px] px-[5%] pb-32 pt-16"
      >
        {/* Controls row: header + sort/radius */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col lg:max-w-[600px]">
            <span
              className="mb-3 text-[0.9rem] font-medium uppercase tracking-[3px] text-sage"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Branch Results
            </span>
            <h2
              className="text-midnight"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 700,
                letterSpacing: '-1px',
                lineHeight: 1.2,
              }}
            >
              {isLoading
                ? 'Searching...'
                : `${totalResults} Branch${totalResults !== 1 ? 'es' : ''} Found`}
            </h2>
            {hasSearchQuery && deferredQuery && (
              <p
                className="mt-2 text-[1rem] font-light tracking-wider text-slate-brand"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Showing results for &ldquo;{deferredQuery}&rdquo;
              </p>
            )}
          </div>

          {/* Sort & Radius controls */}
          <div className="flex flex-wrap items-center gap-4 max-lg:justify-end">
            <SortSelect
              value={effectiveSort}
              onChange={handleSortChange}
              hasLocation={!!location}
              hasSearchQuery={hasSearchQuery}
            />
            {location && (
              <DistanceRadius
                value={radius ?? null}
                onChange={handleRadiusChange}
              />
            )}
          </div>
        </div>

        {/* Active filters bar */}
        <div className="mb-8">
          <ActiveFilters
            selectedCountry={selectedCountry ?? null}
            countries={countries}
            radius={radius ?? null}
            sort={effectiveSort}
            defaultSort={
              hasSearchQuery ? 'relevance' : location ? 'distance' : 'relevance'
            }
            onClearCountry={() => handleCountrySelect(null)}
            onClearRadius={() => handleRadiusChange(null)}
            onClearSort={() =>
              handleSortChange(
                hasSearchQuery
                  ? 'relevance'
                  : location
                    ? 'distance'
                    : 'relevance',
              )
            }
            onClearAll={handleClearAll}
          />
        </div>

        {/* Truncation warning */}
        {isTruncated && (
          <div
            className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-[0.95rem] text-amber-800"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Showing filtered results from top 100 matches. Try a more specific
            search for complete results.
          </div>
        )}

        {/* Loading */}
        {isLoading && <BranchListSkeleton />}

        {/* Error */}
        {isError && (
          <BranchError error={error as Error} onRetry={() => refetch()} />
        )}

        {/* Card Grid */}
        {!isLoading && displayBranches.length > 0 && (
          <div
            className="grid gap-10"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            }}
          >
            {displayBranches.map((branch, index) => (
              <BranchCard
                key={branch._id}
                branch={branch}
                isClosest={
                  index === 0 &&
                  currentPage === 1 &&
                  effectiveSort === 'distance'
                }
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && displayBranches.length === 0 && !isError && (
          <div className="py-20 text-center">
            <p
              className="text-[1.15rem] font-light text-slate-brand"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {hasClientFilters
                ? 'No branches match your current filters. Try adjusting your selection.'
                : 'No branches found. Try a different search term.'}
            </p>
            {hasClientFilters && (
              <button
                onClick={handleClearAll}
                className="mt-4 text-[0.95rem] cursor-pointer font-medium text-gold underline transition-colors hover:text-midnight"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              void navigate({
                search: (prev) => ({ ...prev, page }),
                replace: true,
              });
              resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}
      </section>
    </div>
  );
}
