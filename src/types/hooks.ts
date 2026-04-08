import type {
  Branch,
  FilterOptions,
  SortOption,
  PaginatedBranches,
  BranchWithCoords,
  HoveredCluster,
} from '@/types/branch';

export interface BranchDataParams {
  hasSearchQuery: boolean;
  debouncedQuery: string;
  hasClientFilters: boolean;
  currentPage: number;
  isSmartSearch: boolean;
  selectedCountry: string | undefined;
  radius: number | undefined;
  effectiveSort: SortOption;
  userLat: number | null;
  userLon: number | null;
}

export interface ServerDataParams {
  serverData: PaginatedBranches | undefined;
  serverIsPlaceholder: boolean;
  serverIsLoading: boolean;
  serverIsError: boolean;
  serverError: Error | null;
  serverRefetch: () => void;
  hasClientFilters: boolean;
  filterOptions: FilterOptions;
  currentPage: number;
}

export interface AllDataParams {
  allData: Branch[] | undefined;
  allIsLoading: boolean;
  allIsError: boolean;
  allError: Error | null;
  allRefetch: () => void;
  filterOptions: FilterOptions;
  currentPage: number;
}

export interface UseBranchMarkersOptions {
  map: google.maps.Map | null;
  isLoaded: boolean;
  branchesWithCoords: BranchWithCoords[];
  onMarkerClick?: (branch: Branch) => void;
  setSelectedBranch: (branch: Branch) => void;
  setHoveredCluster: (cluster: HoveredCluster | null) => void;
}
