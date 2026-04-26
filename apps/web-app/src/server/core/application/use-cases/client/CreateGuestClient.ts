import { IClientRepository } from "@/server/core/domain/repositories/IClientRepository";

export interface CreateGuestClientInput {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  note?: string;
}

export interface CreateGuestClientResult {
  success: boolean;
  clientId?: string;
  error?: string;
  errorCode?: "EMAIL_ALREADY_EXISTS" | "UNKNOWN";
}

export class CreateGuestClientUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(
    input: CreateGuestClientInput
  ): Promise<CreateGuestClientResult> {
    try {
      const { id } = await this.clientRepository.createGuest(input);
      return { success: true, clientId: id };
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Unique constraint")
      ) {
        return {
          success: false,
          error: "A client with this email already exists",
          errorCode: "EMAIL_ALREADY_EXISTS",
        };
      }
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create client",
        errorCode: "UNKNOWN",
      };
    }
  }
}
