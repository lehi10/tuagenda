import {
  IClientRepository,
  ClientDetail,
} from "@/server/core/domain/repositories/IClientRepository";

export interface GetClientDetailInput {
  businessId: string;
  customerId: string;
}

export interface GetClientDetailResult {
  success: boolean;
  client?: ClientDetail;
  error?: string;
}

export class GetClientDetailUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(input: GetClientDetailInput): Promise<GetClientDetailResult> {
    try {
      const client = await this.clientRepository.getDetail(
        input.businessId,
        input.customerId
      );

      if (!client) {
        return { success: false, error: "Client not found" };
      }

      return { success: true, client };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch client detail",
      };
    }
  }
}
