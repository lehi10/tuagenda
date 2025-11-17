/**
 * React Query hook for fetching business by slug
 *
 * This hook is designed for PUBLIC booking flows.
 * It handles caching, loading states, and error handling automatically.
 *
 * Uses tRPC under the hood for type-safe API calls.
 *
 * @module hooks
 */

import { useTrpc } from "@/client/lib/trpc";

interface UseBusinessBySlugOptions {
  slug: string;
  enabled?: boolean;
}

export function useBusinessBySlug({
  slug,
  enabled = true,
}: UseBusinessBySlugOptions) {
  return useTrpc.business.getBySlug.useQuery(
    { slug },
    { enabled: enabled && !!slug }
  );
}
