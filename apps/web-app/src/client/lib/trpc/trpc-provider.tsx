"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTrpc, getTRPCClientConfig } from "./client";

interface TRPCProviderProps {
  children: React.ReactNode;
}

/**
 * tRPC Provider that wraps the application
 * Provides both tRPC client and React Query client
 *
 * Note: This replaces the existing QueryProvider as tRPC
 * uses React Query internally
 */
export function TRPCProvider({ children }: TRPCProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            throwOnError: (error, query) => {
              toast.error("Error with: " + query.queryKey.join(", "), {
                description: error.message,
              });
              return false;
            },
          },
          mutations: {
            throwOnError: (error) => {
              toast.error("An error occurred: " + error.message);
              return false;
            },
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    useTrpc.createClient(getTRPCClientConfig())
  );

  return (
    <useTrpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </useTrpc.Provider>
  );
}
