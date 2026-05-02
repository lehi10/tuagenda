export interface BaseLayoutParams {
  businessName: string;
  title: string;
  accentColor: string;
  badgeLabel: string;
  content: string;
}

export function baseLayout({
  businessName,
  title,
  accentColor,
  badgeLabel,
  content,
}: BaseLayoutParams): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

          <!-- Header -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#18181b;border-radius:12px 12px 0 0;overflow:hidden;">
                <tr>
                  <td style="padding:32px 40px;">
                    <p style="margin:0 0 12px;color:#a1a1aa;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;font-weight:600;">
                      TuAgenda
                    </p>
                    <p style="margin:0 0 16px;color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">
                      ${businessName}
                    </p>
                    <span style="display:inline-block;background:${accentColor}22;color:${accentColor};font-size:12px;font-weight:600;padding:4px 12px;border-radius:999px;border:1px solid ${accentColor}44;">
                      ${badgeLabel}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#ffffff;border-radius:0 0 12px 12px;overflow:hidden;">
                <tr>
                  <td style="padding:40px;">
                    ${content}
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px 40px 28px;border-top:1px solid #f4f4f5;">
                    <p style="margin:0;font-size:11px;color:#a1a1aa;text-align:center;">
                      Este mensaje fue enviado por <strong>${businessName}</strong> a través de TuAgenda.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function appointmentCard({
  serviceName,
  startTime,
  endTime,
  notes,
}: {
  serviceName: string;
  startTime: string;
  endTime?: string;
  notes?: string | null;
}): string {
  const formattedDate = new Date(startTime).toLocaleString("es-PE", {
    timeZone: "America/Lima",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = new Date(startTime).toLocaleString("es-PE", {
    timeZone: "America/Lima",
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedEndTime = endTime
    ? new Date(endTime).toLocaleString("es-PE", {
        timeZone: "America/Lima",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return `
    <table width="100%" cellpadding="0" cellspacing="0"
      style="background:#fafafa;border:1px solid #e4e4e7;border-radius:8px;margin-bottom:28px;">
      <tr>
        <td style="padding:24px;">

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-bottom:16px;border-bottom:1px solid #e4e4e7;">
                <p style="margin:0 0 2px;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.06em;font-weight:600;">
                  Servicio
                </p>
                <p style="margin:0;font-size:16px;font-weight:600;color:#18181b;">${serviceName}</p>
              </td>
            </tr>
            <tr>
              <td style="padding-top:16px;padding-bottom:${notes ? "16px" : "0"};${notes ? "border-bottom:1px solid #e4e4e7;" : ""}">
                <p style="margin:0 0 2px;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.06em;font-weight:600;">
                  Fecha y hora
                </p>
                <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;text-transform:capitalize;">
                  ${formattedDate}
                </p>
                <p style="margin:4px 0 0;font-size:14px;color:#52525b;">
                  ${formattedTime}${formattedEndTime ? ` – ${formattedEndTime}` : ""}
                </p>
              </td>
            </tr>
            ${
              notes
                ? `<tr>
              <td style="padding-top:16px;">
                <p style="margin:0 0 2px;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.06em;font-weight:600;">
                  Notas
                </p>
                <p style="margin:0;font-size:14px;color:#52525b;">${notes}</p>
              </td>
            </tr>`
                : ""
            }
          </table>

        </td>
      </tr>
    </table>
  `;
}
