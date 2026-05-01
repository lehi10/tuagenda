// Mock superjson (ESM-only, incompatible with Jest's CommonJS transform)
jest.mock("superjson", () => ({
  stringify: JSON.stringify,
  parse: JSON.parse,
  serialize: (v: unknown) => ({ json: v, meta: undefined }),
  deserialize: ({ json }: { json: unknown }) => json,
}));

// Mock Firebase admin to avoid loading ESM-only jose dependency
jest.mock("@/server/lib/auth/firebase/admin", () => ({
  verifyAuthToken: jest.fn(),
}));

// Mock Prisma for requireBusinessAccess middleware — superadmin bypasses membership check
jest.mock("db", () => ({
  prisma: {
    user: { findUnique: jest.fn().mockResolvedValue({ type: "superadmin" }) },
    businessUser: { findFirst: jest.fn() },
  },
}));

// Mock repository (instantiated inside each handler)
jest.mock(
  "@/server/infrastructure/repositories/PrismaServiceCategoryRepository",
  () => ({
    PrismaServiceCategoryRepository: jest.fn().mockImplementation(() => ({})),
  })
);

// Mock use cases
const mockListExecute = jest.fn();
const mockCreateExecute = jest.fn();
const mockUpdateExecute = jest.fn();
const mockDeleteExecute = jest.fn();

jest.mock("@/server/core/application/use-cases/service-category", () => ({
  ListServiceCategoriesUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockListExecute })),
  CreateServiceCategoryUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockCreateExecute })),
  UpdateServiceCategoryUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockUpdateExecute })),
  DeleteServiceCategoryUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockDeleteExecute })),
  GetServiceCategoryUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: jest.fn() })),
}));

import { serviceCategoryRouter } from "../serviceCategory.router";
import { ServiceCategory } from "@/server/core/domain/entities/ServiceCategory";

const BIZ_ID = "b0000000-0000-4000-8000-000000000001";
const CAT_ID = "c0000000-0000-4000-8000-000000000002";

function makeCtx() {
  return {
    userId: "user-123",
    userEmail: "user@test.com",
    businessId: BIZ_ID,
  };
}

function makeCategoryEntity(overrides: { id?: string; name?: string } = {}) {
  return new ServiceCategory({
    id: overrides.id ?? CAT_ID,
    businessId: BIZ_ID,
    name: overrides.name ?? "Cortes",
  });
}

describe("serviceCategoryRouter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("auth", () => {
    it("throws BAD_REQUEST when ctx.businessId is null", async () => {
      const caller = serviceCategoryRouter.createCaller({
        ...makeCtx(),
        businessId: null,
      });

      await expect(caller.list({})).rejects.toThrow(
        expect.objectContaining({ code: "BAD_REQUEST" })
      );
    });

    it("throws UNAUTHORIZED when ctx.userId is null", async () => {
      const caller = serviceCategoryRouter.createCaller({
        ...makeCtx(),
        userId: null,
      });

      await expect(caller.list({})).rejects.toThrow(
        expect.objectContaining({ code: "UNAUTHORIZED" })
      );
    });
  });

  describe("list", () => {
    it("passes ctx.businessId to the use case", async () => {
      mockListExecute.mockResolvedValue({
        success: true,
        categories: [],
        total: 0,
      });

      const caller = serviceCategoryRouter.createCaller(makeCtx());
      await caller.list({});

      expect(mockListExecute).toHaveBeenCalledWith(
        expect.objectContaining({ businessId: BIZ_ID })
      );
    });

    it("returns empty array without error when there are no categories", async () => {
      mockListExecute.mockResolvedValue({
        success: true,
        categories: [],
        total: 0,
      });

      const caller = serviceCategoryRouter.createCaller(makeCtx());
      const result = await caller.list({});

      expect(result.categories).toEqual([]);
      expect(result.total).toBe(0);
    });

    it("returns mapped categories from the use case", async () => {
      const cat = makeCategoryEntity();
      mockListExecute.mockResolvedValue({
        success: true,
        categories: [cat],
        total: 1,
      });

      const caller = serviceCategoryRouter.createCaller(makeCtx());
      const result = await caller.list({});

      expect(result.categories).toHaveLength(1);
      expect(result.categories[0].name).toBe("Cortes");
      expect(result.categories[0].businessId).toBe(BIZ_ID);
    });

    it("forwards optional search param to the use case", async () => {
      mockListExecute.mockResolvedValue({
        success: true,
        categories: [],
        total: 0,
      });

      const caller = serviceCategoryRouter.createCaller(makeCtx());
      await caller.list({ search: "color" });

      expect(mockListExecute).toHaveBeenCalledWith(
        expect.objectContaining({ search: "color", businessId: BIZ_ID })
      );
    });

    it("throws INTERNAL_SERVER_ERROR when use case fails", async () => {
      mockListExecute.mockResolvedValue({
        success: false,
        categories: null,
        error: "DB error",
      });

      const caller = serviceCategoryRouter.createCaller(makeCtx());
      await expect(caller.list({})).rejects.toThrow(
        expect.objectContaining({ code: "INTERNAL_SERVER_ERROR" })
      );
    });
  });

  describe("create", () => {
    it("passes ctx.businessId to the use case", async () => {
      const cat = makeCategoryEntity();
      mockCreateExecute.mockResolvedValue({ success: true, category: cat });

      const caller = serviceCategoryRouter.createCaller(makeCtx());
      await caller.create({ name: "Cortes" });

      expect(mockCreateExecute).toHaveBeenCalledWith(
        expect.objectContaining({ businessId: BIZ_ID, name: "Cortes" })
      );
    });

    it("returns the created category", async () => {
      const cat = makeCategoryEntity({ name: "Coloracion" });
      mockCreateExecute.mockResolvedValue({ success: true, category: cat });

      const caller = serviceCategoryRouter.createCaller(makeCtx());
      const result = await caller.create({ name: "Coloracion" });

      expect(result.name).toBe("Coloracion");
    });

    it("throws BAD_REQUEST when use case fails", async () => {
      mockCreateExecute.mockResolvedValue({
        success: false,
        category: null,
        error: "Name already exists",
      });

      const caller = serviceCategoryRouter.createCaller(makeCtx());
      await expect(caller.create({ name: "Duplicado" })).rejects.toThrow(
        expect.objectContaining({ code: "BAD_REQUEST" })
      );
    });
  });

  describe("update", () => {
    it("updates the category and returns result", async () => {
      const cat = makeCategoryEntity({ id: CAT_ID, name: "Uñas" });
      mockUpdateExecute.mockResolvedValue({ success: true, category: cat });

      const caller = serviceCategoryRouter.createCaller(makeCtx());
      const result = await caller.update({ id: CAT_ID, name: "Uñas" });

      expect(result.name).toBe("Uñas");
      expect(mockUpdateExecute).toHaveBeenCalledWith(
        expect.objectContaining({ id: CAT_ID, name: "Uñas" })
      );
    });

    it("throws BAD_REQUEST when use case fails", async () => {
      mockUpdateExecute.mockResolvedValue({
        success: false,
        category: null,
        error: "Not found",
      });

      const caller = serviceCategoryRouter.createCaller(makeCtx());
      await expect(caller.update({ id: CAT_ID, name: "Uñas" })).rejects.toThrow(
        expect.objectContaining({ code: "BAD_REQUEST" })
      );
    });
  });

  describe("delete", () => {
    it("deletes the category and returns success", async () => {
      mockDeleteExecute.mockResolvedValue({ success: true });

      const caller = serviceCategoryRouter.createCaller(makeCtx());
      const result = await caller.delete({ id: CAT_ID });

      expect(result.success).toBe(true);
      expect(mockDeleteExecute).toHaveBeenCalledWith(
        expect.objectContaining({ id: CAT_ID })
      );
    });

    it("throws BAD_REQUEST when use case fails", async () => {
      mockDeleteExecute.mockResolvedValue({
        success: false,
        error: "Category not found",
      });

      const caller = serviceCategoryRouter.createCaller(makeCtx());
      await expect(caller.delete({ id: CAT_ID })).rejects.toThrow(
        expect.objectContaining({ code: "BAD_REQUEST" })
      );
    });
  });
});
