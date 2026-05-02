/**
 * Script de prueba: envía un email usando el template real y BrevoEmailAdapter.
 *
 * Uso:
 *   pnpm --filter worker test:email
 */

import {
  BrevoEmailAdapter,
  StaticEmailTemplateAdapter,
} from "notifications/infrastructure";

const TO_EMAIL = "lqmyacs@gmail.com";

const templates = new StaticEmailTemplateAdapter();
const brevo = new BrevoEmailAdapter(templates);

console.log(`Enviando email de prueba a ${TO_EMAIL}...`);

const result = await brevo.send({
  templateName: "appointment.created",
  recipientEmail: TO_EMAIL,
  recipientName: "Lehi",
  templateData: {
    customerFirstName: "Lehi",
    serviceName: "Corte de cabello",
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    businessName: "Barbería TuAgenda",
    businessPhone: "+51999999999",
  },
});

if (!result.success) {
  console.error("❌ Error:", result.error);
  process.exit(1);
}

console.log("✅ Email enviado correctamente");
console.log("   messageId:", result.messageId);
