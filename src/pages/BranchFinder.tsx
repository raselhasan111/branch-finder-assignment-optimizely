import { useState, useDeferredValue } from 'react';
import MapPlaceholder from '@/components/branches/MapPlaceholder';
import SearchBar from '@/components/branches/SearchBar';
import BranchCard from '@/components/branches/BranchCard';
import Pagination from '@/components/branches/Pagination';
import BranchListSkeleton from '@/components/branches/BranchListSkeleton';
import BranchError from '@/components/branches/BranchError';
import { useBranches } from '@/hooks/use-branches';

const ITEMS_PER_PAGE = 12;

export default function BranchFinder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const deferredQuery = useDeferredValue(searchQuery);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const { data, isLoading, isError, error, refetch } = useBranches({
    query: deferredQuery || undefined,
    limit: ITEMS_PER_PAGE,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
  });

  const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0;

  return (
    <div className="pt-20">
      {/* Hero Map */}
      <MapPlaceholder />

      {/* Search */}
      <SearchBar value={searchQuery} onChange={handleSearchChange} />
      {/* <div className="mx-auto max-w-[700px] px-4">
        <FilterPills
          activeFilters={activeFilters}
          onToggle={handleToggleFilter}
          onClear={handleClearFilters}
        />
      </div> */}
      {/* Results */}
      <section className="mx-auto max-w-[1400px] px-[5%] pb-32 pt-20">
        {/* Header */}
        <div className="mb-12 flex max-w-[800px] flex-col">
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
            {data
              ? `${data.total} Branch${data.total !== 1 ? 'es' : ''} Found`
              : 'Searching...'}
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

        {/* Loading */}
        {isLoading && <BranchListSkeleton />}

        {/* Error */}
        {isError && (
          <BranchError error={error as Error} onRetry={() => refetch()} />
        )}

        {/* Card Grid */}
        {data && data.branches.length > 0 && (
          <div
            className="grid gap-10"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            }}
          >
            {data.branches.map((branch) => (
              <BranchCard key={branch._id} branch={branch} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {data && data.branches.length === 0 && (
          <div className="py-20 text-center">
            <p
              className="text-[1.15rem] font-light text-slate-brand"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              No branches found. Try a different search term.
            </p>
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
