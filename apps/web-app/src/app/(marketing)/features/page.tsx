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

        <div className="container relative mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                {t.pages.features.badge}
              </div>
              <h1 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
                {t.pages.features.title}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg md:text-xl">
                {t.pages.features.subtitle}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Overview Grid */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:gap-8">
            {categories.map((category, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <Link href={category.href}>
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-2xl hover:-translate-y-1 sm:p-8">
                    {/* Gradient background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 transition-opacity group-hover:opacity-5`}
                    />

                    {/* Content */}
                    <div className="relative">
                      <div
                        className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} shadow-lg transition-transform group-hover:scale-110 sm:mb-6 sm:h-14 sm:w-14 md:h-16 md:w-16`}
                      >
                        <category.icon className="h-6 w-6 text-white sm:h-7 sm:w-7 md:h-8 md:w-8" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold sm:mb-3 sm:text-2xl">
                        {category.title}
                      </h3>
                      <p className="mb-4 text-sm leading-relaxed text-muted-foreground sm:mb-6 sm:text-base">
                        {category.description}
                      </p>

                      {/* Learn more link */}
                      <div className="flex items-center gap-2 text-xs font-medium text-primary sm:text-sm">
                        <span>Learn more</span>
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
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
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background py-12 sm:py-16 md:py-20 lg:py-24">
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
              <div className="relative px-4 py-10 text-center text-primary-foreground sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-12 lg:py-20">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium backdrop-blur-sm sm:mb-4 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{t.pages.features.badge}</span>
                </div>

                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
                  {t.pages.features.cta.title}
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-base opacity-95 sm:mt-4 sm:text-lg md:text-xl">
                  {t.pages.features.cta.description}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center sm:gap-4">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="group h-12 gap-2 bg-white px-6 text-sm font-semibold text-primary shadow-2xl transition-all hover:scale-105 hover:bg-white hover:shadow-2xl sm:h-14 sm:px-8 sm:text-base"
                    >
                      {t.pages.features.cta.button}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
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
