// Mock prisma before importing the middleware
jest.mock("db", () => ({
  prisma: {
    user: { findUnique: jest.fn() },
    businessUser: { findFirst: jest.fn() },
  },
}));

// Mock the trpc module to expose middleware directly
jest.mock("../../trpc", () => ({
  middleware: (fn: unknown) => fn,
}));

import { prisma } from "db";
import { requireBusinessAccess } from "../business-access.middleware";

const mockPrismaUser = prisma.user.findUnique as jest.Mock;
const mockPrismaBusinessUser = prisma.businessUser.findFirst as jest.Mock;

function makeCtx(overrides: Record<string, unknown> = {}) {
  return {
    userId: "user-123",
    userEmail: "user@test.com",
    businessId: "biz-456",
    ...overrides,
  };
}

function makeNext() {
  return jest.fn().mockResolvedValue({ result: "ok" });
}

describe("requireBusinessAccess middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws UNAUTHORIZED when ctx.userId is null", async () => {
    const ctx = makeCtx({ userId: null });
    const next = makeNext();

    await expect(
      (requireBusinessAccess as Function)({ ctx, next })
    ).rejects.toThrow(expect.objectContaining({ code: "UNAUTHORIZED" }));
    expect(next).not.toHaveBeenCalled();
  });

  it("throws BAD_REQUEST when ctx.businessId is null", async () => {
    const ctx = makeCtx({ businessId: null });
    const next = makeNext();

    await expect(
      (requireBusinessAccess as Function)({ ctx, next })
    ).rejects.toThrow(expect.objectContaining({ code: "BAD_REQUEST" }));
    expect(next).not.toHaveBeenCalled();
  });

  it("allows superadmin bypassing membership check", async () => {
    const ctx = makeCtx();
    const next = makeNext();
    mockPrismaUser.mockResolvedValue({ type: "superadmin" });

    await (requireBusinessAccess as Function)({ ctx, next });

    expect(mockPrismaBusinessUser).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith({
      ctx: expect.objectContaining({ businessId: "biz-456" }),
    });
  });

  it("allows user with active membership", async () => {
    const ctx = makeCtx();
    const next = makeNext();
    mockPrismaUser.mockResolvedValue({ type: "regular" });
    mockPrismaBusinessUser.mockResolvedValue({ id: "membership-id" });

    await (requireBusinessAccess as Function)({ ctx, next });

    expect(next).toHaveBeenCalledWith({
      ctx: expect.objectContaining({ businessId: "biz-456" }),
    });
  });

  it("throws FORBIDDEN when user has no membership for the businessId", async () => {
    const ctx = makeCtx();
    const next = makeNext();
    mockPrismaUser.mockResolvedValue({ type: "regular" });
    mockPrismaBusinessUser.mockResolvedValue(null);

    await expect(
      (requireBusinessAccess as Function)({ ctx, next })
    ).rejects.toThrow(expect.objectContaining({ code: "FORBIDDEN" }));
    expect(next).not.toHaveBeenCalled();
  });

  it("queries membership with isActive: true", async () => {
    const ctx = makeCtx();
    const next = makeNext();
    mockPrismaUser.mockResolvedValue({ type: "regular" });
    mockPrismaBusinessUser.mockResolvedValue(null);

    await expect(
      (requireBusinessAccess as Function)({ ctx, next })
    ).rejects.toThrow();

    expect(mockPrismaBusinessUser).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: "user-123",
          businessId: "biz-456",
          isActive: true,
        }),
      })
    );
  });

  it("injects businessId into ctx for superadmin path", async () => {
    const ctx = makeCtx({ businessId: "biz-789" });
    const next = makeNext();
    mockPrismaUser.mockResolvedValue({ type: "superadmin" });

    await (requireBusinessAccess as Function)({ ctx, next });

    expect(next).toHaveBeenCalledWith({
      ctx: expect.objectContaining({ businessId: "biz-789" }),
    });
  });

  it("injects businessId into ctx for member path", async () => {
    const ctx = makeCtx({ businessId: "biz-789" });
    const next = makeNext();
    mockPrismaUser.mockResolvedValue({ type: "regular" });
    mockPrismaBusinessUser.mockResolvedValue({ id: "membership-id" });

    await (requireBusinessAccess as Function)({ ctx, next });

    expect(next).toHaveBeenCalledWith({
      ctx: expect.objectContaining({ businessId: "biz-789" }),
    });
  });
});
