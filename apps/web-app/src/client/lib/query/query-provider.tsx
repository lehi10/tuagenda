"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Configure default query options
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

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
