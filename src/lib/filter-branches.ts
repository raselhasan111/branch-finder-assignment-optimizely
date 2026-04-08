import type {
  Branch,
  SortOption,
  FilterOptions,
  FilteredResult,
} from '@/types/branch';
import { calculateDistance, parseCoordinates } from '@/lib/utils';

export function filterAndSortBranches(
  branches: Branch[],
  options: FilterOptions,
  page: number,
  pageSize: number,
): FilteredResult {
  let filtered = branches;

  // Country filter
  if (options.country) {
    filtered = filtered.filter((b) => b.CountryCode === options.country);
  }

  // Distance radius filter
  if (
    options.radius !== null &&
    options.userLat !== null &&
    options.userLon !== null
  ) {
    filtered = filtered.filter((b) => {
      const [lat, lon] = parseCoordinates(b.Coordinates);
      if (lat === null || lon === null) return false;
      const dist = calculateDistance(
        options.userLat!,
        options.userLon!,
        lat,
        lon,
      );
      return dist <= options.radius!;
    });
  }

  // Sort
  filtered = sortBranches(
    filtered,
    options.sort,
    options.userLat,
    options.userLon,
  );

  const total = filtered.length;

  // Paginate
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return { branches: paged, total, allFiltered: filtered };
}

function sortBranches(
  branches: Branch[],
  sort: SortOption,
  userLat: number | null,
  userLon: number | null,
): Branch[] {
  const copy = [...branches];

  switch (sort) {
    case 'name':
      return copy.sort((a, b) => (a.Name ?? '').localeCompare(b.Name ?? ''));

    case 'distance':
      if (userLat === null || userLon === null) return copy;
      return copy.sort((a, b) => {
        const [aLat, aLon] = parseCoordinates(a.Coordinates);
        const [bLat, bLon] = parseCoordinates(b.Coordinates);
        const aDist =
          aLat !== null && aLon !== null
            ? calculateDistance(userLat, userLon, aLat, aLon)
            : Infinity;
        const bDist =
          bLat !== null && bLon !== null
            ? calculateDistance(userLat, userLon, bLat, bLon)
            : Infinity;
        return aDist - bDist;
      });

    case 'relevance':
    default:
      return copy;
  }
}
