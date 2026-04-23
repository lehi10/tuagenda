"use client";

import { Button } from "@/client/components/ui/button";
import { ScrollReveal } from "@/client/components/ui/scroll-reveal";
import { useTranslation } from "@/client/i18n";
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
  Shield,
  Zap,
  TrendingUp,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef, useState, useCallback } from "react";

export default function Home() {
  const { t } = useTranslation();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const professionals = [
    {
      key: "nutricionista",
      image: "/images/landing/nutricionista.png",
      ...t.landing.usedBy.professionals.nutricionista,
    },
    {
      key: "psicologa",
      image: "/images/landing/psicologa.png",
      ...t.landing.usedBy.professionals.psicologa,
    },
    {
      key: "psicologo",
      image: "/images/landing/psicologo.png",
      ...t.landing.usedBy.professionals.psicologo,
    },
    {
      key: "englishTeacher",
      image: "/images/landing/english teacher.png",
      ...t.landing.usedBy.professionals.englishTeacher,
    },
    {
      key: "violinTeacher",
      image: "/images/landing/maestra de violin.png",
      ...t.landing.usedBy.professionals.violinTeacher,
    },
  ];

  const scrollToIndex = useCallback((index: number) => {
    const container = carouselRef.current;
    if (!container) return;
    const card = container.children[index] as HTMLElement;
    if (!card) return;
    container.scrollTo({
      left: card.offsetLeft - container.offsetLeft,
      behavior: "smooth",
    });
    setActiveIndex(index);
  }, []);

  const handleScroll = useCallback(() => {
    const container = carouselRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const cardWidth = (container.children[0] as HTMLElement)?.offsetWidth ?? 1;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(index, professionals.length - 1));
  }, [professionals.length]);

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
          <div className="absolute -left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl" />
          <div
            className="absolute -right-1/4 top-1/3 h-96 w-96 animate-pulse rounded-full bg-secondary/10 blur-3xl"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM0QzNERkYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTYgMGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptLTE2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTE2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0xNiAwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTYgMTZjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTE2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTM2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bS0xNi0xNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        </div>

        <div className="container relative mx-auto px-4 py-10 sm:py-14 md:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16">
              {/* Left column - Content */}
              <div className="text-center lg:text-left">
                <h1 className="bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                  {t.landing.hero.title}
                </h1>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg md:text-xl">
                  {t.landing.hero.subtitle}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4 lg:justify-start">
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="group h-12 w-full gap-2 px-6 text-sm font-semibold shadow-xl shadow-primary/25 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 sm:h-14 sm:px-8 sm:text-base"
                    >
                      {t.landing.hero.cta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 w-full border-2 px-6 text-sm font-semibold backdrop-blur-sm transition-all hover:scale-105 hover:border-primary/50 hover:bg-primary/5 sm:h-14 sm:px-8 sm:text-base"
                    >
                      {t.auth.login}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right column - Hero image */}
              <div className="relative hidden lg:block">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl" />
                <div className="relative overflow-hidden rounded-2xl border border-border shadow-2xl">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src="/images/landing/banner1.png"
                      fill
                      className="object-cover"
                      alt="TuAgenda dashboard"
                      sizes="50vw"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professionals / Who uses TuAgenda Section */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-muted/20" />
        <div className="absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-3xl" />

        <div className="container relative mx-auto px-4">
          {/* Header */}
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary backdrop-blur-sm sm:mb-4 sm:px-4 sm:py-2 sm:text-sm">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                {t.landing.usedBy.badge}
              </div>
              <h2 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
                {t.landing.usedBy.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg md:text-xl">
                {t.landing.usedBy.subtitle}
              </p>
            </div>
          </ScrollReveal>

          {/* Carousel */}
          <ScrollReveal>
            <div className="relative mt-10 sm:mt-12 lg:mt-16">
              {/* Prev button */}
              <button
                onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/90 shadow-lg backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-background hover:shadow-xl disabled:pointer-events-none disabled:opacity-30 sm:-left-5 sm:h-12 sm:w-12"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>

              {/* Next button */}
              <button
                onClick={() =>
                  scrollToIndex(
                    Math.min(professionals.length - 1, activeIndex + 1)
                  )
                }
                disabled={activeIndex === professionals.length - 1}
                className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/90 shadow-lg backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-background hover:shadow-xl disabled:pointer-events-none disabled:opacity-30 sm:-right-5 sm:h-12 sm:w-12"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-5 w-5 text-foreground" />
              </button>

              {/* Carousel track */}
              <div
                ref={carouselRef}
                onScroll={handleScroll}
                className="flex gap-4 overflow-x-auto scroll-smooth pb-4 lg:gap-6"
                style={{
                  scrollSnapType: "x mandatory",
                  scrollbarWidth: "none",
                }}
              >
                {professionals.map((pro) => (
                  <div
                    key={pro.key}
                    className="group relative w-[80vw] flex-shrink-0 cursor-default overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 sm:w-[45vw] lg:w-[30vw] xl:w-[22vw]"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      <Image
                        src={pro.image}
                        alt={pro.name}
                        fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 30vw"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                      {/* Shine on hover */}
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      {/* Content */}
                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                        <h3 className="text-xl font-bold leading-tight text-white sm:text-2xl">
                          {pro.name}
                        </h3>
                        <p className="mt-2 text-sm leading-snug text-white/80 sm:text-base">
                          {pro.tagline}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dot indicators */}
              <div className="mt-6 flex justify-center gap-2">
                {professionals.map((pro, index) => (
                  <button
                    key={pro.key}
                    onClick={() => scrollToIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-border hover:bg-primary/40"
                    }`}
                    aria-label={`Ir a ${pro.name}`}
                  />
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Bottom CTA */}
          <ScrollReveal>
            <div className="mt-12 flex flex-col items-center gap-5 text-center sm:mt-16">
              <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
                {t.landing.usedBy.ctaText}
              </p>
              <Link href="/signup">
                <Button
                  size="lg"
                  className="group h-12 gap-2 px-6 text-sm font-semibold shadow-xl shadow-primary/25 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 sm:h-14 sm:px-8 sm:text-base"
                >
                  {t.landing.usedBy.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Why Choose Us Section - NEW */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary backdrop-blur-sm sm:mb-4 sm:px-4 sm:py-2 sm:text-sm">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                {t.landing.features.whyChooseUs.badge}
              </div>
              <h2 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl">
                {t.landing.features.whyChooseUs.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg md:text-xl">
                {t.landing.features.whyChooseUs.description}
              </p>
            </div>
          </ScrollReveal>

          <div className="mx-auto mt-12 grid max-w-6xl gap-6 sm:mt-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {[
              {
                icon: Zap,
                title: t.landing.features.quickFeatures.fast,
                description: t.landing.features.quickFeatures.fastDescription,
                color: "text-yellow-500",
              },
              {
                icon: Shield,
                title: t.landing.features.quickFeatures.secure,
                description: t.landing.features.quickFeatures.secureDescription,
                color: "text-blue-500",
              },
              {
                icon: TrendingUp,
                title: t.landing.features.quickFeatures.grow,
                description: t.landing.features.quickFeatures.growDescription,
                color: "text-green-500",
              },
              {
                icon: Clock,
                title: t.landing.features.quickFeatures.saveTime,
                description:
                  t.landing.features.quickFeatures.saveTimeDescription,
                color: "text-purple-500",
              },
            ].map((item, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <div
                      className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 transition-transform group-hover:scale-110 ${item.color}`}
                    >
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative bg-gradient-to-b from-background via-background to-muted/30 py-16 sm:py-20 md:py-24 lg:py-32"
      >
        {/* Background decoration */}
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute left-0 bottom-1/4 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />

        <div className="container relative mx-auto px-4">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary backdrop-blur-sm sm:mb-4 sm:px-4 sm:py-2 sm:text-sm">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                {t.landing.features.powerfullBadge}
              </div>
              <h2 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
                {t.landing.features.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg md:text-xl">
                {t.landing.features.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="mx-auto mt-10 grid max-w-7xl gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
            {features.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 50}>
                <div className="group relative h-full overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 sm:rounded-2xl">
                  {/* Gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 transition-opacity group-hover:opacity-100" />

                  {/* Shine effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                  <div className="relative p-5 sm:p-6 lg:p-8">
                    {/* Icon */}
                    <div className="mb-4 sm:mb-6">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 transition-transform group-hover:scale-110 sm:h-14 sm:w-14 sm:rounded-xl lg:h-16 lg:w-16">
                        <feature.icon className="h-6 w-6 text-primary-foreground sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
                      </div>
                    </div>

                    <h3 className="mb-2 text-lg font-bold sm:mb-3 sm:text-xl">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works section - NEW */}
      <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-3 py-1.5 text-xs font-medium text-secondary backdrop-blur-sm sm:mb-4 sm:px-4 sm:py-2 sm:text-sm">
                {t.landing.howItWorks.badge}
              </div>
              <h2 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
                {t.landing.howItWorks.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg md:text-xl">
                {t.landing.howItWorks.description}
              </p>
            </div>
          </ScrollReveal>

          <div className="mx-auto mt-10 max-w-6xl sm:mt-12 lg:mt-16">
            <div className="grid gap-8 sm:gap-12 md:gap-16">
              {[
                {
                  step: "01",
                  title: t.landing.howItWorks.steps.createAccount.title,
                  description:
                    t.landing.howItWorks.steps.createAccount.description,
                  image: "/images/landing/banner1.png",
                },
                {
                  step: "02",
                  title: t.landing.howItWorks.steps.setupBusiness.title,
                  description:
                    t.landing.howItWorks.steps.setupBusiness.description,
                  image: "/images/landing/banner3.png",
                },
                {
                  step: "03",
                  title: t.landing.howItWorks.steps.startManaging.title,
                  description:
                    t.landing.howItWorks.steps.startManaging.description,
                  image: "/images/landing/banner2.png",
                },
              ].map((item, index) => (
                <ScrollReveal key={index} delay={index * 150}>
                  <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
                    <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                      <div className="mb-3 inline-flex items-center gap-2 sm:mb-4 sm:gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-base font-bold text-white sm:h-12 sm:w-12 sm:text-lg">
                          {item.step}
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
                      </div>
                      <h3 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl md:text-3xl">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
                        {item.description}
                      </p>
                    </div>
                    <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                      <div className="relative overflow-hidden rounded-xl bg-card shadow-xl transition-all hover:shadow-2xl sm:rounded-2xl">
                        <div className="from-primary/5 via-background to-secondary/5">
                          <Image
                            src={item.image}
                            width={400}
                            height={400}
                            className="h-full w-full  object-cover"
                            alt={"Hero image"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 via-muted/10 to-background py-16 sm:py-20 md:py-24 lg:py-32">
        {/* Background decoration */}
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

        <div className="container relative mx-auto px-4">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-3 py-1.5 text-xs font-medium text-secondary backdrop-blur-sm sm:mb-4 sm:px-4 sm:py-2 sm:text-sm">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                {t.landing.testimonials.badge}
              </div>
              <h2 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
                {t.landing.testimonials.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg md:text-xl">
                {t.landing.testimonials.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="mx-auto mt-10 grid max-w-7xl gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="group relative h-full overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-secondary/30 hover:shadow-2xl hover:shadow-secondary/5 sm:rounded-2xl">
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  {/* Quote icon */}
                  <div className="absolute right-4 top-4 opacity-10 transition-all group-hover:scale-110 group-hover:opacity-20 sm:right-6 sm:top-6">
                    <svg
                      className="h-8 w-8 text-secondary sm:h-10 sm:w-10 lg:h-12 lg:w-12"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  <div className="relative p-5 sm:p-6 lg:p-8">
                    <div className="mb-4 flex items-center gap-0.5 sm:mb-6 sm:gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-4 w-4 fill-secondary text-secondary sm:h-5 sm:w-5"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    <p className="mb-4 text-sm leading-relaxed text-foreground sm:mb-6 sm:text-base">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    <div className="flex items-center gap-3 border-t border-border pt-4 sm:gap-4 sm:pt-6">
                      <div className="relative flex-shrink-0">
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary to-secondary opacity-75 blur-sm" />
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={56}
                          height={56}
                          className="relative h-12 w-12 rounded-full border-2 border-background sm:h-14 sm:w-14"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground sm:text-base">
                          {testimonial.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground sm:text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-32">
        {/* Animated background */}
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
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/90 shadow-2xl sm:rounded-3xl">
              {/* Background pattern */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTYgMGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptLTE2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTE2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0xNiAwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTYgMTZjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTE2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTM2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bS0xNi0xNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />

              {/* Glowing orbs */}
              <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-secondary opacity-30 blur-3xl" />
              <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white opacity-10 blur-3xl" />

              <div className="relative px-6 py-12 text-center text-primary-foreground sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-16 lg:py-24">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium backdrop-blur-sm sm:mb-6 sm:px-4 sm:py-2 sm:text-sm">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{t.landing.cta.badge}</span>
                </div>

                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  {t.landing.cta.title}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base opacity-95 sm:mt-6 sm:text-lg md:text-xl lg:text-2xl">
                  {t.landing.cta.subtitle}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center sm:gap-4 md:mt-10">
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="group h-12 w-full gap-2 bg-white px-6 text-sm font-semibold text-primary shadow-2xl transition-all hover:scale-105 hover:bg-white hover:shadow-2xl sm:h-14 sm:px-8 sm:text-base"
                    >
                      {t.landing.cta.button}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                    </Button>
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs opacity-90 sm:mt-8 sm:gap-6 sm:text-sm md:mt-10">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Check className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                    <span>{t.landing.cta.trustIndicators.noCard}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Check className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                    <span>{t.landing.cta.trustIndicators.freeTrial}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Check className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                    <span>{t.landing.cta.trustIndicators.cancelAnytime}</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
