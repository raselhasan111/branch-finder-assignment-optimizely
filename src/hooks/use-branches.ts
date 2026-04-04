import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphql/client';
import { SEARCH_BRANCHES, LIST_BRANCHES } from '@/lib/graphql/queries';
import type {
  BranchQueryResult,
  BranchSearchParams,
  PaginatedBranches,
} from '@/types/branch';

const DEFAULT_LIMIT = 12;

async function fetchBranches(
  params: BranchSearchParams,
): Promise<PaginatedBranches> {
  const limit = params.limit ?? DEFAULT_LIMIT;
  const skip = params.skip ?? 0;
  const hasQuery = params.query && params.query.trim().length > 0;

  const data = hasQuery
    ? await graphqlClient.request<BranchQueryResult>(SEARCH_BRANCHES, {
        query: params.query!.trim(),
        limit,
        skip,
      })
    : await graphqlClient.request<BranchQueryResult>(LIST_BRANCHES, {
        limit,
        skip,
      });

  return {
    branches: data.Branch.items,
    total: data.Branch.total,
  };
}

export function useBranches(params: BranchSearchParams) {
  return useQuery({
    queryKey: ['branches', params],
    queryFn: () => fetchBranches(params),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}
