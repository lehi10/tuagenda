import type {
  IEmailTemplatePort,
  RenderedEmail,
} from "../../../core/domain/ports/IEmailTemplatePort";
import { renderAppointmentCreated } from "./appointment-created";
import { renderAppointmentConfirmed } from "./appointment-confirmed";
import { renderAppointmentCompleted } from "./appointment-completed";
import { renderAppointmentCancelled } from "./appointment-cancelled";

type TemplateData = Parameters<typeof renderAppointmentCreated>[0];
type TemplateRenderer = (data: TemplateData) => RenderedEmail;

const templates: Record<string, TemplateRenderer> = {
  "appointment.created": renderAppointmentCreated,
  "appointment.confirmed": renderAppointmentConfirmed,
  "appointment.completed": renderAppointmentCompleted,
  "appointment.cancelled": renderAppointmentCancelled,
};

export class StaticEmailTemplateAdapter implements IEmailTemplatePort {
  render(
    templateName: string,
    data: Record<string, string | number>
  ): RenderedEmail | null {
    const renderer = templates[templateName];
    if (!renderer) return null;
    return renderer(data as unknown as TemplateData);
  }
}
