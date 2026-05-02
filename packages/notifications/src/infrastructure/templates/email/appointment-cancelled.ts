import type { RenderedEmail } from "../../../core/domain/ports/IEmailTemplatePort";
import { baseLayout, appointmentCard } from "./base-layout";

interface Data {
  customerFirstName: string;
  serviceName: string;
  startTime: string;
  endTime?: string;
  notes?: string | null;
  businessName: string;
  businessPhone: string;
}

export function renderAppointmentCancelled(data: Data): RenderedEmail {
  const card = appointmentCard({
    serviceName: data.serviceName,
    startTime: data.startTime,
    endTime: data.endTime,
    notes: data.notes,
  });

  const content = `
    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;">
      Tu cita fue cancelada
    </p>
    <p style="margin:0 0 28px;font-size:15px;color:#52525b;line-height:1.6;">
      Hola <strong>${data.customerFirstName}</strong>, te informamos que la siguiente cita ha sido cancelada.
    </p>

    ${card}

    <p style="margin:0 0 6px;font-size:14px;color:#52525b;">
      Si deseas reagendar o tienes alguna consulta,
    </p>
    <p style="margin:0;font-size:14px;color:#52525b;">
      contáctanos al <strong style="color:#18181b;">${data.businessPhone}</strong> y con gusto te ayudamos.
    </p>
  `;

  return {
    subject: `Tu cita en ${data.businessName} fue cancelada`,
    html: baseLayout({
      businessName: data.businessName,
      title: "Cita cancelada",
      accentColor: "#dc2626",
      badgeLabel: "Cancelada",
      content,
    }),
  };
}
