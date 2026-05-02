export interface RenderedEmail {
  subject: string;
  html: string;
}

export interface IEmailTemplatePort {
  render(
    templateName: string,
    data: Record<string, string | number>
  ): RenderedEmail | null;
}
