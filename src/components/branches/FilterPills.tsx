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
    <div className="mt-6 flex flex-wrap justify-center gap-4">
      {FILTERS.map((filter) => {
        const isActive = activeFilters.includes(filter);
        return (
          <button
            key={filter}
            onClick={() => onToggle(filter)}
            className={`rounded-[25px] border-2 px-6 py-[0.6rem] text-[0.9rem] font-medium transition-all duration-300 ${
              isActive
                ? 'border-gold bg-midnight text-warm-white'
                : 'border-transparent bg-cream text-midnight hover:border-gold'
            }`}
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {filter}
          </button>
        );
      })}
      {activeFilters.length > 0 && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 rounded-[25px] border-2 border-transparent bg-red-100 px-6 py-[0.6rem] text-[0.9rem] font-medium text-red-700 transition-all duration-300 hover:bg-red-500 hover:text-white"
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          <X className="h-4 w-4" />
          Clear
        </button>
      )}
    </div>
  );
}
