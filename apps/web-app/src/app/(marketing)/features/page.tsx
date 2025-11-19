"use client";

import { useTranslation } from "@/client/i18n";
import { Button } from "@/client/components/ui/button";
import { ScrollReveal } from "@/client/components/ui/scroll-reveal";
import Link from "next/link";
import {
  Calendar,
  Users,
  Shield,
  BarChart3,
  CreditCard,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function FeaturesPage() {
  const { t } = useTranslation();

  const categories = [
    {
      icon: Calendar,
      title: t.pages.features.categories.scheduling.title,
      description: t.pages.features.categories.scheduling.description,
      color: "from-blue-500 to-cyan-500",
      href: "/features/scheduling",
    },
    {
      icon: Users,
      title: t.pages.features.categories.clients.title,
      description: t.pages.features.categories.clients.description,
      color: "from-purple-500 to-pink-500",
      href: "/features/clients",
    },
    {
      icon: Shield,
      title: t.pages.features.categories.team.title,
      description: t.pages.features.categories.team.description,
      color: "from-green-500 to-emerald-500",
      href: "/features/team",
    },
    {
      icon: BarChart3,
      title: t.pages.features.categories.analytics.title,
      description: t.pages.features.categories.analytics.description,
      color: "from-orange-500 to-red-500",
      href: "/features/analytics",
    },
    {
      icon: CreditCard,
      title: t.pages.features.categories.payments.title,
      description: t.pages.features.categories.payments.description,
      color: "from-indigo-500 to-purple-500",
      href: "/features/payments",
    },
  ];

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
                <Sparkles className="h-4 w-4" />
                {t.pages.features.badge}
              </div>
              <h1 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
                {t.pages.features.title}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
                {t.pages.features.subtitle}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Overview Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:gap-8">
            {categories.map((category, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <Link href={category.href}>
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-2xl hover:-translate-y-1">
                    {/* Gradient background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 transition-opacity group-hover:opacity-5`}
                    />

                    {/* Content */}
                    <div className="relative">
                      <div
                        className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} shadow-lg transition-transform group-hover:scale-110`}
                      >
                        <category.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="mb-3 text-2xl font-bold">
                        {category.title}
                      </h3>
                      <p className="mb-6 leading-relaxed text-muted-foreground">
                        {category.description}
                      </p>

                      {/* Learn more link */}
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        <span>Learn more</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
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
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                  <Sparkles className="h-4 w-4" />
                  <span>{t.pages.features.badge}</span>
                </div>

                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  {t.pages.features.cta.title}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg opacity-95 md:text-xl">
                  {t.pages.features.cta.description}
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="group h-14 gap-2 bg-white px-8 text-base font-semibold text-primary shadow-2xl transition-all hover:scale-105 hover:bg-white hover:shadow-2xl"
                    >
                      {t.pages.features.cta.button}
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
