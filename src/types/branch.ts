export interface Branch {
  _id: string;
  _score: number | null;
  Name: string | null;
  Street: string | null;
  City: string | null;
  Country: string | null;
  CountryCode: string | null;
  ZipCode: string | null;
  Coordinates: string | null;
  Phone: string | null;
  Email: string | null;
}

export interface BranchQueryResult {
  Branch: {
    items: Branch[];
    total: number;
  };
}

export interface BranchSearchParams {
  query?: string;
  limit?: number;
  skip?: number;
}

export interface PaginatedBranches {
  branches: Branch[];
  total: number;
}

export function parseCoordinates(
  coords: string | null,
): [number | null, number | null] {
  if (!coords) return [null, null];
  const parts = coords.split(',').map((s) => parseFloat(s.trim()));
  if (parts.length !== 2 || parts.some(isNaN)) return [null, null];
  return [parts[0], parts[1]];
}
