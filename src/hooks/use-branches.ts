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
  signal?: AbortSignal,
): Promise<PaginatedBranches> {
  const limit = params.limit ?? DEFAULT_LIMIT;
  const skip = params.skip ?? 0;
  const hasQuery = params.query && params.query.trim().length > 0;

  const data = hasQuery
    ? await graphqlClient.request<BranchQueryResult>({
        document: SEARCH_BRANCHES,
        variables: { query: params.query!.trim(), limit, skip },
        signal,
      })
    : await graphqlClient.request<BranchQueryResult>({
        document: LIST_BRANCHES,
        variables: { limit, skip },
        signal,
      });

  return {
    branches: data.Branch.items,
    total: data.Branch.total,
  };
}

export function useBranches(params: BranchSearchParams) {
  return useQuery({
    queryKey: ['branches', params],
    queryFn: ({ signal }) => fetchBranches(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}
