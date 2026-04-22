"use client";

import { useRef, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTrpc, createLink } from "./client";
import { useBusiness } from "@/client/contexts/business-context";

interface TRPCProviderProps {
  children: React.ReactNode;
}

/**
 * tRPC Provider. Must be placed inside both QueryProvider and BusinessProvider:
 * - QueryProvider supplies the QueryClient via useQueryClient()
 * - BusinessProvider supplies the current businessId via useBusiness()
 *
 * Uses a ref so the tRPC client is created once and never recreated on
 * business switches — the ref always holds the latest businessId value.
 */
export function TRPCProvider({ children }: TRPCProviderProps) {
  const { currentBusiness } = useBusiness();
  const queryClient = useQueryClient();
  const businessIdRef = useRef<string | null>(currentBusiness?.id ?? null);

  // Keep ref in sync with the selected business
  useEffect(() => {
    businessIdRef.current = currentBusiness?.id ?? null;
  }, [currentBusiness?.id]);

  const [trpcClient] = useState(() =>
    useTrpc.createClient({
      links: [createLink(() => businessIdRef.current)],
    })
  );

  return (
    <useTrpc.Provider client={trpcClient} queryClient={queryClient}>
      {children}
    </useTrpc.Provider>
  );
}
