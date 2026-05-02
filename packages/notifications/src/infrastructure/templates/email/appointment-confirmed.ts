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

export function renderAppointmentConfirmed(data: Data): RenderedEmail {
  const card = appointmentCard({
    serviceName: data.serviceName,
    startTime: data.startTime,
    endTime: data.endTime,
    notes: data.notes,
  });

  const content = `
    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;">
      Cita confirmada
    </p>
    <p style="margin:0 0 28px;font-size:15px;color:#52525b;line-height:1.6;">
      Hola <strong>${data.customerFirstName}</strong>, el equipo de <strong>${data.businessName}</strong> ha confirmado tu cita. ¡Te esperamos!
    </p>

    ${card}

    <p style="margin:0 0 6px;font-size:14px;color:#52525b;">
      ¿Necesitas reagendar o cancelar?
    </p>
    <p style="margin:0;font-size:14px;color:#52525b;">
      Comunícate con nosotros al <strong style="color:#18181b;">${data.businessPhone}</strong> con anticipación.
    </p>
  `;

  return {
    subject: `Tu cita en ${data.businessName} fue confirmada`,
    html: baseLayout({
      businessName: data.businessName,
      title: "Cita confirmada",
      accentColor: "#16a34a",
      badgeLabel: "Confirmada",
      content,
    }),
  };
}
