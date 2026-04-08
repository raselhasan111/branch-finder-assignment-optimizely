import SortSelect from '@/components/branches/SortSelect';
import DistanceRadius from '@/components/branches/DistanceRadius';
import type { SortOption } from '@/types/branch';

interface BranchControlsProps {
  effectiveSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  hasLocation: boolean;
  hasSearchQuery: boolean;
  radius: number | null;
  onRadiusChange: (r: number | null) => void;
}

export default function BranchControls({
  effectiveSort,
  onSortChange,
  hasLocation,
  hasSearchQuery,
  radius,
  onRadiusChange,
}: BranchControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 max-xl:justify-end">
      <SortSelect
        value={effectiveSort}
        onChange={onSortChange}
        hasLocation={hasLocation}
        hasSearchQuery={hasSearchQuery}
      />
      {hasLocation && (
        <DistanceRadius value={radius} onChange={onRadiusChange} />
      )}
    </div>
  );
}
