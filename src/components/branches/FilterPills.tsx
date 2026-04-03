import { X } from 'lucide-react';

const FILTERS = ['ATM', '24/7 Access', 'Full Service', 'Drive-Thru'];

interface FilterPillsProps {
  activeFilters: string[];
  onToggle: (filter: string) => void;
  onClear: () => void;
}

export default function FilterPills({
  activeFilters,
  onToggle,
  onClear,
}: FilterPillsProps) {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      {FILTERS.map((filter) => {
        const isActive = activeFilters.includes(filter);
        return (
          <button
            key={filter}
            onClick={() => onToggle(filter)}
            className="rounded-[25px] border-2 px-6 py-[0.6rem] text-[0.85rem] font-semibold uppercase tracking-[0.5px] transition-all duration-300 hover:-translate-y-[2px]"
            style={{
              fontFamily: "'Jost', sans-serif",
              background: isActive ? '#0a1628' : '#f8f6f1',
              color: isActive ? '#fefdfb' : '#0a1628',
              borderColor: isActive ? '#d4af37' : 'transparent',
            }}
          >
            {filter}
          </button>
        );
      })}
      {activeFilters.length > 0 && (
        <button
          onClick={onClear}
          className="ml-2 flex items-center gap-1 rounded-[25px] px-4 py-[0.6rem] text-[0.85rem] font-medium text-slate-brand transition-colors duration-300 hover:text-midnight"
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          <X className="h-4 w-4" />
          Clear
        </button>
      )}
    </div>
  );
}
