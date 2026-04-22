"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Provides the shared QueryClient to the entire app.
 * Must wrap BusinessProvider so it can use useQueryClient().
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
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

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
