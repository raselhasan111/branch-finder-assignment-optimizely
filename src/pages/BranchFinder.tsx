import BranchMap from '@/components/branches/BranchMap';
import SearchBar from '@/components/branches/SearchBar';
import CountryFilter from '@/components/branches/CountryFilter';
import BranchResultsHeader from '@/components/branches/BranchResultsHeader';
import BranchControls from '@/components/branches/BranchControls';
import ActiveFilters from '@/components/branches/ActiveFilters';
import BranchGrid from '@/components/branches/BranchGrid';
import EmptyState from '@/components/branches/EmptyState';
import BranchListSkeleton from '@/components/branches/BranchListSkeleton';
import BranchError from '@/components/branches/BranchError';
import Pagination from '@/components/branches/Pagination';
import { useBranchFinder } from '@/hooks/branches/use-branch-finder';

export default function BranchFinder() {
  const {
    q,
    deferredQuery,
    hasSearchQuery,
    isSmartSearch,
    selectedCountry,
    effectiveSort,
    radius,
    hasClientFilters,
    hasLocation,
    displayBranches,
    mapBranches,
    totalResults,
    totalPages,
    currentPage,
    isTruncated,
    isLoading,
    isError,
    error,
    refetch,
    countries,
    isCountriesLoading,
    handleSearchChange,
    handleCountrySelect,
    handleSortChange,
    handleRadiusChange,
    handleSmartSearchToggle,
    handleClearAll,
    handlePageChange,
    resultsRef,
  } = useBranchFinder();

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
        className="mx-auto max-w-350 px-[5%] pb-32 pt-16"
      >
        {/* Controls row: header + sort/radius */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <BranchResultsHeader
            isLoading={isLoading}
            totalResults={totalResults}
            hasSearchQuery={hasSearchQuery}
            queryText={deferredQuery}
          />
          <BranchControls
            effectiveSort={effectiveSort}
            onSortChange={handleSortChange}
            hasLocation={hasLocation}
            hasSearchQuery={hasSearchQuery}
            radius={radius ?? null}
            onRadiusChange={handleRadiusChange}
          />
        </div>

        {/* Active filters bar */}
        <div className="mb-8">
          <ActiveFilters
            selectedCountry={selectedCountry ?? null}
            countries={countries}
            radius={radius ?? null}
            sort={effectiveSort}
            defaultSort={
              hasSearchQuery
                ? 'relevance'
                : hasLocation
                  ? 'distance'
                  : 'relevance'
            }
            onClearCountry={() => handleCountrySelect(null)}
            onClearRadius={() => handleRadiusChange(null)}
            onClearSort={() =>
              handleSortChange(
                hasSearchQuery
                  ? 'relevance'
                  : hasLocation
                    ? 'distance'
                    : 'relevance',
              )
            }
            onClearAll={handleClearAll}
          />
        </div>

        {/* Truncation warning */}
        {isTruncated && (
          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-[0.95rem] text-amber-800">
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
        {!isLoading && (
          <BranchGrid
            branches={displayBranches}
            currentPage={currentPage}
            effectiveSort={effectiveSort}
          />
        )}

        {/* Empty state */}
        {!isLoading && displayBranches.length === 0 && !isError && (
          <EmptyState
            hasClientFilters={hasClientFilters}
            onClearAll={handleClearAll}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </div>
  );
}
