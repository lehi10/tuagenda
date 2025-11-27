// Router (used by HTTP handler and client)
export { appRouter, type AppRouter } from "./routers/app.router";

// Context creator (used by HTTP handler)
export { createContext } from "./trpc";

// Server-side caller (used in Server Components)
export { serverTrpc } from "./server";
