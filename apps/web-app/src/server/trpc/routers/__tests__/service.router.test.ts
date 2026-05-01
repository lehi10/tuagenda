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
  "@/server/infrastructure/repositories/PrismaServiceRepository",
  () => ({ PrismaServiceRepository: jest.fn().mockImplementation(() => ({})) })
);

// Mock use cases
const mockListExecute = jest.fn();
const mockCreateExecute = jest.fn();
const mockUpdateExecute = jest.fn();
const mockDeleteExecute = jest.fn();

jest.mock("@/server/core/application/use-cases/service", () => ({
  ListServicesUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockListExecute })),
  CreateServiceUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockCreateExecute })),
  UpdateServiceUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockUpdateExecute })),
  DeleteServiceUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockDeleteExecute })),
  GetServiceUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: jest.fn() })),
}));

import { serviceRouter } from "../service.router";
import { Service } from "@/server/core/domain/entities/Service";
import Decimal from "decimal.js";

const BIZ_ID = "b0000000-0000-4000-8000-000000000001";
const CAT_ID = "c0000000-0000-4000-8000-000000000002";
const SVC_ID = "d0000000-0000-4000-8000-000000000003";

function makeCtx() {
  return {
    userId: "user-123",
    userEmail: "user@test.com",
    businessId: BIZ_ID,
  };
}

function makeServiceEntity(
  overrides: { id?: string; name?: string; price?: number } = {}
) {
  return new Service({
    id: overrides.id ?? SVC_ID,
    businessId: BIZ_ID,
    categoryId: CAT_ID,
    name: overrides.name ?? "Corte de pelo",
    price: new Decimal(overrides.price ?? 25),
    durationMinutes: 30,
  });
}

describe("serviceRouter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("auth", () => {
    it("throws BAD_REQUEST when ctx.businessId is null", async () => {
      const caller = serviceRouter.createCaller({
        ...makeCtx(),
        businessId: null,
      });

      await expect(caller.list({})).rejects.toThrow(
        expect.objectContaining({ code: "BAD_REQUEST" })
      );
    });

    it("throws UNAUTHORIZED when ctx.userId is null", async () => {
      const caller = serviceRouter.createCaller({
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
        services: [],
        total: 0,
      });

      const caller = serviceRouter.createCaller(makeCtx());
      await caller.list({});

      expect(mockListExecute).toHaveBeenCalledWith(
        expect.objectContaining({ businessId: BIZ_ID })
      );
    });

    it("returns empty array without error when there are no services", async () => {
      mockListExecute.mockResolvedValue({
        success: true,
        services: [],
        total: 0,
      });

      const caller = serviceRouter.createCaller(makeCtx());
      const result = await caller.list({});

      expect(result.services).toEqual([]);
      expect(result.total).toBe(0);
    });

    it("returns mapped services with price as number", async () => {
      const svc = makeServiceEntity({ name: "Corte de pelo", price: 25 });
      mockListExecute.mockResolvedValue({
        success: true,
        services: [svc],
        total: 1,
      });

      const caller = serviceRouter.createCaller(makeCtx());
      const result = await caller.list({});

      expect(result.services).toHaveLength(1);
      expect(result.services[0].name).toBe("Corte de pelo");
      expect(result.services[0].price).toBe(25);
      expect(result.services[0].businessId).toBe(BIZ_ID);
    });

    it("forwards optional categoryId filter to the use case", async () => {
      mockListExecute.mockResolvedValue({
        success: true,
        services: [],
        total: 0,
      });

      const caller = serviceRouter.createCaller(makeCtx());
      await caller.list({ categoryId: CAT_ID });

      expect(mockListExecute).toHaveBeenCalledWith(
        expect.objectContaining({ categoryId: CAT_ID, businessId: BIZ_ID })
      );
    });

    it("throws INTERNAL_SERVER_ERROR when use case fails", async () => {
      mockListExecute.mockResolvedValue({
        success: false,
        services: null,
        error: "DB error",
      });

      const caller = serviceRouter.createCaller(makeCtx());
      await expect(caller.list({})).rejects.toThrow(
        expect.objectContaining({ code: "INTERNAL_SERVER_ERROR" })
      );
    });
  });

  describe("create", () => {
    it("passes ctx.businessId to the use case", async () => {
      const svc = makeServiceEntity();
      mockCreateExecute.mockResolvedValue({ success: true, service: svc });

      const caller = serviceRouter.createCaller(makeCtx());
      await caller.create({
        name: "Corte de pelo",
        price: 25,
        durationMinutes: 30,
      });

      expect(mockCreateExecute).toHaveBeenCalledWith(
        expect.objectContaining({ businessId: BIZ_ID, name: "Corte de pelo" })
      );
    });

    it("returns the created service with price as number", async () => {
      const svc = makeServiceEntity({ name: "Tinte", price: 50 });
      mockCreateExecute.mockResolvedValue({ success: true, service: svc });

      const caller = serviceRouter.createCaller(makeCtx());
      const result = await caller.create({
        name: "Tinte",
        price: 50,
        durationMinutes: 60,
      });

      expect(result.name).toBe("Tinte");
      expect(result.price).toBe(50);
    });

    it("throws BAD_REQUEST when use case fails", async () => {
      mockCreateExecute.mockResolvedValue({
        success: false,
        service: null,
        error: "Name already exists",
      });

      const caller = serviceRouter.createCaller(makeCtx());
      await expect(
        caller.create({ name: "Duplicado", price: 25, durationMinutes: 30 })
      ).rejects.toThrow(expect.objectContaining({ code: "BAD_REQUEST" }));
    });
  });

  describe("update", () => {
    it("updates the service and returns result with price as number", async () => {
      const svc = makeServiceEntity({
        id: SVC_ID,
        name: "Corte premium",
        price: 40,
      });
      mockUpdateExecute.mockResolvedValue({ success: true, service: svc });

      const caller = serviceRouter.createCaller(makeCtx());
      const result = await caller.update({
        id: SVC_ID,
        name: "Corte premium",
        price: 40,
      });

      expect(result.name).toBe("Corte premium");
      expect(result.price).toBe(40);
      expect(mockUpdateExecute).toHaveBeenCalledWith(
        expect.objectContaining({ id: SVC_ID, name: "Corte premium" })
      );
    });

    it("throws BAD_REQUEST when use case fails", async () => {
      mockUpdateExecute.mockResolvedValue({
        success: false,
        service: null,
        error: "Not found",
      });

      const caller = serviceRouter.createCaller(makeCtx());
      await expect(caller.update({ id: SVC_ID, price: 40 })).rejects.toThrow(
        expect.objectContaining({ code: "BAD_REQUEST" })
      );
    });
  });

  describe("delete", () => {
    it("deletes the service and returns success", async () => {
      mockDeleteExecute.mockResolvedValue({ success: true });

      const caller = serviceRouter.createCaller(makeCtx());
      const result = await caller.delete({ id: SVC_ID });

      expect(result.success).toBe(true);
      expect(mockDeleteExecute).toHaveBeenCalledWith(
        expect.objectContaining({ id: SVC_ID })
      );
    });

    it("throws BAD_REQUEST when use case fails", async () => {
      mockDeleteExecute.mockResolvedValue({
        success: false,
        error: "Service not found",
      });

      const caller = serviceRouter.createCaller(makeCtx());
      await expect(caller.delete({ id: SVC_ID })).rejects.toThrow(
        expect.objectContaining({ code: "BAD_REQUEST" })
      );
    });
  });
});
