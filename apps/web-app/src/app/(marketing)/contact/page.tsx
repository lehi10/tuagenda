"use client";

import { useState } from "react";
import { ScrollReveal } from "@/client/components/ui/scroll-reveal";
import { ChevronDown, ChevronUp, Clock, Zap, Shield } from "lucide-react";
import { WhatsAppIcon } from "@/client/components/shared";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_NUMBER ?? "";
const WHATSAPP_MESSAGE = "Hola! Quiero más información sobre tuAgenda 📅";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const faqs = [
  {
    question: "¿Cómo funciona la prueba gratuita?",
    answer:
      "Tienes acceso completo a todas las funciones durante 14 días. No necesitas tarjeta de crédito y puedes cancelar en cualquier momento.",
  },
  {
    question: "¿Cuánto tiempo toma la configuración?",
    answer:
      "La mayoría de los negocios están operativos en menos de 15 minutos. Nuestro asistente de incorporación te guía paso a paso.",
  },
  {
    question: "¿Qué tipo de soporte ofrecen?",
    answer:
      "Soporte directo por WhatsApp. Respondemos rápido, sin tickets ni formularios complicados.",
  },
  {
    question: "¿Pueden ayudarme a migrar desde otra plataforma?",
    answer:
      "¡Sí! Escríbenos por WhatsApp y coordinamos un plan de migración personalizado para tu negocio.",
  },
  {
    question: "¿Puedo cambiar de plan más tarde?",
    answer:
      "Sí, puedes subir o bajar de plan en cualquier momento. Los cambios aplican de inmediato.",
  },
];

const perks = [
  {
    icon: Zap,
    title: "Respuesta rápida",
    description: "Te respondemos en minutos, no en días.",
  },
  {
    icon: Clock,
    title: "Sin formularios",
    description: "Directo al grano, sin pasos innecesarios.",
  },
  {
    icon: Shield,
    title: "Atención personalizada",
    description: "Hablas con personas reales, no bots.",
  },
];

export default function ContactPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl" />
          <div
            className="absolute -right-1/4 top-1/3 h-96 w-96 animate-pulse rounded-full bg-secondary/10 blur-3xl"
            style={{ animationDelay: "1s" }}
          />
        </div>
        <div className="container relative mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-3 py-1.5 text-xs font-medium text-[#1ebe5a] sm:px-4 sm:py-2 sm:text-sm">
                <WhatsAppIcon size={14} />
                Soporte por WhatsApp
              </div>
              <h1 className="bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
                ¿Tienes alguna duda?
              </h1>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                Escríbenos directamente. Nuestro equipo está listo para ayudarte
                a sacarle el máximo provecho a tuAgenda.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA principal */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl">
              {/* Card */}
              <div className="relative overflow-hidden rounded-3xl border border-[#25D366]/20 bg-gradient-to-br from-[#25D366]/5 via-background to-[#25D366]/5 p-8 shadow-xl sm:p-12">
                {/* Decoración */}
                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#25D366]/10 blur-3xl" />
                <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[#25D366]/10 blur-3xl" />

                <div className="relative text-center">
                  {/* Ícono grande */}
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#25D366] shadow-lg shadow-[#25D366]/30">
                    <WhatsAppIcon size={40} />
                  </div>

                  <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
                    Contáctanos por WhatsApp
                  </h2>
                  <p className="mb-8 text-muted-foreground sm:text-lg">
                    Haz clic y abre una conversación directa con nuestro equipo.
                    El mensaje ya viene escrito, solo envíalo.
                  </p>

                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 rounded-2xl bg-[#25D366] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#25D366]/25 transition-all hover:bg-[#1ebe5a] hover:shadow-xl hover:shadow-[#25D366]/30 hover:-translate-y-0.5 active:translate-y-0 sm:text-lg"
                  >
                    <WhatsAppIcon size={22} />
                    Abrir WhatsApp
                  </a>

                  {/* Mensaje preview */}
                  <div className="mx-auto mt-8 max-w-xs rounded-2xl bg-muted/60 px-4 py-3 text-left text-sm">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Mensaje que se enviará:
                    </p>
                    <p className="font-medium">
                      &ldquo;{WHATSAPP_MESSAGE}&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Perks */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                {perks.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm"
                  >
                    <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-xs font-semibold">{title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Preguntas frecuentes
              </h2>
              <p className="mt-3 text-muted-foreground">
                Si tu duda no está aquí, escríbenos por WhatsApp.
              </p>
            </div>
          </ScrollReveal>

          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((faq, index) => (
              <ScrollReveal key={index} delay={index * 50}>
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/20 sm:p-6"
                  >
                    <span className="pr-8 font-semibold">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-5 w-5 shrink-0 text-primary" />
                    ) : (
                      <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="border-t border-border bg-muted/10 px-4 py-4 sm:px-6">
                      <p className="leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* CTA final */}
          <ScrollReveal delay={300}>
            <div className="mx-auto mt-10 max-w-md text-center">
              <p className="mb-4 text-muted-foreground">
                ¿No encontraste lo que buscabas?
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 px-5 py-2.5 text-sm font-semibold text-[#1ebe5a] transition-colors hover:bg-[#25D366]/20"
              >
                <WhatsAppIcon size={16} />
                Pregúntanos por WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
