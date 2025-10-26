"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Users,
  UsersRound,
  BarChart3,
  MapPin,
  CreditCard,
} from "lucide-react";

export default function Home() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Calendar,
      title: t.landing.features.appointments.title,
      description: t.landing.features.appointments.description,
    },
    {
      icon: Users,
      title: t.landing.features.clients.title,
      description: t.landing.features.clients.description,
    },
    {
      icon: UsersRound,
      title: t.landing.features.team.title,
      description: t.landing.features.team.description,
    },
    {
      icon: BarChart3,
      title: t.landing.features.analytics.title,
      description: t.landing.features.analytics.description,
    },
    {
      icon: MapPin,
      title: t.landing.features.multiLocation.title,
      description: t.landing.features.multiLocation.description,
    },
    {
      icon: CreditCard,
      title: t.landing.features.payments.title,
      description: t.landing.features.payments.description,
    },
  ];

  const testimonials = [
    {
      quote: t.landing.testimonials.testimonial1.quote,
      name: t.landing.testimonials.testimonial1.name,
      role: t.landing.testimonials.testimonial1.role,
      avatar: "https://ui-avatars.com/api/?name=Ana+Garcia&background=4C3DFF&color=fff&size=128&bold=true",
    },
    {
      quote: t.landing.testimonials.testimonial2.quote,
      name: t.landing.testimonials.testimonial2.name,
      role: t.landing.testimonials.testimonial2.role,
      avatar: "https://ui-avatars.com/api/?name=Carlos+Lopez&background=48A9A6&color=fff&size=128&bold=true",
    },
    {
      quote: t.landing.testimonials.testimonial3.quote,
      name: t.landing.testimonials.testimonial3.name,
      role: t.landing.testimonials.testimonial3.role,
      avatar: "https://ui-avatars.com/api/?name=Laura+Martinez&background=4C3DFF&color=fff&size=128&bold=true",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-background" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM0QzNERkYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTYgMGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptLTE2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTE2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0xNiAwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTYgMTZjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTE2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTM2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bS0xNi0xNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />

        <div className="container relative mx-auto px-4 py-16 sm:py-20 md:py-32 lg:py-40">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary sm:mb-8 sm:px-4 sm:py-2 sm:text-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              <span className="hidden sm:inline">Plataforma profesional de gestión</span>
              <span className="sm:hidden">Profesional</span>
            </div>

            <h1 className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              {t.landing.hero.title}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:mt-8 sm:text-lg md:text-xl lg:text-2xl">
              {t.landing.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:justify-center sm:gap-4">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="group h-12 w-full gap-2 px-6 text-sm font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 sm:h-14 sm:px-8 sm:text-base">
                  {t.landing.hero.cta}
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-12 w-full border-2 px-6 text-sm font-semibold transition-all hover:border-primary/50 hover:bg-primary/5 sm:h-14 sm:px-8 sm:text-base">
                  {t.auth.login}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-border pt-8 sm:mt-20 sm:gap-8 sm:pt-12">
              <div>
                <div className="text-2xl font-bold text-primary sm:text-3xl md:text-4xl">10K+</div>
                <div className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">Usuarios activos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary sm:text-3xl md:text-4xl">99.9%</div>
                <div className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">Tiempo activo</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary sm:text-3xl md:text-4xl">24/7</div>
                <div className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">Soporte</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-16 sm:py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary sm:mb-4 sm:px-4 sm:py-1.5 sm:text-sm">
              Características poderosas
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {t.landing.features.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg md:text-xl">
              {t.landing.features.subtitle}
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:mt-16 sm:gap-6 md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 sm:rounded-2xl sm:p-8"
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="relative">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 sm:mb-6 sm:h-14 sm:w-14 sm:rounded-xl">
                    <feature.icon className="h-6 w-6 text-primary-foreground sm:h-7 sm:w-7" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold sm:mb-3 sm:text-xl">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 to-background py-16 sm:py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-3 py-1 text-xs font-medium text-secondary sm:mb-4 sm:px-4 sm:py-1.5 sm:text-sm">
              Testimonios
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {t.landing.testimonials.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg md:text-xl">
              {t.landing.testimonials.subtitle}
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:mt-16 sm:gap-6 md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-secondary/30 hover:shadow-xl hover:shadow-secondary/5 sm:rounded-2xl sm:p-8"
              >
                {/* Quote icon */}
                <div className="absolute right-4 top-4 opacity-10 transition-opacity group-hover:opacity-20 sm:right-6 sm:top-6">
                  <svg className="h-10 w-10 text-secondary sm:h-12 sm:w-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                <div className="relative">
                  <p className="mb-4 text-sm leading-relaxed italic text-foreground sm:mb-6 sm:text-base">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 border-t border-border pt-4 sm:gap-4 sm:pt-6">
                    <div className="relative flex-shrink-0">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary to-secondary opacity-75 blur-sm" />
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="relative h-10 w-10 rounded-full border-2 border-background sm:h-12 sm:w-12"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground sm:text-base">{testimonial.name}</p>
                      <p className="truncate text-xs text-muted-foreground sm:text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/90 p-8 shadow-2xl sm:rounded-3xl sm:p-12 md:p-16 lg:p-20">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTYgMGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptLTE2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTE2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0xNiAwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTYgMTZjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTE2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTM2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bS0xNi0xNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />

            {/* Glowing orbs */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-secondary opacity-20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-foreground opacity-10 blur-3xl" />

            <div className="relative text-center text-primary-foreground">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                {t.landing.cta.title}
              </h2>
              <p className="mt-4 text-base opacity-95 sm:mt-6 sm:text-lg md:text-xl lg:text-2xl">{t.landing.cta.subtitle}</p>
              <div className="mt-8 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:justify-center sm:gap-4">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="group h-12 w-full gap-2 bg-white px-6 text-sm font-semibold text-primary shadow-xl transition-all hover:scale-105 hover:bg-white hover:shadow-2xl sm:h-14 sm:px-8 sm:text-base"
                  >
                    {t.landing.cta.button}
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 flex flex-col items-center justify-center gap-3 text-xs opacity-80 sm:mt-12 sm:flex-row sm:flex-wrap sm:gap-6 sm:text-sm">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Sin tarjeta de crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Prueba gratuita 14 días</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Cancela cuando quieras</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
