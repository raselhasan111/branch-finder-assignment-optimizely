import BranchCard from '@/components/branches/BranchCard';
import type { Branch, SortOption } from '@/types/branch';

interface BranchGridProps {
  branches: Branch[];
  currentPage: number;
  effectiveSort: SortOption;
}

export default function BranchGrid({
  branches,
  currentPage,
  effectiveSort,
}: BranchGridProps) {
  if (branches.length === 0) return null;

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-10">
      {branches.map((branch, index) => (
        <BranchCard
          key={branch._id}
          branch={branch}
          isClosest={
            index === 0 && currentPage === 1 && effectiveSort === 'distance'
          }
        />
      ))}
    </div>
  );
}
