import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  stripSearchParams,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BranchFinder from '@/pages/BranchFinder';
import NotFound from '@/pages/NotFound';
import ErrorPage from '@/pages/ErrorPage';
import { z } from 'zod';
import { zodValidator } from '@tanstack/zod-adapter';

const searchSchema = z.object({
  q: z.string().default(''),
  page: z.number().int().min(1).default(1),
  country: z.string().optional(),
  sort: z.enum(['relevance', 'distance', 'name']).default('relevance'),
  radius: z.number().positive().optional(),
  smart: z.boolean().default(false),
});

const rootRoute = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  ),
  notFoundComponent: NotFound,
  errorComponent: ({ error }) => <ErrorPage error={error} />,
});

const searchDefaults = {
  q: '',
  page: 1,
  sort: 'relevance',
  smart: false,
} as const;

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: BranchFinder,
  validateSearch: zodValidator(searchSchema),
  search: {
    middlewares: [stripSearchParams(searchDefaults)],
  },
});

const routeTree = rootRoute.addChildren([indexRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

import { LocationProvider } from '@/contexts/LocationContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocationProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </LocationProvider>
  </StrictMode>,
);
