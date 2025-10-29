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
      <section className="relative overflow-hidden bg-black">
        {/* Animated background elements with vibrant glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-purple-600/30 blur-[120px] animate-pulse" />
          <div className="absolute -right-1/4 top-1/3 h-[600px] w-[600px] rounded-full bg-teal-500/20 blur-[120px] animate-pulse [animation-delay:1s]" />
          <div className="absolute left-1/2 bottom-0 h-[400px] w-[400px] rounded-full bg-blue-500/20 blur-[100px] animate-pulse [animation-delay:2s]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4C3DFF08_1px,transparent_1px),linear-gradient(to_bottom,#4C3DFF08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        <div className="container relative mx-auto px-4 py-16 sm:py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left column - Content */}
              <div className="text-center lg:text-left">
                {/* Badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/50 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300 backdrop-blur-sm sm:mb-8 shadow-lg shadow-purple-500/20">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  <span>Plataforma profesional de gestión</span>
                </div>

                <h1 className="bg-gradient-to-br from-white via-purple-100 to-purple-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-2xl">
                  {t.landing.hero.title}
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-gray-300 sm:text-xl md:text-2xl">
                  {t.landing.hero.subtitle}
                </p>
                
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-4 lg:justify-start">
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="group h-14 w-full gap-2 px-8 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 shadow-xl shadow-purple-500/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/60 border-0"
                    >
                      {t.landing.hero.cta}
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-14 w-full border-2 border-gray-700 bg-black/50 text-white px-8 text-base font-semibold backdrop-blur-sm transition-all hover:scale-105 hover:border-purple-500/50 hover:bg-purple-500/10"
                    >
                      {t.auth.login}
                    </Button>
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-5 w-5 text-teal-400" />
                    <span>14 días gratis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-5 w-5 text-teal-400" />
                    <span>Sin tarjeta</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-5 w-5 text-teal-400" />
                    <span>Cancela cuando quieras</span>
                  </div>
                </div>
              </div>

              {/* Right column - Abstract visualization */}
              <div className="relative hidden lg:block">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-purple-500/30 to-teal-500/20 blur-3xl animate-pulse" />
                <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-gray-900 to-black shadow-2xl shadow-purple-500/20">
                  {/* Abstract calendar visualization */}
                  <div className="aspect-[4/3] p-8">
                    <div className="h-full w-full rounded-xl border border-purple-500/20 bg-black/50 backdrop-blur-sm p-6">
                      {/* Calendar grid visual */}
                      <div className="grid grid-cols-7 gap-2 h-full">
                        {Array.from({ length: 28 }).map((_, i) => (
                          <div
                            key={i}
                            className={`rounded-lg transition-all ${
                              i % 7 === 0
                                ? "bg-purple-500/40 shadow-lg shadow-purple-500/50"
                                : i % 5 === 0
                                ? "bg-teal-500/30 shadow-lg shadow-teal-500/50"
                                : i % 3 === 0
                                ? "bg-blue-500/20"
                                : "bg-gray-800/50"
                            } ${i % 2 === 0 ? "animate-pulse" : ""}`}
                            style={{ animationDelay: `${i * 50}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-gray-800 pt-12 sm:mt-20">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent sm:text-4xl md:text-5xl">
                  10K+
                </div>
                <div className="mt-2 text-sm text-gray-400 sm:text-base">
                  Usuarios activos
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent sm:text-4xl md:text-5xl">
                  99.9%
                </div>
                <div className="mt-2 text-sm text-gray-400 sm:text-base">
                  Tiempo activo
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent sm:text-4xl md:text-5xl">
                  24/7
                </div>
                <div className="mt-2 text-sm text-gray-400 sm:text-base">
                  Soporte
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product showcase section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-black via-gray-950 to-black py-24 sm:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4C3DFF08_1px,transparent_1px),linear-gradient(to_bottom,#4C3DFF08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-7xl">
            {/* Main product visualization */}
            <div className="relative">
              <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-purple-600/20 to-teal-500/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-gray-900 to-black shadow-2xl shadow-purple-500/20">
                <div className="aspect-[16/9] p-12">
                  {/* Abstract dashboard visualization */}
                  <div className="h-full w-full rounded-2xl border border-purple-500/20 bg-black/50 backdrop-blur-sm p-8">
                    <div className="grid grid-cols-4 gap-4 h-full">
                      {/* Stat cards */}
                      <div className="col-span-1 space-y-4">
                        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 h-20" />
                        <div className="bg-teal-500/20 border border-teal-500/30 rounded-lg p-4 h-20" />
                        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 h-20" />
                      </div>
                      {/* Chart area */}
                      <div className="col-span-3 bg-gradient-to-br from-purple-500/10 to-teal-500/10 border border-purple-500/20 rounded-lg p-4 flex items-end gap-2">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-purple-500 to-teal-400 rounded-t opacity-70"
                            style={{ height: `${Math.random() * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary features grid */}
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                { icon: Calendar, color: "purple" },
                { icon: Users, color: "teal" },
                { icon: BarChart3, color: "blue" },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`group relative overflow-hidden rounded-2xl border border-${item.color}-500/30 bg-gradient-to-br from-gray-900 to-black transition-all hover:shadow-xl hover:shadow-${item.color}-500/20`}
                >
                  <div className="aspect-[4/3] p-6 flex items-center justify-center">
                    <div className={`rounded-2xl bg-${item.color}-500/20 border border-${item.color}-500/30 p-8 group-hover:scale-110 transition-transform`}>
                      <item.icon className={`h-16 w-16 text-${item.color}-400`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative bg-black py-24 sm:py-32">
        {/* Background decoration */}
        <div className="absolute right-0 top-1/4 h-[600px] w-[600px] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute left-0 bottom-1/4 h-[600px] w-[600px] rounded-full bg-teal-500/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4C3DFF08_1px,transparent_1px),linear-gradient(to_bottom,#4C3DFF08_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/50 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300 backdrop-blur-sm shadow-lg shadow-purple-500/20">
              <Sparkles className="h-4 w-4 animate-pulse" />
              Características poderosas
            </div>
            <h2 className="bg-gradient-to-br from-white via-purple-100 to-purple-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
              {t.landing.features.title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-300 md:text-xl">
              {t.landing.features.subtitle}
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-7xl gap-6 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black transition-all hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-teal-500/10 opacity-0 transition-opacity group-hover:opacity-100" />

                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                <div className="relative p-8">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg shadow-purple-500/50 transition-transform group-hover:scale-110 group-hover:shadow-purple-500/70">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-black via-gray-950 to-black py-24 sm:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#48A9A608_1px,transparent_1px),linear-gradient(to_bottom,#48A9A608_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/50 bg-teal-500/10 px-4 py-2 text-sm font-medium text-teal-300 backdrop-blur-sm shadow-lg shadow-teal-500/20">
              Proceso simple
            </div>
            <h2 className="bg-gradient-to-br from-white via-teal-100 to-teal-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
              Cómo funciona
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-300 md:text-xl">
              Comienza en minutos con nuestro proceso simple y guiado
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-6xl lg:mt-20">
            <div className="grid gap-12 md:gap-16">
              {[
                {
                  step: "01",
                  title: "Crea tu cuenta",
                  description: "Regístrate gratis en menos de 2 minutos. Sin tarjeta de crédito requerida.",
                },
                {
                  step: "02",
                  title: "Configura tu negocio",
                  description: "Personaliza servicios, horarios y equipo según tus necesidades.",
                },
                {
                  step: "03",
                  title: "Comienza a gestionar",
                  description: "Recibe reservas, gestiona clientes y haz crecer tu negocio.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="mb-4 inline-flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-teal-500 text-lg font-bold text-white shadow-lg shadow-purple-500/50">
                        {item.step}
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl">
                      {item.title}
                    </h3>
                    <p className="text-lg leading-relaxed text-gray-400">
                      {item.description}
                    </p>
                  </div>
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-gray-900 to-black shadow-xl shadow-purple-500/20">
                      <div className="aspect-[4/3] p-8 flex items-center justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-teal-500/20 blur-2xl" />
                          <div className="relative flex h-32 w-32 items-center justify-center rounded-2xl border border-purple-500/30 bg-black/50 backdrop-blur-sm">
                            <span className="text-5xl font-bold bg-gradient-to-br from-purple-400 to-teal-400 bg-clip-text text-transparent">
                              {item.step}
                            </span>
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
      <section className="relative overflow-hidden bg-black py-24 sm:py-32">
        {/* Background decoration */}
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-teal-500/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#48A9A608_1px,transparent_1px),linear-gradient(to_bottom,#48A9A608_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/50 bg-teal-500/10 px-4 py-2 text-sm font-medium text-teal-300 backdrop-blur-sm shadow-lg shadow-teal-500/20">
              <Sparkles className="h-4 w-4 animate-pulse" />
              Testimonios
            </div>
            <h2 className="bg-gradient-to-br from-white via-teal-100 to-teal-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
              {t.landing.testimonials.title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-300 md:text-xl">
              {t.landing.testimonials.subtitle}
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-7xl gap-6 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black transition-all hover:border-teal-500/50 hover:shadow-2xl hover:shadow-teal-500/20"
              >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                {/* Quote icon */}
                <div className="absolute right-6 top-6 opacity-10 transition-all group-hover:scale-110 group-hover:opacity-20">
                  <svg
                    className="h-12 w-12 text-teal-500"
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
                        className="h-5 w-5 fill-teal-400 text-teal-400"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="mb-6 text-base leading-relaxed text-gray-300">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-4 border-t border-gray-800 pt-6">
                    <div className="relative flex-shrink-0">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 opacity-75 blur-sm" />
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={56}
                        height={56}
                        className="relative h-14 w-14 rounded-full border-2 border-black"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-white">
                        {testimonial.name}
                      </p>
                      <p className="truncate text-sm text-gray-400">
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
      <section className="relative overflow-hidden bg-gradient-to-b from-black via-gray-950 to-black py-24 sm:py-32">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" />
          <div className="absolute right-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-teal-500/20 blur-[120px] animate-pulse [animation-delay:1s]" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4C3DFF08_1px,transparent_1px),linear-gradient(to_bottom,#4C3DFF08_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="container relative mx-auto px-4">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-900/50 via-gray-900 to-black shadow-2xl shadow-purple-500/20">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTYgMGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptLTE2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTE2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0xNiAwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTYgMTZjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTE2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTM2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bS0xNi0xNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

            {/* Glowing orbs */}
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal-500/30 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-purple-500/30 blur-3xl" />

            <div className="relative px-8 py-16 text-center text-white sm:px-12 sm:py-20 md:px-16 md:py-24">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>Comienza hoy</span>
              </div>

              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {t.landing.cta.title}
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 sm:text-xl md:text-2xl">
                {t.landing.cta.subtitle}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="group h-14 w-full gap-2 bg-white px-8 text-base font-semibold text-purple-600 shadow-2xl shadow-white/20 transition-all hover:scale-105 hover:bg-gray-100 hover:shadow-white/30 border-0"
                  >
                    {t.landing.cta.button}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-teal-400" />
                  <span>Sin tarjeta de crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-teal-400" />
                  <span>Prueba gratuita 14 días</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-teal-400" />
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
