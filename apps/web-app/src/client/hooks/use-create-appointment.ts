"use client";

import { useTrpc } from "@/client/lib/trpc";
import type { BookingData } from "@/client/types/booking";

export function useCreateAppointment() {
  const mutation = useTrpc.appointment.create.useMutation();

  const createAppointment = async (
    bookingData: BookingData,
    businessId: string
  ): Promise<string> => {
    const userId = bookingData.clientInfo?.userId;
    if (!userId) throw new Error("Sesión de usuario no encontrada");
    if (
      !bookingData.service ||
      !bookingData.slotStartTime ||
      !bookingData.slotEndTime
    )
      throw new Error("Faltan datos para crear la reserva");

    const result = await mutation.mutateAsync({
      customerId: userId,
      businessId,
      serviceId: bookingData.service.id,
      providerBusinessUserId: bookingData.professional?.id ?? null,
      startTime: bookingData.slotStartTime.toISOString(),
      endTime: bookingData.slotEndTime.toISOString(),
      notes: null,
      isGroup: false,
      capacity: null,
    });

    return result.appointment.id!;
  };

  return { createAppointment, isPending: mutation.isPending };
}
