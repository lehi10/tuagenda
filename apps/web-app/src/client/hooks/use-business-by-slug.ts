/**
 * React Query hook for fetching business by slug
 *
 * This hook is designed for PUBLIC booking flows.
 * It handles caching, loading states, and error handling automatically.
 *
 * @module hooks
 */

import { useQuery } from "@tanstack/react-query";
import { getBusinessBySlug } from "@/server/api/business";
import { BusinessProps } from "@/server/core/domain/entities/Business";

interface UseBusinessBySlugOptions {
  slug: string;
  enabled?: boolean;
}

export function useBusinessBySlug({
  slug,
  enabled = true,
}: UseBusinessBySlugOptions) {
  return useQuery({
    queryKey: ["business", "slug", slug],
    queryFn: async () => {
      const result = await getBusinessBySlug(slug);

      if (!result.success) {
        throw new Error(result.error || "Business not found");
      }

      return result.business as BusinessProps;
    },
    enabled: enabled && !!slug,
  });
}
