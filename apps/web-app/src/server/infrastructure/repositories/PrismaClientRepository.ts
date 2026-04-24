import { prisma } from "db";
import {
  IClientRepository,
  ClientWithStats,
  ClientDetail,
  ClientRepositoryFilters,
  ClientStats,
  CreateGuestClientInput,
} from "@/server/core/domain/repositories/IClientRepository";

export class PrismaClientRepository implements IClientRepository {
  async findByBusiness(
    businessId: string,
    filters?: ClientRepositoryFilters
  ): Promise<ClientWithStats[]> {
    const { search, limit = 20, offset = 0 } = filters ?? {};

    const searchFilter = search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const users = await prisma.user.findMany({
      where: {
        appointmentsAsCustomer: { some: { businessId } },
        ...searchFilter,
      },
      include: {
        appointmentsAsCustomer: {
          where: { businessId },
          select: { id: true, startTime: true },
          orderBy: { startTime: "desc" },
        },
      },
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return users.map((user) => {
      const appointments = user.appointmentsAsCustomer;
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        pictureFullPath: user.pictureFullPath,
        isGuest: user.isGuest,
        note: user.note,
        appointmentCount: appointments.length,
        lastVisit: appointments[0]?.startTime ?? null,
        firstVisit:
          appointments.length > 0
            ? appointments[appointments.length - 1].startTime
            : null,
      };
    });
  }

  async countByBusiness(
    businessId: string,
    filters?: ClientRepositoryFilters
  ): Promise<number> {
    const { search } = filters ?? {};

    const searchFilter = search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    return prisma.user.count({
      where: {
        appointmentsAsCustomer: { some: { businessId } },
        ...searchFilter,
      },
    });
  }

  async getStats(businessId: string): Promise<ClientStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, allClientsWithCount, allClientsWithFirstVisit] =
      await Promise.all([
        // Total distinct clients
        prisma.user.count({
          where: { appointmentsAsCustomer: { some: { businessId } } },
        }),

        // All clients with their appointment count (for retention)
        prisma.appointment.groupBy({
          by: ["customerId"],
          where: { businessId, customerId: { not: null } },
          _count: { id: true },
        }),

        // All clients with their first visit date
        prisma.appointment.groupBy({
          by: ["customerId"],
          where: { businessId, customerId: { not: null } },
          _min: { startTime: true },
        }),
      ]);

    const newThisMonth = allClientsWithFirstVisit.filter(
      (c) => c._min.startTime !== null && c._min.startTime >= startOfMonth
    ).length;

    const returningCount = allClientsWithCount.filter(
      (c) => c._count.id > 1
    ).length;
    const retentionRate =
      total > 0 ? Math.round((returningCount / total) * 100) : 0;

    return { total, newThisMonth, retentionRate };
  }

  async createGuest(input: CreateGuestClientInput): Promise<{ id: string }> {
    const id = crypto.randomUUID();
    const user = await prisma.user.create({
      data: {
        id,
        firstName: input.firstName,
        lastName: input.lastName ?? null,
        email: input.email,
        phone: input.phone ?? null,
        note: input.note ?? null,
        isGuest: true,
        guestCreatedAt: new Date(),
      },
      select: { id: true },
    });
    return { id: user.id };
  }

  async getDetail(
    businessId: string,
    customerId: string
  ): Promise<ClientDetail | null> {
    const user = await prisma.user.findUnique({
      where: { id: customerId },
      include: {
        appointmentsAsCustomer: {
          where: { businessId },
          include: {
            service: { select: { name: true } },
            providerBusinessUser: {
              select: {
                displayName: true,
                user: { select: { firstName: true, lastName: true } },
              },
            },
          },
          orderBy: { startTime: "desc" },
        },
      },
    });

    if (!user) return null;

    // Verify this user has at least one appointment in this business
    if (user.appointmentsAsCustomer.length === 0) return null;

    const appointments = user.appointmentsAsCustomer;

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      pictureFullPath: user.pictureFullPath,
      isGuest: user.isGuest,
      note: user.note,
      appointmentCount: appointments.length,
      lastVisit: appointments[0]?.startTime ?? null,
      firstVisit:
        appointments.length > 0
          ? appointments[appointments.length - 1].startTime
          : null,
      appointments: appointments.map((a) => ({
        id: a.id,
        startTime: a.startTime,
        endTime: a.endTime,
        status: a.status,
        serviceName: a.service.name,
        providerDisplayName:
          a.providerBusinessUser?.displayName ??
          (a.providerBusinessUser?.user
            ? `${a.providerBusinessUser.user.firstName} ${a.providerBusinessUser.user.lastName ?? ""}`.trim()
            : null),
      })),
    };
  }
}
