"use client";

import { useState } from "react";
import { useTranslation } from "@/client/i18n";
import { Button } from "@/client/components/ui/button";
import { ScrollReveal } from "@/client/components/ui/scroll-reveal";
import Link from "next/link";
import {
  Calendar,
  CreditCard,
  Mail,
  MessageSquare,
  Zap,
  Code2,
  Check,
  ArrowRight,
  Link2,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";

export default function IntegrationsPage() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: t.pages.integrations.categories.all },
    { id: "calendar", name: t.pages.integrations.categories.calendar },
    { id: "payments", name: t.pages.integrations.categories.payments },
    { id: "marketing", name: t.pages.integrations.categories.marketing },
    {
      id: "communication",
      name: t.pages.integrations.categories.communication,
    },
    {
      id: "productivity",
      name: t.pages.integrations.categories.productivity,
    },
  ];

  const integrations = [
    {
      name: t.pages.integrations.list.googleCalendar.name,
      description: t.pages.integrations.list.googleCalendar.description,
      category: "calendar",
      icon: Calendar,
      color: "from-blue-500 to-cyan-500",
      featured: true,
    },
    {
      name: t.pages.integrations.list.outlook.name,
      description: t.pages.integrations.list.outlook.description,
      category: "calendar",
      icon: Calendar,
      color: "from-blue-600 to-blue-400",
      featured: false,
    },
    {
      name: t.pages.integrations.list.stripe.name,
      description: t.pages.integrations.list.stripe.description,
      category: "payments",
      icon: CreditCard,
      color: "from-purple-500 to-indigo-500",
      featured: true,
    },
    {
      name: t.pages.integrations.list.paypal.name,
      description: t.pages.integrations.list.paypal.description,
      category: "payments",
      icon: CreditCard,
      color: "from-blue-500 to-blue-600",
      featured: false,
    },
    {
      name: t.pages.integrations.list.mailchimp.name,
      description: t.pages.integrations.list.mailchimp.description,
      category: "marketing",
      icon: Mail,
      color: "from-yellow-500 to-yellow-600",
      featured: true,
    },
    {
      name: t.pages.integrations.list.zoom.name,
      description: t.pages.integrations.list.zoom.description,
      category: "communication",
      icon: MessageSquare,
      color: "from-blue-400 to-blue-500",
      featured: true,
    },
    {
      name: t.pages.integrations.list.slack.name,
      description: t.pages.integrations.list.slack.description,
      category: "communication",
      icon: MessageSquare,
      color: "from-purple-600 to-pink-500",
      featured: false,
    },
    {
      name: t.pages.integrations.list.zapier.name,
      description: t.pages.integrations.list.zapier.description,
      category: "productivity",
      icon: Zap,
      color: "from-orange-500 to-red-500",
      featured: true,
    },
    {
      name: t.pages.integrations.list.hubspot.name,
      description: t.pages.integrations.list.hubspot.description,
      category: "marketing",
      icon: Mail,
      color: "from-orange-500 to-orange-600",
      featured: false,
    },
    {
      name: t.pages.integrations.list.quickbooks.name,
      description: t.pages.integrations.list.quickbooks.description,
      category: "payments",
      icon: CreditCard,
      color: "from-green-500 to-green-600",
      featured: false,
    },
  ];

  const filteredIntegrations =
    activeCategory === "all"
      ? integrations
      : integrations.filter((int) => int.category === activeCategory);

  const featuredIntegrations = integrations.filter((int) => int.featured);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="absolute inset-0">
          <div className="absolute -left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl" />
          <div
            className="absolute -right-1/4 top-1/3 h-96 w-96 animate-pulse rounded-full bg-secondary/10 blur-3xl"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
                <Link2 className="h-4 w-4" />
                {t.pages.integrations.badge}
              </div>
              <h1 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
                {t.pages.integrations.title}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
                {t.pages.integrations.subtitle}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Integrations */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {t.pages.integrations.featured.title}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t.pages.integrations.featured.description}
              </p>
            </div>
          </ScrollReveal>

          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {featuredIntegrations.map((integration, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-xl">
                  {/* Featured badge */}
                  <div className="absolute right-4 top-4 z-10">
                    <div className="flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                      <Sparkles className="h-3 w-3" />
                      <span>Featured</span>
                    </div>
                  </div>

                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="relative p-6">
                    {/* Logo placeholder */}
                    <div
                      className={`mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br ${integration.color} shadow-lg transition-transform group-hover:scale-110`}
                    >
                      <integration.icon className="h-12 w-12 text-white" />
                    </div>

                    <h3 className="mb-2 text-xl font-bold">
                      {integration.name}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                      {integration.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Link2 className="h-4 w-4" />
                      <span className="font-medium">Connect</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* All Integrations */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {t.pages.integrations.categories.all}
              </h2>
            </div>
          </ScrollReveal>

          {/* Category Filter */}
          <ScrollReveal delay={100}>
            <div className="mb-12 flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Integrations Grid */}
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {filteredIntegrations.map((integration, index) => (
              <ScrollReveal key={index} delay={index * 50}>
                <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="relative">
                    {/* Logo placeholder */}
                    <div className="mb-4 h-16 w-16 overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/20">
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                      </div>
                    </div>

                    <h3 className="mb-2 font-bold">{integration.name}</h3>
                    <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                      {integration.description}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="rounded-full bg-muted px-2 py-1">
                        {
                          categories.find((c) => c.id === integration.category)
                            ?.name
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <ScrollReveal>
              <div>
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
                  <Code2 className="h-8 w-8 text-white" />
                </div>
                <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                  {t.pages.integrations.api.title}
                </h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  {t.pages.integrations.api.description}
                </p>

                <ul className="mb-8 space-y-3">
                  {t.pages.integrations.api.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="mt-1 h-5 w-5 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button size="lg" className="gap-2">
                  {t.pages.integrations.api.cta}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                <div className="aspect-[4/3] bg-gradient-to-br from-muted via-background to-muted/50 p-8">
                  <div className="h-full w-full rounded-xl border-2 border-dashed border-border bg-background/50 backdrop-blur-sm">
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                      <div className="rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-4">
                        <Code2 className="h-12 w-12 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          API Documentation Screenshot
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {t.pages.integrations.imagePlaceholder}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background py-16 md:py-24">
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-primary/20 blur-3xl" />
          <div
            className="absolute right-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full bg-secondary/20 blur-3xl"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="container relative mx-auto px-4">
          <ScrollReveal>
            <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/90 shadow-2xl sm:rounded-3xl">
              <div className="relative px-6 py-12 text-center text-primary-foreground sm:px-8 sm:py-16 md:px-12 md:py-20">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  {t.pages.integrations.cta.title}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg opacity-95 md:text-xl">
                  {t.pages.integrations.cta.description}
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link href="/contact">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="group h-14 gap-2 bg-white px-8 text-base font-semibold text-primary shadow-2xl transition-all hover:scale-105 hover:bg-white hover:shadow-2xl"
                    >
                      {t.pages.integrations.cta.button}
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
