"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Disable automatic refetching by default
            // We'll manage this manually based on our needs
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            retry: 1,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// Export a function to get the query client instance
// This will be used by the auth context to clear cache
let globalQueryClient: QueryClient | null = null;

export function setGlobalQueryClient(client: QueryClient) {
  globalQueryClient = client;
}

export function getGlobalQueryClient(): QueryClient | null {
  return globalQueryClient;
}
