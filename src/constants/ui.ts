import type { SortOption } from '@/types/branch';

export const SORT_LABELS: Record<SortOption, string> = {
  relevance: 'Relevance',
  distance: 'Nearest First',
  name: 'Name A\u2013Z',
};

export const SORT_OPTIONS: {
  value: SortOption;
  label: string;
  needsLocation?: boolean;
}[] = [
  { value: 'relevance', label: SORT_LABELS.relevance },
  { value: 'distance', label: SORT_LABELS.distance, needsLocation: true },
  { value: 'name', label: SORT_LABELS.name },
];

export const FLAG_OFFSET = 0x1f1e6;
export const SKELETON_WIDTHS = [120, 140, 100, 160, 110, 130, 150, 90];
