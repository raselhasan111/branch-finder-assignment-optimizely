import { useState, useMemo } from 'react';
import MapPlaceholder from '@/components/branches/MapPlaceholder';
import SearchBar from '@/components/branches/SearchBar';
import FilterPills from '@/components/branches/FilterPills';
import BranchCard from '@/components/branches/BranchCard';
import Pagination from '@/components/branches/Pagination';
import { branches } from '@/data/branches';

const ITEMS_PER_PAGE = 6;

export default function BranchFinder() {
  const [searchQuery, setSearchQuery] = useState('San Francisco, CA');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBranches = useMemo(() => {
    return branches.filter((branch) => {
      if (activeFilters.length === 0) return true;
      return activeFilters.some((filter) => branch.services.includes(filter));
    });
  }, [activeFilters]);

  const totalPages = Math.ceil(filteredBranches.length / ITEMS_PER_PAGE);
  const paginatedBranches = filteredBranches.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleToggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
    setCurrentPage(1);
  };

  return (
    <div className="pt-20">
      {/* Hero Map */}
      <MapPlaceholder />

      {/* Search + Filters */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <div className="mx-auto max-w-[700px] px-4">
        <FilterPills
          activeFilters={activeFilters}
          onToggle={handleToggleFilter}
          onClear={handleClearFilters}
        />
      </div>

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
            {filteredBranches.length} Branch
            {filteredBranches.length !== 1 ? 'es' : ''} Found
          </h2>
          {searchQuery && (
            <p
              className="mt-2 text-[1rem] font-light text-slate-brand"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Showing results for &ldquo;{searchQuery}&rdquo;
            </p>
          )}
        </div>

        {/* Card Grid */}
        <div
          className="grid gap-[2.5rem]"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          }}
        >
          {paginatedBranches.map((branch) => (
            <BranchCard key={branch.id} branch={branch} />
          ))}
        </div>

        {/* Empty state */}
        {filteredBranches.length === 0 && (
          <div className="py-20 text-center">
            <p
              className="text-[1.15rem] font-light text-slate-brand"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              No branches match your current filters. Try adjusting your
              criteria.
            </p>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </section>
    </div>
  );
}
