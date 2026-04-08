import { X } from 'lucide-react';
import type { CountryOption, SortOption } from '@/types/branch';

import { SORT_LABELS } from '@/constants/ui';

interface ActiveFiltersProps {
  selectedCountry: string | null;
  countries: CountryOption[];
  radius: number | null;
  sort: SortOption;
  defaultSort: SortOption;
  onClearCountry: () => void;
  onClearRadius: () => void;
  onClearSort: () => void;
  onClearAll: () => void;
}

function FilterPill({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <button
      onClick={onClear}
      className="flex cursor-pointer items-center gap-1.5 rounded-[20px] bg-midnight px-3 py-1.5 text-[0.8rem] font-medium text-warm-white transition-colors duration-200 hover:bg-red-600"
    >
      {label}
      <X className="h-3 w-3" />
    </button>
  );
}

export default function ActiveFilters({
  selectedCountry,
  countries,
  radius,
  sort,
  defaultSort,
  onClearCountry,
  onClearRadius,
  onClearSort,
  onClearAll,
}: ActiveFiltersProps) {
  const isSortNonDefault = sort !== defaultSort;
  const hasFilters =
    selectedCountry !== null || radius !== null || isSortNonDefault;
  if (!hasFilters) return null;

  const countryName = countries.find(
    (c) => c.countryCode === selectedCountry,
  )?.country;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[0.85rem] font-medium text-slate-brand">
        Active filters:
      </span>

      {selectedCountry && countryName && (
        <FilterPill label={countryName} onClear={onClearCountry} />
      )}

      {isSortNonDefault && (
        <FilterPill label={SORT_LABELS[sort]} onClear={onClearSort} />
      )}

      {radius !== null && (
        <FilterPill label={`Within ${radius} km`} onClear={onClearRadius} />
      )}

      <button
        onClick={onClearAll}
        className="cursor-pointer text-[0.8rem] font-medium text-slate-brand underline transition-colors duration-200 hover:text-midnight"
      >
        Clear all
      </button>
    </div>
  );
}
