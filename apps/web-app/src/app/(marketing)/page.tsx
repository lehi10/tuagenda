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
  Check,
  ArrowRight,
  Sparkles,
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
      avatar:
        "https://ui-avatars.com/api/?name=Ana+Garcia&background=4C3DFF&color=fff&size=128&bold=true",
    },
    {
      quote: t.landing.testimonials.testimonial2.quote,
      name: t.landing.testimonials.testimonial2.name,
      role: t.landing.testimonials.testimonial2.role,
      avatar:
        "https://ui-avatars.com/api/?name=Carlos+Lopez&background=48A9A6&color=fff&size=128&bold=true",
    },
    {
      quote: t.landing.testimonials.testimonial3.quote,
      name: t.landing.testimonials.testimonial3.name,
      role: t.landing.testimonials.testimonial3.role,
      avatar:
        "https://ui-avatars.com/api/?name=Laura+Martinez&background=4C3DFF&color=fff&size=128&bold=true",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-1/4 top-1/3 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM0QzNERkYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTYgMGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptLTE2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTE2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0xNiAwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTYgMTZjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTE2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTM2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bS0xNi0xNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        </div>

        <div className="container relative mx-auto px-4 py-16 sm:py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left column - Content */}
              <div className="text-center lg:text-left">
                {/* Badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm sm:mb-8">
                  <Sparkles className="h-4 w-4" />
                  <span>Plataforma profesional de gestión</span>
                </div>

                <h1 className="bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
                  {t.landing.hero.title}
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl md:text-2xl">
                  {t.landing.hero.subtitle}
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-4 lg:justify-start">
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="group h-14 w-full gap-2 px-8 text-base font-semibold shadow-xl shadow-primary/25 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/30"
                    >
                      {t.landing.hero.cta}
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-14 w-full border-2 px-8 text-base font-semibold backdrop-blur-sm transition-all hover:scale-105 hover:border-primary/50 hover:bg-primary/5"
                    >
                      {t.auth.login}
                    </Button>
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-5 w-5 text-primary" />
                    <span>14 días gratis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Sin tarjeta</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Cancela cuando quieras</span>
                  </div>
                </div>
              </div>

              {/* Right column - Hero image placeholder */}
              <div className="relative hidden lg:block">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl" />
                <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-muted shadow-2xl">
                  {/* Placeholder for hero image/screenshot */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 via-secondary/5 to-background p-8">
                    <div className="h-full w-full rounded-xl border-2 border-dashed border-primary/20 bg-card/50 backdrop-blur-sm">
                      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                        <div className="rounded-full bg-primary/10 p-4">
                          <Calendar className="h-12 w-12 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Agrega aquí tu screenshot principal
                          <br />
                          <span className="text-xs">
                            (Dashboard, calendario, etc.)
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-12 sm:mt-20">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary sm:text-4xl md:text-5xl">
                  10K+
                </div>
                <div className="mt-2 text-sm text-muted-foreground sm:text-base">
                  Usuarios activos
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary sm:text-4xl md:text-5xl">
                  99.9%
                </div>
                <div className="mt-2 text-sm text-muted-foreground sm:text-base">
                  Tiempo activo
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary sm:text-4xl md:text-5xl">
                  24/7
                </div>
                <div className="mt-2 text-sm text-muted-foreground sm:text-base">
                  Soporte
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product showcase section - NEW */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-24 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-7xl">
            {/* Main product image */}
            <div className="relative">
              <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
                <div className="aspect-[16/9] bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-12">
                  <div className="h-full w-full rounded-2xl border-2 border-dashed border-primary/20 bg-background/80 backdrop-blur-sm">
                    <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
                      <div className="rounded-full bg-primary/10 p-6">
                        <BarChart3 className="h-16 w-16 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-foreground">
                          Screenshot principal del producto
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Muestra tu dashboard, interfaz principal o
                          funcionalidad destacada
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary images grid */}
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-muted to-background p-6">
                    <div className="h-full w-full rounded-xl border border-dashed border-border bg-background/50 backdrop-blur-sm">
                      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                        <div className="rounded-full bg-primary/10 p-3">
                          <Image
                            src="/placeholder.svg"
                            alt={`Feature ${i}`}
                            width={32}
                            height={32}
                            className="opacity-50"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Imagen {i}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative bg-gradient-to-b from-background via-background to-muted/30 py-24 sm:py-32"
      >
        {/* Background decoration */}
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute left-0 bottom-1/4 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Características poderosas
            </div>
            <h2 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
              {t.landing.features.title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t.landing.features.subtitle}
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-7xl gap-6 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5"
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 transition-opacity group-hover:opacity-100" />

                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                <div className="relative p-8">
                  {/* Icon with image placeholder */}
                  <div className="mb-6">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 transition-transform group-hover:scale-110">
                      <feature.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                  </div>

                  {/* Image placeholder for feature screenshot */}
                  <div className="mb-6 overflow-hidden rounded-lg border border-border bg-muted">
                    <div className="aspect-video bg-gradient-to-br from-muted to-background p-4">
                      <div className="flex h-full items-center justify-center rounded border border-dashed border-border bg-background/50">
                        <p className="text-xs text-muted-foreground">
                          Screenshot
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works section - NEW */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-4 py-2 text-sm font-medium text-secondary backdrop-blur-sm">
              Proceso simple
            </div>
            <h2 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
              Cómo funciona
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
              Comienza en minutos con nuestro proceso simple y guiado
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-6xl lg:mt-20">
            <div className="grid gap-12 md:gap-16">
              {[
                {
                  step: "01",
                  title: "Crea tu cuenta",
                  description:
                    "Regístrate gratis en menos de 2 minutos. Sin tarjeta de crédito requerida.",
                },
                {
                  step: "02",
                  title: "Configura tu negocio",
                  description:
                    "Personaliza servicios, horarios y equipo según tus necesidades.",
                },
                {
                  step: "03",
                  title: "Comienza a gestionar",
                  description:
                    "Recibe reservas, gestiona clientes y haz crecer tu negocio.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="mb-4 inline-flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-lg font-bold text-white">
                        {item.step}
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold md:text-3xl">
                      {item.title}
                    </h3>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                      <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-8">
                        <div className="h-full w-full rounded-xl border-2 border-dashed border-primary/20 bg-background/50 backdrop-blur-sm">
                          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                            <div className="rounded-full bg-primary/10 p-4">
                              <span className="text-4xl font-bold text-primary">
                                {item.step}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Imagen del paso {item.step}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 via-muted/10 to-background py-24 sm:py-32">
        {/* Background decoration */}
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-4 py-2 text-sm font-medium text-secondary backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Testimonios
            </div>
            <h2 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
              {t.landing.testimonials.title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t.landing.testimonials.subtitle}
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-7xl gap-6 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-secondary/30 hover:shadow-2xl hover:shadow-secondary/5"
              >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                {/* Quote icon */}
                <div className="absolute right-6 top-6 opacity-10 transition-all group-hover:scale-110 group-hover:opacity-20">
                  <svg
                    className="h-12 w-12 text-secondary"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                <div className="relative p-8">
                  <div className="mb-6 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-5 w-5 fill-secondary text-secondary"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="mb-6 text-base leading-relaxed text-foreground">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-4 border-t border-border pt-6">
                    <div className="relative flex-shrink-0">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary to-secondary opacity-75 blur-sm" />
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={56}
                        height={56}
                        className="relative h-14 w-14 rounded-full border-2 border-background"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">
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
      <section className="relative overflow-hidden py-24 sm:py-32">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/90 shadow-2xl">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTYgMGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptLTE2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTE2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0xNiAwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTYgMTZjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTE2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTM2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bS0xNi0xNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />

            {/* Glowing orbs */}
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-secondary opacity-30 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white opacity-10 blur-3xl" />

            <div className="relative px-8 py-16 text-center text-primary-foreground sm:px-12 sm:py-20 md:px-16 md:py-24">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                <span>Comienza hoy</span>
              </div>

              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {t.landing.cta.title}
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg opacity-95 sm:text-xl md:text-2xl">
                {t.landing.cta.subtitle}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="group h-14 w-full gap-2 bg-white px-8 text-base font-semibold text-primary shadow-2xl transition-all hover:scale-105 hover:bg-white hover:shadow-2xl"
                  >
                    {t.landing.cta.button}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm opacity-90">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>Sin tarjeta de crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>Prueba gratuita 14 días</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
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
