import {
  IClientRepository,
  ClientWithStats,
  ClientRepositoryFilters,
} from "@/server/core/domain/repositories/IClientRepository";

export interface GetClientsByBusinessInput {
  businessId: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface GetClientsByBusinessResult {
  success: boolean;
  clients?: ClientWithStats[];
  total?: number;
  error?: string;
}

export class GetClientsByBusinessUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(
    input: GetClientsByBusinessInput
  ): Promise<GetClientsByBusinessResult> {
    try {
      const filters: ClientRepositoryFilters = {
        search: input.search,
        limit: input.limit,
        offset: input.offset,
      };

      const [clients, total] = await Promise.all([
        this.clientRepository.findByBusiness(input.businessId, filters),
        this.clientRepository.countByBusiness(input.businessId, filters),
      ]);

      return { success: true, clients, total };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch clients",
      };
    }
  }
}
