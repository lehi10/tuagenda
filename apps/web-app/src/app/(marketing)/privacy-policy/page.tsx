import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-semibold text-foreground mt-10 mb-3 pb-2 border-b">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-foreground mt-6 mb-2">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
      {children}
    </p>
  ),
  ul: ({ children }) => <ul className="space-y-1.5 mb-4 ml-1">{children}</ul>,
  li: ({ children }) => (
    <li className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
      <span>{children}</span>
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary/30 bg-muted/40 rounded-r-xl px-4 py-3 my-4 text-sm text-muted-foreground">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
  th: ({ children }) => (
    <th className="text-left px-4 py-2 font-semibold text-foreground border border-border">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2 text-muted-foreground border border-border">
      {children}
    </td>
  ),
};

const SECTION_TITLES: Record<number, string> = {
  1: "Introducción",
  2: "Responsable",
  3: "Datos que recopilamos",
  4: "Finalidad",
  5: "Acceso de negocios",
  6: "Cookies",
  7: "Transferencia internacional",
  8: "Conservación",
  9: "Tus derechos",
  10: "Seguridad",
  11: "Menores de edad",
  12: "Cambios",
  13: "Contacto",
};

export default function PrivacyPolicyPage() {
  const filePath = path.join(
    process.cwd(),
    "src/content/legal/privacy-policy.es.md"
  );
  const content = fs.readFileSync(filePath, "utf-8");

  const lines = content.split("\n");
  const firstLine = lines[0];
  const body = lines.slice(1).join("\n");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
            Legal
          </div>
          <ReactMarkdown components={components}>{firstLine}</ReactMarkdown>
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p className="text-sm text-muted-foreground mt-1">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="font-medium text-muted-foreground">
                  {children}
                </strong>
              ),
            }}
          >
            {lines.find((l) => l.trim().startsWith("**")) ?? ""}
          </ReactMarkdown>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 py-10 pb-20">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Table of contents */}
          <aside className="lg:w-56 shrink-0">
            <div className="lg:sticky lg:top-[calc(4rem+1.5rem)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Contenido
              </p>
              <nav className="space-y-1">
                {Object.entries(SECTION_TITLES).map(([n, title]) => (
                  <a
                    key={n}
                    href={`#section-${n}`}
                    className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5"
                  >
                    {n}. {title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                ...components,
                h2: ({ children }) => {
                  const text = String(children);
                  const match = text.match(/^(\d+)\./);
                  const id = match ? `section-${match[1]}` : undefined;
                  return (
                    <h2
                      id={id}
                      className="text-xl font-semibold text-foreground mt-10 mb-3 pb-2 border-b scroll-mt-6"
                    >
                      {children}
                    </h2>
                  );
                },
              }}
            >
              {body}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
