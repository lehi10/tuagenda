import type { RenderedEmail } from "../../../core/domain/ports/IEmailTemplatePort";

interface Data {
  customerFirstName: string;
  serviceName: string;
  startTime: string;
  businessName: string;
  businessPhone: string;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("es-PE", {
    timeZone: "America/Lima",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function renderAppointmentCancelled(data: Data): RenderedEmail {
  return {
    subject: `Tu cita en ${data.businessName} fue cancelada`,
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cita cancelada</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">

          <tr>
            <td style="background:#18181b;padding:32px;text-align:center;">
              <p style="margin:0;color:#ffffff;font-size:22px;font-weight:bold;">${data.businessName}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:40px 32px;">
              <p style="margin:0 0 16px;font-size:16px;color:#18181b;">Hola <strong>${data.customerFirstName}</strong>,</p>
              <p style="margin:0 0 32px;font-size:16px;color:#52525b;">Te informamos que tu cita ha sido cancelada.</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;border-radius:8px;margin-bottom:32px;">
                <tr>
                  <td style="padding:24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e4e4e7;">
                          <span style="color:#71717a;font-size:13px;">Servicio</span><br/>
                          <strong style="color:#18181b;font-size:15px;">${data.serviceName}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="color:#71717a;font-size:13px;">Fecha y hora</span><br/>
                          <strong style="color:#18181b;font-size:15px;">${formatDateTime(data.startTime)}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:14px;color:#52525b;">Si deseas reagendar tu cita, contáctanos al <strong>${data.businessPhone}</strong>.</p>
            </td>
          </tr>

          <tr>
            <td style="background:#f4f4f5;padding:24px;text-align:center;border-top:1px solid #e4e4e7;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;">Este correo fue enviado por ${data.businessName} a través de TuAgenda.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}
