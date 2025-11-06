import type { Appointment } from "../types/appointment";

/**
 * Mock appointments data for demonstration
 * In a real application, this would come from an API or database
 */
export const mockAppointments: Appointment[] = [
  {
    id: "1",
    title: "Haircut Appointment",
    start: new Date(2025, 9, 29, 9, 0), // Oct 29, 2025, 9:00 AM
    end: new Date(2025, 9, 29, 10, 0), // Oct 29, 2025, 10:00 AM
    client: "John Doe",
    service: "Haircut",
    employee: "Sarah Johnson",
    status: "pending",
    description: "Regular haircut appointment",
  },
  {
    id: "2",
    title: "Manicure Appointment",
    start: new Date(2025, 9, 29, 10, 30), // Oct 29, 2025, 10:30 AM
    end: new Date(2025, 9, 29, 11, 30), // Oct 29, 2025, 11:30 AM
    client: "Jane Smith",
    service: "Manicure",
    employee: "Emily Davis",
    status: "pending",
    description: "Gel manicure with nail art",
  },
  {
    id: "3",
    title: "Massage Session",
    start: new Date(2025, 9, 29, 14, 0), // Oct 29, 2025, 2:00 PM
    end: new Date(2025, 9, 29, 15, 0), // Oct 29, 2025, 3:00 PM
    client: "Bob Wilson",
    service: "Massage",
    employee: "Mike Brown",
    status: "completed",
    description: "60-minute relaxation massage",
  },
  {
    id: "4",
    title: "Hair Coloring",
    start: new Date(2025, 9, 30, 10, 0), // Oct 30, 2025, 10:00 AM
    end: new Date(2025, 9, 30, 12, 0), // Oct 30, 2025, 12:00 PM
    client: "Alice Cooper",
    service: "Hair Coloring",
    employee: "Sarah Johnson",
    status: "pending",
    description: "Full hair color and highlights",
  },
  {
    id: "5",
    title: "Facial Treatment",
    start: new Date(2025, 9, 30, 15, 0), // Oct 30, 2025, 3:00 PM
    end: new Date(2025, 9, 30, 16, 0), // Oct 30, 2025, 4:00 PM
    client: "Charlie Brown",
    service: "Facial",
    employee: "Emily Davis",
    status: "pending",
    description: "Deep cleansing facial",
  },
  {
    id: "6",
    title: "Cancelled Appointment",
    start: new Date(2025, 9, 31, 9, 0), // Oct 31, 2025, 9:00 AM
    end: new Date(2025, 9, 31, 10, 0), // Oct 31, 2025, 10:00 AM
    client: "David Lee",
    service: "Haircut",
    employee: "Sarah Johnson",
    status: "cancelled",
    description: "Client cancelled - weather",
  },
  {
    id: "7",
    title: "Pedicure Appointment",
    start: new Date(2025, 10, 1, 11, 0), // Nov 1, 2025, 11:00 AM
    end: new Date(2025, 10, 1, 12, 0), // Nov 1, 2025, 12:00 PM
    client: "Emma Watson",
    service: "Pedicure",
    employee: "Emily Davis",
    status: "pending",
    description: "Spa pedicure with polish",
  },
  {
    id: "8",
    title: "Styling Session",
    start: new Date(2025, 10, 2, 13, 0), // Nov 2, 2025, 1:00 PM
    end: new Date(2025, 10, 2, 14, 30), // Nov 2, 2025, 2:30 PM
    client: "Frank Miller",
    service: "Hair Styling",
    employee: "Sarah Johnson",
    status: "pending",
    description: "Special event hair styling",
  },
];
