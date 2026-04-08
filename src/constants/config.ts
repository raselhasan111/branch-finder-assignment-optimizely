export const ITEMS_PER_PAGE = 12;
export const BATCH_SIZE = 100;

export const RADIUS_OPTIONS: { value: number | null; label: string }[] = [
  { value: null, label: 'Any Distance' },
  { value: 25, label: '25 km' },
  { value: 50, label: '50 km' },
  { value: 100, label: '100 km' },
  { value: 250, label: '250 km' },
];
