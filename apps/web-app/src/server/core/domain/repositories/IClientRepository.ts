/**
 * Client Repository Interface (Port)
 *
 * A "client" is a User who has at least one Appointment in a given business.
 * No separate table — derived from the Appointment relation.
 */

export interface ClientWithStats {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  pictureFullPath: string | null;
  isGuest: boolean;
  note: string | null;
  appointmentCount: number;
  lastVisit: Date | null;
  firstVisit: Date | null;
}

export interface ClientAppointment {
  id: string;
  startTime: Date;
  endTime: Date;
  status: string;
  serviceName: string;
  providerDisplayName: string | null;
}

export interface ClientDetail extends ClientWithStats {
  appointments: ClientAppointment[];
}

export interface ClientRepositoryFilters {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ClientStats {
  total: number;
  newThisMonth: number;
  retentionRate: number;
}

export interface CreateGuestClientInput {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  note?: string;
}

export interface IClientRepository {
  findByBusiness(
    businessId: string,
    filters?: ClientRepositoryFilters
  ): Promise<ClientWithStats[]>;
  countByBusiness(
    businessId: string,
    filters?: ClientRepositoryFilters
  ): Promise<number>;
  getStats(businessId: string): Promise<ClientStats>;
  getDetail(
    businessId: string,
    customerId: string
  ): Promise<ClientDetail | null>;
  createGuest(input: CreateGuestClientInput): Promise<{ id: string }>;
}
