import { useState, useMemo, useDeferredValue } from 'react';
import MapPlaceholder from '@/components/branches/MapPlaceholder';
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
import { useAllBranches, useCountryOptions } from '@/hooks/use-all-branches';
import { useLocation } from '@/contexts/LocationContext';
import { filterAndSortBranches } from '@/lib/filter-branches';
import type { SortOption } from '@/types/branch';

const ITEMS_PER_PAGE = 12;

export default function BranchFinder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const [radius, setRadius] = useState<number | null>(null);

  const deferredQuery = useDeferredValue(searchQuery);
  const { location } = useLocation();
  const { countries, isLoading: isCountriesLoading } = useCountryOptions();

  const hasSearchQuery = deferredQuery.trim().length > 0;

  // Derive effective sort: auto-select "distance" when geolocated and no explicit choice
  const effectiveSort: SortOption =
    sortOption === 'relevance' && !hasSearchQuery && location
      ? 'distance'
      : sortOption;

  const hasClientFilters =
    selectedCountry !== null ||
    radius !== null ||
    effectiveSort !== 'relevance';

  // Server-side search (used when text query is active)
  const serverQuery = useBranches({
    query: hasSearchQuery ? deferredQuery : undefined,
    limit: hasClientFilters ? 100 : ITEMS_PER_PAGE,
    skip: hasClientFilters ? 0 : (currentPage - 1) * ITEMS_PER_PAGE,
  });

  // Full dataset (used when client-side filters are active without search)
  const allBranchesQuery = useAllBranches();

  // Determine which data source to use and apply client-side filtering
  const { displayBranches, totalResults, isLoading, isError, error, refetch } =
    useMemo(() => {
      // When searching: use server results, optionally post-filter
      if (hasSearchQuery) {
        if (!serverQuery.data)
          return {
            displayBranches: [],
            totalResults: 0,
            isLoading: serverQuery.isLoading,
            isError: serverQuery.isError,
            error: serverQuery.error,
            refetch: serverQuery.refetch,
          };

        if (!hasClientFilters) {
          return {
            displayBranches: serverQuery.data.branches,
            totalResults: serverQuery.data.total,
            isLoading: false,
            isError: false,
            error: null,
            refetch: serverQuery.refetch,
          };
        }

        const result = filterAndSortBranches(
          serverQuery.data.branches,
          {
            country: selectedCountry,
            radius,
            sort: effectiveSort,
            userLat: location?.latitude ?? null,
            userLon: location?.longitude ?? null,
          },
          currentPage,
          ITEMS_PER_PAGE,
        );

        return {
          displayBranches: result.branches,
          totalResults: result.total,
          isLoading: false,
          isError: false,
          error: null,
          refetch: serverQuery.refetch,
        };
      }

      // No search query: use full dataset with client-side filtering
      if (!allBranchesQuery.data)
        return {
          displayBranches: [],
          totalResults: 0,
          isLoading: allBranchesQuery.isLoading,
          isError: allBranchesQuery.isError,
          error: allBranchesQuery.error,
          refetch: allBranchesQuery.refetch,
        };

      const result = filterAndSortBranches(
        allBranchesQuery.data,
        {
          country: selectedCountry,
          radius,
          sort: effectiveSort,
          userLat: location?.latitude ?? null,
          userLon: location?.longitude ?? null,
        },
        currentPage,
        ITEMS_PER_PAGE,
      );

      return {
        displayBranches: result.branches,
        totalResults: result.total,
        isLoading: false,
        isError: false,
        error: null,
        refetch: allBranchesQuery.refetch,
      };
    }, [
      hasSearchQuery,
      hasClientFilters,
      serverQuery,
      allBranchesQuery,
      selectedCountry,
      radius,
      effectiveSort,
      location,
      currentPage,
    ]);

  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCountrySelect = (code: string | null) => {
    setSelectedCountry(code);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort);
    setCurrentPage(1);
  };

  const handleRadiusChange = (r: number | null) => {
    setRadius(r);
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSelectedCountry(null);
    setRadius(null);
    setSortOption('relevance');
    setCurrentPage(1);
  };

  return (
    <div className="pt-20">
      {/* Hero Map */}
      <MapPlaceholder />

      {/* Search */}
      <SearchBar value={searchQuery} onChange={handleSearchChange} />

      {/* Country Filter */}
      <CountryFilter
        countries={countries}
        selected={selectedCountry}
        isLoading={isCountriesLoading}
        onSelect={handleCountrySelect}
      />

      {/* Results */}
      <section className="mx-auto max-w-[1400px] px-[5%] pb-32 pt-16">
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
            {deferredQuery && (
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
              <DistanceRadius value={radius} onChange={handleRadiusChange} />
            )}
          </div>
        </div>

        {/* Active filters bar */}
        <div className="mb-8">
          <ActiveFilters
            selectedCountry={selectedCountry}
            countries={countries}
            radius={radius}
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
            {displayBranches.map((branch) => (
              <BranchCard key={branch._id} branch={branch} />
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
                className="mt-4 text-[0.95rem] font-medium text-gold underline transition-colors hover:text-midnight"
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
            onPageChange={setCurrentPage}
          />
        )}
      </section>
    </div>
  );
}
