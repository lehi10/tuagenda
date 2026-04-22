// Mock superjson (ESM-only, incompatible with Jest's CommonJS transform)
jest.mock("superjson", () => ({
  stringify: JSON.stringify,
  parse: JSON.parse,
  serialize: (v: unknown) => ({ json: v, meta: undefined }),
  deserialize: ({ json }: { json: unknown }) => json,
}));

// Mock Firebase admin auth before importing createContext
jest.mock("@/server/lib/auth/firebase/admin", () => ({
  verifyAuthToken: jest.fn(),
}));

import { createContext } from "../trpc";
import { verifyAuthToken } from "@/server/lib/auth/firebase/admin";

const mockVerifyAuthToken = verifyAuthToken as jest.Mock;

function makeRequest(headers: Record<string, string>) {
  return {
    req: {
      headers: {
        get: (key: string) => headers[key] ?? null,
      },
    } as unknown as Request,
  };
}

describe("createContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns businessId from x-business-id header", async () => {
    const ctx = await createContext(
      makeRequest({ "x-business-id": "biz-123" })
    );

    expect(ctx.businessId).toBe("biz-123");
  });

  it("returns null businessId when header is absent", async () => {
    const ctx = await createContext(makeRequest({}));

    expect(ctx.businessId).toBeNull();
  });

  it("returns null userId when no auth token", async () => {
    const ctx = await createContext(makeRequest({}));

    expect(ctx.userId).toBeNull();
    expect(ctx.userEmail).toBeNull();
  });

  it("returns userId and businessId together when both headers are present", async () => {
    mockVerifyAuthToken.mockResolvedValue({
      uid: "user-abc",
      email: "user@test.com",
    });

    const ctx = await createContext(
      makeRequest({
        authorization: "Bearer valid-token",
        "x-business-id": "biz-456",
      })
    );

    expect(ctx.userId).toBe("user-abc");
    expect(ctx.userEmail).toBe("user@test.com");
    expect(ctx.businessId).toBe("biz-456");
  });

  it("returns null userId but preserves businessId when auth token is invalid", async () => {
    mockVerifyAuthToken.mockRejectedValue(new Error("Invalid token"));

    const ctx = await createContext(
      makeRequest({
        authorization: "Bearer bad-token",
        "x-business-id": "biz-456",
      })
    );

    expect(ctx.userId).toBeNull();
    expect(ctx.businessId).toBe("biz-456");
  });
});
