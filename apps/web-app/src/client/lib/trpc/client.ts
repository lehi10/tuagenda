import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { createTRPCClient } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "@/server/trpc";
import { getFirebaseAuth } from "@/client/lib/auth/firebase/config";

/**
 * Shared link configuration for both clients.
 * Accepts an optional getter for businessId so the TRPCProvider
 * can supply it from React context via a ref instead of localStorage.
 */
export function createLink(getBusinessId?: () => string | null) {
  return httpBatchLink({
    url: "/api/trpc",
    transformer: superjson,
    async headers() {
      if (typeof window === "undefined") {
        return {};
      }

      const auth = getFirebaseAuth();
      const user = auth.currentUser;

      if (!user) {
        return {};
      }

      try {
        const token = await user.getIdToken();
        const businessId = getBusinessId?.() ?? null;
        return {
          authorization: `Bearer ${token}`,
          ...(businessId ? { "x-business-id": businessId } : {}),
        };
      } catch {
        return {};
      }
    },
  });
}

/**
 * tRPC React client with hooks
 * Use in React components with useQuery/useMutation
 *
 * @example
 * const { data } = useTrpc.user.me.useQuery();
 * const mutation = useTrpc.user.create.useMutation();
 */
export const useTrpc = createTRPCReact<AppRouter>();

/**
 * tRPC direct client (no hooks)
 * Use for imperative calls outside React components
 * e.g., in contexts, event handlers, utility functions
 *
 * @example
 * const user = await trpc.user.me.query();
 * const result = await trpc.user.create.mutate({ ... });
 */
export const trpc = createTRPCClient<AppRouter>({
  links: [createLink()],
});
