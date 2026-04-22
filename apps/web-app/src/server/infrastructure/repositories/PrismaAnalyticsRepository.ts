import { prisma } from "db";
import {
  IAnalyticsRepository,
  DashboardStats,
  DashboardCharts,
  ChartDataPoint,
  BookingDataPoint,
  ServiceDataPoint,
  EmployeeDataPoint,
} from "@/server/core/domain/repositories/IAnalyticsRepository";

interface AnalyticsInput {
  businessId: string;
  startDate: Date;
  endDate: Date;
  prevStartDate: Date;
  prevEndDate: Date;
}

export class PrismaAnalyticsRepository implements IAnalyticsRepository {
  async getDashboardStats(input: AnalyticsInput): Promise<DashboardStats> {
    const { businessId, startDate, endDate, prevStartDate, prevEndDate } =
      input;

    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 86400000);

    const [
      currentAppointments,
      prevAppointments,
      upcomingCount,
      currentCompleted,
      prevCompleted,
    ] = await Promise.all([
      // Total citas en el período actual
      prisma.appointment.findMany({
        where: {
          businessId,
          startTime: { gte: startDate, lte: endDate },
        },
        select: { customerId: true },
      }),

      // Total citas en el período anterior
      prisma.appointment.findMany({
        where: {
          businessId,
          startTime: { gte: prevStartDate, lte: prevEndDate },
        },
        select: { customerId: true },
      }),

      // Citas próximas (siempre próximos 7 días)
      prisma.appointment.count({
        where: {
          businessId,
          startTime: { gte: now, lte: sevenDaysFromNow },
          status: { in: ["scheduled", "confirmed"] },
        },
      }),

      // Citas completadas en período actual (para revenue)
      prisma.appointment.findMany({
        where: {
          businessId,
          startTime: { gte: startDate, lte: endDate },
          status: "completed",
        },
        include: { service: true },
      }),

      // Citas completadas en período anterior (para revenue prev)
      prisma.appointment.findMany({
        where: {
          businessId,
          startTime: { gte: prevStartDate, lte: prevEndDate },
          status: "completed",
        },
        include: { service: true },
      }),
    ]);

    const totalAppointments = currentAppointments.length;
    const totalAppointmentsPrev = prevAppointments.length;

    const totalClients = new Set(
      currentAppointments
        .map((a) => a.customerId)
        .filter((id): id is string => id !== null)
    ).size;

    const totalClientsPrev = new Set(
      prevAppointments
        .map((a) => a.customerId)
        .filter((id): id is string => id !== null)
    ).size;

    const totalRevenue = currentCompleted.reduce(
      (sum, a) => sum + a.service.price.toNumber(),
      0
    );

    const totalRevenuePrev = prevCompleted.reduce(
      (sum, a) => sum + a.service.price.toNumber(),
      0
    );

    return {
      totalAppointments,
      upcomingAppointments: upcomingCount,
      totalClients,
      totalRevenue,
      totalAppointmentsPrev,
      totalClientsPrev,
      totalRevenuePrev,
    };
  }

  async getDashboardCharts(input: AnalyticsInput): Promise<DashboardCharts> {
    const { businessId, startDate, endDate, prevStartDate, prevEndDate } =
      input;

    const [currentAppointments, prevAppointments] = await Promise.all([
      prisma.appointment.findMany({
        where: {
          businessId,
          startTime: { gte: startDate, lte: endDate },
        },
        include: {
          service: true,
          providerBusinessUser: {
            include: { user: true },
          },
        },
        orderBy: { startTime: "asc" },
      }),

      prisma.appointment.findMany({
        where: {
          businessId,
          startTime: { gte: prevStartDate, lte: prevEndDate },
          status: "completed",
        },
        select: { providerBusinessUserId: true },
      }),
    ]);

    // Revenue chart — agrupa por fecha ISO, solo citas completadas
    const revenueMap = new Map<string, number>();
    for (const apt of currentAppointments) {
      if (apt.status !== "completed") continue;
      const dateKey = apt.startTime.toISOString().split("T")[0];
      revenueMap.set(
        dateKey,
        (revenueMap.get(dateKey) ?? 0) + apt.service.price.toNumber()
      );
    }
    const revenue: ChartDataPoint[] = Array.from(revenueMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, revenue]) => ({ label, revenue }));

    // Bookings chart — agrupa por fecha ISO, total, completadas y canceladas
    const bookingsMap = new Map<
      string,
      { total: number; completed: number; cancelled: number }
    >();
    for (const apt of currentAppointments) {
      const dateKey = apt.startTime.toISOString().split("T")[0];
      const existing = bookingsMap.get(dateKey) ?? {
        total: 0,
        completed: 0,
        cancelled: 0,
      };
      existing.total += 1;
      if (apt.status === "completed") existing.completed += 1;
      if (apt.status === "cancelled") existing.cancelled += 1;
      bookingsMap.set(dateKey, existing);
    }
    const bookings: BookingDataPoint[] = Array.from(bookingsMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, { total, completed, cancelled }]) => ({
        label,
        total,
        completed,
        cancelled,
      }));

    // Services chart — top servicios por número de citas
    const servicesMap = new Map<string, number>();
    for (const apt of currentAppointments) {
      const name = apt.service.name;
      servicesMap.set(name, (servicesMap.get(name) ?? 0) + 1);
    }
    const services: ServiceDataPoint[] = Array.from(servicesMap.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));

    // Employee performance — bookings y revenue del período actual
    const employeeMap = new Map<
      string,
      { name: string; bookings: number; revenue: number }
    >();

    for (const apt of currentAppointments) {
      if (!apt.providerBusinessUser) continue;
      const id = apt.providerBusinessUser.id;
      const user = apt.providerBusinessUser.user;
      const firstName = user.firstName;
      const lastName = user.lastName ?? "";
      const name =
        apt.providerBusinessUser.displayName ??
        `${firstName} ${lastName}`.trim();

      const existing = employeeMap.get(id) ?? { name, bookings: 0, revenue: 0 };
      existing.bookings += 1;
      if (apt.status === "completed") {
        existing.revenue += apt.service.price.toNumber();
      }
      employeeMap.set(id, existing);
    }

    // Bookings del período anterior por empleado
    const prevBookingsMap = new Map<string, number>();
    for (const apt of prevAppointments) {
      if (!apt.providerBusinessUserId) continue;
      const id = apt.providerBusinessUserId;
      prevBookingsMap.set(id, (prevBookingsMap.get(id) ?? 0) + 1);
    }

    const employees: EmployeeDataPoint[] = Array.from(employeeMap.entries())
      .sort(([, a], [, b]) => b.bookings - a.bookings)
      .map(([id, { name, bookings, revenue }]) => {
        const nameParts = name.split(" ");
        const initials = nameParts
          .slice(0, 2)
          .map((p) => p[0]?.toUpperCase() ?? "")
          .join("");
        return {
          id,
          name,
          initials,
          bookings,
          revenue,
          bookingsPrev: prevBookingsMap.get(id) ?? 0,
        };
      });

    return { revenue, bookings, services, employees };
  }
}
