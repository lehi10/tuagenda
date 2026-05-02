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

export function renderAppointmentCompleted(data: Data): RenderedEmail {
  const card = appointmentCard({
    serviceName: data.serviceName,
    startTime: data.startTime,
    endTime: data.endTime,
    notes: data.notes,
  });

  const content = `
    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;">
      ¡Gracias por tu visita!
    </p>
    <p style="margin:0 0 28px;font-size:15px;color:#52525b;line-height:1.6;">
      Hola <strong>${data.customerFirstName}</strong>, fue un placer atenderte. Esperamos que hayas tenido una excelente experiencia.
    </p>

    ${card}

    <p style="margin:0 0 6px;font-size:14px;color:#52525b;">
      ¿Te gustaría agendar tu próxima cita?
    </p>
    <p style="margin:0;font-size:14px;color:#52525b;">
      Escríbenos al <strong style="color:#18181b;">${data.businessPhone}</strong> y con gusto te atendemos.
    </p>
  `;

  return {
    subject: `Gracias por tu visita a ${data.businessName}`,
    html: baseLayout({
      businessName: data.businessName,
      title: "Visita completada",
      accentColor: "#7c3aed",
      badgeLabel: "Completada",
      content,
    }),
  };
}
