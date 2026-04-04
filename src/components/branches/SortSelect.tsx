import { ArrowUpDown } from 'lucide-react';
import type { SortOption } from '@/types/branch';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  hasLocation: boolean;
  hasSearchQuery: boolean;
}

const SORT_OPTIONS: {
  value: SortOption;
  label: string;
  needsLocation?: boolean;
}[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'distance', label: 'Nearest First', needsLocation: true },
  { value: 'name', label: 'Name A\u2013Z' },
];

export default function SortSelect({
  value,
  onChange,
  hasLocation,
  hasSearchQuery,
}: SortSelectProps) {
  const options = SORT_OPTIONS.filter(
    (opt) =>
      (!opt.needsLocation || hasLocation) &&
      (opt.value !== 'relevance' || hasSearchQuery),
  );

  if (options.length <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-slate-brand" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="cursor-pointer appearance-none rounded-[25px] border-2 border-transparent bg-cream px-4 py-2 pr-8 text-[0.85rem] font-medium text-midnight transition-colors duration-300 hover:border-gold focus:border-gold focus:outline-none"
        style={{
          fontFamily: "'Jost', sans-serif",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230a1628' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
