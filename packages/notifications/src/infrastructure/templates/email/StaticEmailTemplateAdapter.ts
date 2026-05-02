import type {
  IEmailTemplatePort,
  RenderedEmail,
} from "../../../core/domain/ports/IEmailTemplatePort";
import { renderAppointmentCreated } from "./appointment-created";
import { renderAppointmentCancelled } from "./appointment-cancelled";

type TemplateRenderer = (
  data: Record<string, string | number>
) => RenderedEmail;

const templates: Record<string, TemplateRenderer> = {
  "appointment.created": (data) =>
    renderAppointmentCreated(data as unknown as Parameters<typeof renderAppointmentCreated>[0]),
  "appointment.cancelled": (data) =>
    renderAppointmentCancelled(data as unknown as Parameters<typeof renderAppointmentCancelled>[0]),
};

export class StaticEmailTemplateAdapter implements IEmailTemplatePort {
  render(
    templateName: string,
    data: Record<string, string | number>
  ): RenderedEmail | null {
    const renderer = templates[templateName];
    if (!renderer) return null;
    return renderer(data);
  }
}
