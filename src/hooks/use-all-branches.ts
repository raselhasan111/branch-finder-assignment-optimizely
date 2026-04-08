import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphql/client';
import { LIST_BRANCHES } from '@/lib/graphql/queries';
import type { Branch, BranchQueryResult, CountryOption } from '@/types/branch';

import { BATCH_SIZE } from '@/constants/config';

async function fetchAllBranches(): Promise<Branch[]> {
  // First request to get total count
  const first = await graphqlClient.request<BranchQueryResult>(LIST_BRANCHES, {
    limit: BATCH_SIZE,
    skip: 0,
  });

  const total = first.Branch.total;
  const allItems = [...first.Branch.items];

  if (total <= BATCH_SIZE) return allItems;

  // Fetch remaining batches in parallel
  const remaining = Math.ceil((total - BATCH_SIZE) / BATCH_SIZE);
  const promises = Array.from({ length: remaining }, (_, i) =>
    graphqlClient.request<BranchQueryResult>(LIST_BRANCHES, {
      limit: BATCH_SIZE,
      skip: (i + 1) * BATCH_SIZE,
    }),
  );

  const results = await Promise.all(promises);
  for (const result of results) {
    allItems.push(...result.Branch.items);
  }

  return allItems;
}

function deriveCountryOptions(branches: Branch[]): CountryOption[] {
  const map = new Map<string, { country: string; count: number }>();

  for (const b of branches) {
    const code = b.CountryCode ?? '';
    const country = b.Country ?? 'Unknown';
    if (!code) continue;

    const existing = map.get(code);
    if (existing) {
      existing.count++;
    } else {
      map.set(code, { country, count: 1 });
    }
  }

  return Array.from(map.entries())
    .map(([countryCode, { country, count }]) => ({
      country,
      countryCode,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

export function useAllBranches() {
  return useQuery({
    queryKey: ['all-branches'],
    queryFn: fetchAllBranches,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useCountryOptions() {
  const { data: branches, ...rest } = useAllBranches();
  const countries = branches ? deriveCountryOptions(branches) : [];
  return { countries, ...rest };
}
