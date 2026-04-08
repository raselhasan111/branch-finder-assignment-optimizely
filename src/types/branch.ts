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
  semantic?: boolean;
}

export interface PaginatedBranches {
  branches: Branch[];
  total: number;
}

export interface CountryOption {
  country: string;
  countryCode: string;
  count: number;
}

export interface BranchWithCoords {
  branch: Branch;
  lat: number;
  lng: number;
}

export interface HoveredCluster {
  position: google.maps.LatLngLiteral;
  count: number;
}

export type SortOption = 'relevance' | 'distance' | 'name';

export interface FilterOptions {
  country: string | null;
  radius: number | null;
  sort: SortOption;
  userLat: number | null;
  userLon: number | null;
}

export interface FilteredResult {
  branches: Branch[];
  total: number;
  allFiltered: Branch[];
}
