import { useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { SortOption } from '@/types/branch';
import * as React from 'react';

export interface BranchNavigationHandlers {
  handleSearchChange: (value: string) => void;
  handleCountrySelect: (code: string | null) => void;
  handleSortChange: (sort: SortOption) => void;
  handleRadiusChange: (r: number | null) => void;
  handleSmartSearchToggle: (enabled: boolean) => void;
  handleClearAll: () => void;
  handlePageChange: (page: number) => void;
  resultsRef: React.RefObject<HTMLElement | null>;
}

/**
 * Encapsulates all URL search-param navigation handlers for the branch finder.
 */
export function useBranchNavigation(): BranchNavigationHandlers {
  const navigate = useNavigate({ from: '/' });
  const resultsRef = useRef<HTMLElement>(null);

  const handleSearchChange = (value: string) => {
    void navigate({
      search: (prev) => ({ ...prev, q: value, page: 1 }),
      replace: true,
    });
  };

  const handleCountrySelect = (code: string | null) => {
    void navigate({
      search: (prev) => ({ ...prev, country: code ?? undefined, page: 1 }),
      replace: true,
    });
  };

  const handleSortChange = (sort: SortOption) => {
    void navigate({
      search: (prev) => ({ ...prev, sort, page: 1 }),
      replace: true,
    });
  };

  const handleRadiusChange = (r: number | null) => {
    void navigate({
      search: (prev) => ({ ...prev, radius: r ?? undefined, page: 1 }),
      replace: true,
    });
  };

  const handleSmartSearchToggle = (enabled: boolean) => {
    void navigate({
      search: (prev) => ({ ...prev, smart: enabled, page: 1 }),
      replace: true,
    });
  };

  const handleClearAll = () => {
    void navigate({
      search: (prev) => ({
        ...prev,
        country: undefined,
        radius: undefined,
        sort: 'relevance' as SortOption,
        page: 1,
      }),
      replace: true,
    });
  };

  const handlePageChange = (page: number) => {
    void navigate({
      search: (prev) => ({ ...prev, page }),
      replace: true,
    });
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return {
    handleSearchChange,
    handleCountrySelect,
    handleSortChange,
    handleRadiusChange,
    handleSmartSearchToggle,
    handleClearAll,
    handlePageChange,
    resultsRef,
  };
}
