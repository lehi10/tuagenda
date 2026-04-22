export type AnalyticsPeriod =
  | "7days"
  | "30days"
  | "3months"
  | "6months"
  | "year";

export interface DashboardStats {
  totalAppointments: number;
  upcomingAppointments: number;
  totalClients: number;
  totalRevenue: number;
  totalAppointmentsPrev: number;
  totalClientsPrev: number;
  totalRevenuePrev: number;
}

export interface ChartDataPoint {
  label: string;
  revenue: number;
}

export interface BookingDataPoint {
  label: string;
  total: number;
  completed: number;
  cancelled: number;
}

export interface ServiceDataPoint {
  name: string;
  count: number;
}

export interface EmployeeDataPoint {
  id: string;
  name: string;
  initials: string;
  bookings: number;
  revenue: number;
  bookingsPrev: number;
}

export interface DashboardCharts {
  revenue: ChartDataPoint[];
  bookings: BookingDataPoint[];
  services: ServiceDataPoint[];
  employees: EmployeeDataPoint[];
}

interface AnalyticsInput {
  businessId: string;
  startDate: Date;
  endDate: Date;
  prevStartDate: Date;
  prevEndDate: Date;
}

export interface IAnalyticsRepository {
  getDashboardStats(input: AnalyticsInput): Promise<DashboardStats>;
  getDashboardCharts(input: AnalyticsInput): Promise<DashboardCharts>;
}
