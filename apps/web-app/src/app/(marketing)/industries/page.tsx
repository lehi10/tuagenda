"use client";

import { useTranslation } from "@/client/i18n";
import { Button } from "@/client/components/ui/button";
import { ScrollReveal } from "@/client/components/ui/scroll-reveal";
import Link from "next/link";
import {
  Scissors,
  Sparkles,
  Heart,
  Dumbbell,
  Palette,
  Briefcase,
  Check,
  ArrowRight,
  Image as ImageIcon,
  TrendingUp,
} from "lucide-react";

export default function IndustriesPage() {
  const { t } = useTranslation();

  const industries = [
    {
      icon: Scissors,
      title: t.pages.industries.industries.salons.title,
      description: t.pages.industries.industries.salons.description,
      features: t.pages.industries.industries.salons.features,
      stats: t.pages.industries.industries.salons.stats,
      color: "from-pink-500 to-rose-500",
      image: "/images/industries/salons.jpg",
    },
    {
      icon: Sparkles,
      title: t.pages.industries.industries.spas.title,
      description: t.pages.industries.industries.spas.description,
      features: t.pages.industries.industries.spas.features,
      stats: t.pages.industries.industries.spas.stats,
      color: "from-purple-500 to-indigo-500",
      image: "/images/industries/spas.jpg",
    },
    {
      icon: Heart,
      title: t.pages.industries.industries.medical.title,
      description: t.pages.industries.industries.medical.description,
      features: t.pages.industries.industries.medical.features,
      stats: t.pages.industries.industries.medical.stats,
      color: "from-blue-500 to-cyan-500",
      image: "/images/industries/medical.jpg",
    },
    {
      icon: Dumbbell,
      title: t.pages.industries.industries.fitness.title,
      description: t.pages.industries.industries.fitness.description,
      features: t.pages.industries.industries.fitness.features,
      stats: t.pages.industries.industries.fitness.stats,
      color: "from-green-500 to-emerald-500",
      image: "/images/industries/fitness.jpg",
    },
    {
      icon: Palette,
      title: t.pages.industries.industries.beauty.title,
      description: t.pages.industries.industries.beauty.description,
      features: t.pages.industries.industries.beauty.features,
      stats: t.pages.industries.industries.beauty.stats,
      color: "from-amber-500 to-orange-500",
      image: "/images/industries/beauty.jpg",
    },
    {
      icon: Briefcase,
      title: t.pages.industries.industries.consulting.title,
      description: t.pages.industries.industries.consulting.description,
      features: t.pages.industries.industries.consulting.features,
      stats: t.pages.industries.industries.consulting.stats,
      color: "from-slate-500 to-gray-500",
      image: "/images/industries/consulting.jpg",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-secondary/5 to-background">
        <div className="absolute inset-0">
          <div className="absolute -left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-secondary/10 blur-3xl" />
          <div
            className="absolute -right-1/4 top-1/3 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="container relative mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-3 py-1.5 text-xs font-medium text-secondary backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm">
                <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
                {t.pages.industries.badge}
              </div>
              <h1 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
                {t.pages.industries.title}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                {t.pages.industries.subtitle}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:gap-10 lg:gap-12">
            {industries.map((industry, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div
                  className={`grid items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-12 ${
                    index % 2 === 1 ? "lg:grid-flow-dense" : ""
                  }`}
                >
                  {/* Content */}
                  <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                    <div className="mb-6">
                      <div
                        className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br sm:h-14 sm:w-14 md:h-16 md:w-16 ${industry.color} shadow-lg`}
                      >
                        <industry.icon className="h-6 w-6 text-white sm:h-7 sm:w-7 md:h-8 md:w-8" />
                      </div>
                      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                        {industry.title}
                      </h2>
                      <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                        {industry.description}
                      </p>
                    </div>

                    {/* Features List */}
                    <ul className="mb-6 space-y-3">
                      {industry.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          <Check className="mt-1 h-5 w-5 shrink-0 text-primary" />
                          <span className="text-base">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Stats Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="font-medium">{industry.stats}</span>
                    </div>

                    <Link href="/signup">
                      <Button
                        size="lg"
                        className="group gap-2 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                      >
                        {t.pages.industries.cta.button}
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>

                  {/* Image Placeholder */}
                  <div className={index % 2 === 1 ? "lg:col-start-1" : ""}>
                    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-xl transition-all hover:shadow-2xl">
                      <div className="aspect-[4/3] bg-gradient-to-br from-muted via-background to-muted/50 p-8">
                        <div className="h-full w-full rounded-xl border-2 border-dashed border-border bg-background/50 backdrop-blur-sm">
                          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                            <div
                              className={`rounded-full bg-gradient-to-br ${industry.color} p-4`}
                            >
                              <ImageIcon className="h-12 w-12 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {t.pages.industries.imagePlaceholder}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {industry.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/30 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                {t.pages.industries.testimonials.title}
              </h2>
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                {t.pages.industries.testimonials.subtitle}
              </p>
            </div>
          </ScrollReveal>

          {/* Testimonial Placeholders */}
          <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-3 md:gap-8">
            {[1, 2, 3].map((i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md sm:p-8">
                  <div className="mb-4 h-32 rounded-lg border-2 border-dashed border-border bg-muted/20" />
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-4 w-full rounded bg-muted" />
                    <div className="h-4 w-5/6 rounded bg-muted" />
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-24 rounded bg-muted" />
                      <div className="h-3 w-32 rounded bg-muted" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
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
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
                  {t.pages.industries.cta.title}
                </h2>

                <div className="mt-8">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="group h-12 gap-2 bg-white px-6 text-sm font-semibold text-primary shadow-2xl transition-all hover:scale-105 hover:bg-white hover:shadow-2xl sm:h-14 sm:px-8 sm:text-base"
                    >
                      {t.pages.industries.cta.button}
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
