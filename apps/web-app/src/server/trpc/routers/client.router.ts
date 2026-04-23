import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router } from "../trpc";
import { businessMemberProcedure } from "../procedures";
import { PrismaClientRepository } from "@/server/infrastructure/repositories/PrismaClientRepository";
import { GetClientsByBusinessUseCase } from "@/server/core/application/use-cases/client/GetClientsByBusiness";
import { GetClientStatsUseCase } from "@/server/core/application/use-cases/client/GetClientStats";
import { GetClientDetailUseCase } from "@/server/core/application/use-cases/client/GetClientDetail";

export const clientRouter = router({
  getByBusiness: businessMemberProcedure
    .input(
      z.object({
        search: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const repo = new PrismaClientRepository();
      const useCase = new GetClientsByBusinessUseCase(repo);

      const result = await useCase.execute({
        businessId: ctx.businessId,
        ...input,
      });

      if (!result.success || !result.clients) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error ?? "Failed to fetch clients",
        });
      }

      return { clients: result.clients, total: result.total ?? 0 };
    }),

  getStats: businessMemberProcedure.query(async ({ ctx }) => {
    const repo = new PrismaClientRepository();
    const useCase = new GetClientStatsUseCase(repo);

    const result = await useCase.execute({ businessId: ctx.businessId });

    if (!result.success || !result.stats) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: result.error ?? "Failed to fetch client stats",
      });
    }

    return result.stats;
  }),

  getDetail: businessMemberProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const repo = new PrismaClientRepository();
      const useCase = new GetClientDetailUseCase(repo);

      const result = await useCase.execute({
        businessId: ctx.businessId,
        customerId: input.customerId,
      });

      if (!result.success || !result.client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: result.error ?? "Client not found",
        });
      }

      return result.client;
    }),
});
