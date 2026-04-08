import { ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';
import type { CountryOption } from '@/types/branch';
import { SKELETON_WIDTHS } from '@/constants/ui';
import { countryFlag } from '@/lib/utils.ts';

interface CountryFilterProps {
  countries: CountryOption[];
  selected: string | null;
  onSelect: (countryCode: string | null) => void;
  isLoading?: boolean;
}

function CountryFilterSkeleton() {
  return (
    <div className="relative mx-auto mt-5 w-full max-w-187.5 px-4">
      <div className="flex items-center gap-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream/50" />
        <div className="flex min-w-0 flex-1 gap-2 overflow-hidden py-1">
          {SKELETON_WIDTHS.map((w, i) => (
            <div
              key={i}
              className="h-9.5 shrink-0 animate-pulse rounded-[25px] bg-cream"
              style={{ width: w }}
            />
          ))}
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream/50" />
      </div>
    </div>
  );
}

export default function CountryFilter({
  countries,
  selected,
  onSelect,
  isLoading,
}: CountryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [countries, updateScrollState]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === 'left' ? -200 : 200,
      behavior: 'smooth',
    });
  };

  if (isLoading) return <CountryFilterSkeleton />;
  if (countries.length === 0) return null;

  return (
    <div className="relative mx-auto mt-5 w-full max-w-187.5 px-4">
      <div className="flex items-center gap-1">
        {/* Left arrow — always rendered, fades in/out */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 focus-visible:outline-none ${
            canScrollLeft
              ? 'cursor-pointer bg-cream text-midnight hover:bg-gold focus-visible:bg-gold'
              : 'cursor-not-allowed bg-cream/50 text-midnight/25'
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Scroll area with fade masks */}
        <div className="relative min-w-0 flex-1">
          {/* Left fade mask */}
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-warm-white to-transparent transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Pills container */}
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
          >
            {/* All countries pill */}
            <button
              onClick={() => onSelect(null)}
              className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[25px] border-2 px-4 py-2 text-[0.85rem] font-medium transition-all duration-300 ${
                selected === null
                  ? 'border-gold bg-midnight text-warm-white'
                  : 'border-transparent bg-cream text-midnight hover:border-gold'
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              All Countries
            </button>

            {countries.map((c) => (
              <button
                key={c.countryCode}
                onClick={() =>
                  onSelect(selected === c.countryCode ? null : c.countryCode)
                }
                className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[25px] border-2 px-4 py-2 text-[0.85rem] font-medium transition-all duration-300 ${
                  selected === c.countryCode
                    ? 'border-gold bg-midnight text-warm-white'
                    : 'border-transparent bg-cream text-midnight hover:border-gold'
                }`}
              >
                <span className="text-base leading-none">
                  {countryFlag(c.countryCode)}
                </span>
                {c.country}
                <span className="opacity-50">({c.count})</span>
              </button>
            ))}
          </div>

          {/* Right fade mask */}
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-warm-white to-transparent transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>

        {/* Right arrow — always rendered, fades in/out */}
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 focus-visible:outline-none ${
            canScrollRight
              ? 'cursor-pointer bg-cream text-midnight hover:bg-gold focus-visible:bg-gold'
              : 'cursor-not-allowed bg-cream/50 text-midnight/25'
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
