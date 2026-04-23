"use client";

import React, { useState } from "react";
import { useTranslation } from "@/client/i18n";
import { ScrollReveal } from "@/client/components/ui/scroll-reveal";
import { Check, Sparkles, X, Clock, MessageCircle } from "lucide-react";
import { WhatsAppIcon } from "@/client/components/shared";

const WAITLIST_URL = process.env.NEXT_PUBLIC_WAITLIST_FORM_URL ?? "";
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_NUMBER ?? "";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola! Quiero más información sobre los planes de tuAgenda 📅")}`;

const ctaUrl = WAITLIST_URL || WHATSAPP_URL;

export default function PricingPage() {
  const { t } = useTranslation();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: t.pages.pricing.free.name,
      monthlyPrice: "0",
      annualPrice: "0",
      currency: "S/",
      description: t.pages.pricing.free.description,
      badge: null,
      highlighted: false,
      features: [
        { text: t.pages.pricing.free.feature1, included: true },
        { text: t.pages.pricing.free.feature2, included: true },
        { text: t.pages.pricing.free.feature3, included: true },
        { text: t.pages.pricing.free.feature4, included: true },
        { text: t.pages.pricing.free.feature5, included: true },
        { text: t.pages.pricing.free.feature6, included: true },
        { text: t.pages.pricing.free.feature7, included: true },
        { text: t.pages.pricing.free.feature8, included: true },
        {
          text: t.pages.pricing.free.addonWhatsapp,
          included: false,
          addon: true,
        },
      ],
    },
    {
      name: t.pages.pricing.pro.name,
      monthlyPrice: "120",
      annualPrice: "96",
      currency: "S/",
      description: t.pages.pricing.pro.description,
      badge: t.pages.pricing.popular,
      highlighted: true,
      features: [
        { text: t.pages.pricing.pro.feature1, included: true },
        { text: t.pages.pricing.pro.feature2, included: true },
        { text: t.pages.pricing.pro.feature3, included: true },
        { text: t.pages.pricing.pro.feature4, included: true },
        { text: t.pages.pricing.pro.feature5, included: true },
        { text: t.pages.pricing.pro.feature6, included: true },
        { text: t.pages.pricing.pro.feature7, included: true },
        { text: t.pages.pricing.pro.feature8, included: true },
        {
          text: t.pages.pricing.pro.addonWhatsapp,
          included: false,
          addon: true,
        },
      ],
    },
    {
      name: t.pages.pricing.enterprise.name,
      monthlyPrice: null,
      annualPrice: null,
      currency: "",
      description: t.pages.pricing.enterprise.description,
      badge: null,
      highlighted: false,
      features: [
        { text: t.pages.pricing.enterprise.feature1, included: true },
        { text: t.pages.pricing.enterprise.feature2, included: true },
        { text: t.pages.pricing.enterprise.feature3, included: true },
        { text: t.pages.pricing.enterprise.feature4, included: true },
        { text: t.pages.pricing.enterprise.feature5, included: true },
        { text: t.pages.pricing.enterprise.feature6, included: true },
        { text: t.pages.pricing.enterprise.feature7, included: true },
        { text: t.pages.pricing.enterprise.feature8, included: true },
      ],
    },
  ];

  const comparisonFeatures = [
    {
      category: "Gestión de citas",
      items: [
        { name: "Citas/mes", free: "20", pro: "500", enterprise: "Ilimitadas" },
        {
          name: "Citas presenciales y virtuales",
          free: true,
          pro: true,
          enterprise: true,
        },
        { name: "Usuarios", free: "1", pro: "5", enterprise: "Ilimitados" },
        { name: "Ubicaciones", free: "1", pro: "3", enterprise: "Ilimitadas" },
        {
          name: "Base de datos de clientes",
          free: true,
          pro: true,
          enterprise: true,
        },
        { name: "Google Calendar", free: true, pro: true, enterprise: true },
      ],
    },
    {
      category: "Pagos",
      items: [
        { name: "Pago presencial", free: true, pro: true, enterprise: true },
        {
          name: "Pasarelas de pago online",
          free: false,
          pro: true,
          enterprise: true,
        },
        {
          name: "Cupones de descuento",
          free: false,
          pro: false,
          enterprise: true,
        },
      ],
    },
    {
      category: "Notificaciones",
      items: [
        {
          name: "Notificaciones por email",
          free: true,
          pro: true,
          enterprise: true,
        },
        {
          name: "Notificaciones WhatsApp/mes",
          free: "Add-on",
          pro: "500 + add-on",
          enterprise: "Ilimitadas",
        },
      ],
    },
    {
      category: "Reportes y soporte",
      items: [
        {
          name: "Reportes",
          free: "Básicos",
          pro: "Avanzados",
          enterprise: "Avanzados",
        },
        { name: "Soporte por email", free: true, pro: true, enterprise: true },
        {
          name: "Soporte prioritario",
          free: false,
          pro: true,
          enterprise: true,
        },
      ],
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="absolute inset-0">
          <div className="absolute -left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl" />
          <div
            className="absolute -right-1/4 top-1/3 h-96 w-96 animate-pulse rounded-full bg-secondary/10 blur-3xl"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="container relative mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-600 backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm dark:text-amber-400">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                {t.pages.pricing.badge} — Acceso anticipado gratuito
              </div>
              <h1 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
                {t.pages.pricing.title}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg md:text-xl">
                {t.pages.pricing.subtitle}
              </p>

              {/* Billing Toggle */}
              <div className="mt-6 inline-flex w-full max-w-sm items-center gap-2 rounded-full border border-border bg-card p-1 shadow-sm sm:mt-8 sm:w-auto sm:gap-3">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`flex-1 rounded-full px-4 py-2 text-xs font-medium transition-all sm:flex-none sm:px-6 sm:text-sm ${!isAnnual ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {t.pages.pricing.monthly}
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all sm:flex-none sm:gap-2 sm:px-6 sm:text-sm ${isAnnual ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {t.pages.pricing.annual}
                  <span className="rounded-full bg-green-500 px-1.5 py-0.5 text-[10px] font-semibold text-white sm:px-2 sm:text-xs">
                    {t.pages.pricing.save20}
                  </span>
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Coming soon banner */}
      <div className="border-b bg-amber-50 dark:bg-amber-950/30">
        <div className="container mx-auto flex items-center justify-center gap-2 px-4 py-3 text-center text-sm font-medium text-amber-700 dark:text-amber-400">
          <Sparkles className="h-4 w-4 shrink-0" />
          Precios oficiales muy pronto. Por ahora el acceso es{" "}
          <strong>gratuito y limitado</strong> para nuestros primeros negocios.
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 underline underline-offset-2 hover:no-underline"
          >
            Reserva tu lugar →
          </a>
        </div>
      </div>

      {/* Pricing Cards */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-6 sm:gap-8 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="relative h-full">
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-lg">
                        <Sparkles className="h-3 w-3" />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div
                    className={`relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 sm:p-8 transition-all ${plan.highlighted ? "border-primary shadow-2xl ring-2 ring-primary/20" : "border-border shadow-sm hover:border-primary/30 hover:shadow-lg"}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity hover:opacity-100" />

                    <div className="relative text-center">
                      <h3 className="text-xl font-bold sm:text-2xl">
                        {plan.name}
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                        {plan.description}
                      </p>

                      <div className="mt-4 sm:mt-6">
                        {plan.monthlyPrice !== null ? (
                          <>
                            <span className="text-sm font-medium text-muted-foreground">
                              {plan.currency}
                            </span>
                            <span className="text-4xl font-bold sm:text-5xl">
                              {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                            </span>
                            <span className="text-sm text-muted-foreground sm:text-base">
                              {t.pages.pricing.perMonth}
                            </span>
                            {isAnnual &&
                              plan.monthlyPrice !== plan.annualPrice && (
                                <p className="mt-1 text-xs text-green-600">
                                  antes S/{plan.monthlyPrice}/mes
                                </p>
                              )}
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-muted-foreground sm:text-3xl">
                            Precio próximamente
                          </span>
                        )}
                      </div>
                    </div>

                    <ul className="relative mt-8 flex-1 space-y-3">
                      {plan.features.map((feature, fi) => (
                        <li
                          key={fi}
                          className={`flex items-start gap-3 ${!feature.included && !("addon" in feature && feature.addon) ? "opacity-40" : ""}`}
                        >
                          {"addon" in feature && feature.addon ? (
                            <span className="mt-0.5 shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                              +
                            </span>
                          ) : feature.included ? (
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          ) : (
                            <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                          )}
                          <span className="text-sm">{feature.text}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="relative mt-8">
                      <a
                        href={ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-lg transition-all hover:scale-105 ${plan.highlighted ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border bg-card hover:border-primary/30 hover:bg-primary/5"}`}
                      >
                        {WAITLIST_URL ? (
                          <>{t.pages.pricing.getStarted}</>
                        ) : (
                          <>
                            <WhatsAppIcon size={16} /> Consultar por WhatsApp
                          </>
                        )}
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-muted/30 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mb-8 text-center sm:mb-12">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                {t.pages.pricing.comparison.title}
              </h2>
              <p className="mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg">
                {t.pages.pricing.comparison.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-3 text-left text-xs font-semibold sm:p-4 sm:text-sm">
                      Características
                    </th>
                    <th className="p-3 text-center text-xs font-semibold sm:p-4 sm:text-sm">
                      {t.pages.pricing.free.name}
                    </th>
                    <th className="p-3 text-center text-xs font-semibold text-primary sm:p-4 sm:text-sm">
                      {t.pages.pricing.pro.name}
                    </th>
                    <th className="p-3 text-center text-xs font-semibold sm:p-4 sm:text-sm">
                      {t.pages.pricing.enterprise.name}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((category, ci) => (
                    <React.Fragment key={ci}>
                      <tr className="border-b border-border bg-muted/20">
                        <td
                          colSpan={4}
                          className="p-3 text-xs font-semibold text-primary sm:p-4 sm:text-sm"
                        >
                          {category.category}
                        </td>
                      </tr>
                      {category.items.map((item, ii) => (
                        <tr
                          key={`${ci}-${ii}`}
                          className="border-b border-border transition-colors hover:bg-muted/10"
                        >
                          <td className="p-3 text-xs sm:p-4 sm:text-sm">
                            {item.name}
                          </td>
                          {(["free", "pro", "enterprise"] as const).map(
                            (key) => (
                              <td
                                key={key}
                                className="p-3 text-center text-xs sm:p-4 sm:text-sm"
                              >
                                {typeof item[key] === "boolean" ? (
                                  item[key] ? (
                                    <Check className="mx-auto h-4 w-4 text-primary sm:h-5 sm:w-5" />
                                  ) : (
                                    <X className="mx-auto h-4 w-4 text-muted-foreground sm:h-5 sm:w-5" />
                                  )
                                ) : (
                                  <span
                                    className={
                                      key === "pro"
                                        ? "font-medium text-primary"
                                        : ""
                                    }
                                  >
                                    {item[key] as string}
                                  </span>
                                )}
                              </td>
                            )
                          )}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl rounded-2xl border border-[#25D366]/20 bg-gradient-to-br from-[#25D366]/5 via-background to-[#25D366]/5 p-8 text-center shadow-lg sm:p-12">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366] shadow-lg shadow-[#25D366]/30">
                <MessageCircle className="h-7 w-7 text-white" />
              </div>
              <h2 className="mb-2 text-xl font-bold sm:text-2xl">
                ¿Tienes dudas sobre los planes?
              </h2>
              <p className="mb-6 text-muted-foreground">
                Escríbenos por WhatsApp y te explicamos todo.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white shadow-lg shadow-[#25D366]/25 transition-all hover:bg-[#1ebe5a] hover:-translate-y-0.5"
              >
                <WhatsAppIcon size={18} />
                Hablar por WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
