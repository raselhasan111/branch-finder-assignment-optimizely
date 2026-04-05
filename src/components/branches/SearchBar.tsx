import { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import SmartSearchToggle from '@/components/branches/SmartSearchToggle';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isSmartSearch: boolean;
  onSmartSearchChange: (enabled: boolean) => void;
}

export default function SearchBar({
  value,
  onChange,
  isSmartSearch,
  onSmartSearchChange,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="relative z-20 mx-auto -mt-8 w-full max-w-[700px] px-4">
      <div
        className="flex h-16 items-center rounded-[50px] border-2 border-warm-white bg-warm-white px-6 transition-colors duration-300 hover:border-gold focus-within:border-gold"
        style={{ boxShadow: '0 30px 60px rgba(10, 22, 40, 0.1)' }}
      >
        <Search className="mr-3 h-5 w-5 shrink-0 text-gold" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search by branch name or city"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-full w-full flex-1 border-none bg-transparent text-[1rem] font-normal text-midnight placeholder:text-slate-brand focus:outline-none"
          style={{ fontFamily: "'Jost', sans-serif" }}
        />
        {/* Clear button */}
        {value && (
          <button
            className="ml-2 flex shrink-0 cursor-pointer items-center justify-center text-slate-brand transition-colors duration-200 hover:text-midnight"
            aria-label="Clear search"
            onClick={() => onChange('')}
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Smart Search Toggle */}
        <div className="ml-3 shrink-0">
          <SmartSearchToggle
            enabled={isSmartSearch}
            onChange={onSmartSearchChange}
          />
        </div>
      </div>
    </div>
  );
}
