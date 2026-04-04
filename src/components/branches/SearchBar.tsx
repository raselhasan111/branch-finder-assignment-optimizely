import { useRef, useEffect } from 'react';
import { Search, LocateFixed } from 'lucide-react';

import { useLocation } from '@/contexts/LocationContext';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const { location, isLocating, error, fetchLocation } = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="relative z-20 mx-auto -mt-8 w-full max-w-[700px] px-4">
      <div
        className="flex h-16 items-center rounded-[50px] border-2 border-cream bg-warm-white px-6 transition-colors duration-300 hover:border-gold focus-within:border-gold"
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
        <button
          className={`ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
            location
              ? 'bg-gold text-midnight'
              : 'bg-cream hover:bg-gold hover:text-midnight'
          } ${isLocating ? 'animate-pulse opacity-70' : ''}`}
          aria-label="Use my location"
          onClick={fetchLocation}
          title={error ? error : 'Use my location'}
        >
          <LocateFixed className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
