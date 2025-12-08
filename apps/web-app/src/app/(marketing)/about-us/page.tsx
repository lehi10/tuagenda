"use client";

import { useTranslation } from "@/client/i18n";
import { ScrollReveal } from "@/client/components/ui/scroll-reveal";
import {
  Target,
  Users,
  Heart,
  Sparkles,
  TrendingUp,
  Award,
  Globe,
  Image as ImageIcon,
} from "lucide-react";

export default function AboutUsPage() {
  const { t } = useTranslation();

  const values = [
    {
      title: t.pages.aboutUs.values.value1.title,
      description: t.pages.aboutUs.values.value1.description,
      icon: Target,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: t.pages.aboutUs.values.value2.title,
      description: t.pages.aboutUs.values.value2.description,
      icon: Heart,
      color: "from-pink-500 to-rose-500",
    },
    {
      title: t.pages.aboutUs.values.value3.title,
      description: t.pages.aboutUs.values.value3.description,
      icon: Sparkles,
      color: "from-purple-500 to-indigo-500",
    },
  ];

  const timeline = [
    {
      year: "2020",
      title: "Company Founded",
      description:
        "TuAgenda was born with a mission to simplify appointment scheduling for businesses worldwide.",
    },
    {
      year: "2021",
      title: "First 1,000 Users",
      description:
        "Reached our first milestone and expanded to serve multiple industries.",
    },
    {
      year: "2022",
      title: "Global Expansion",
      description:
        "Launched in 10+ countries and added multi-language support.",
    },
    {
      year: "2023",
      title: "10,000+ Businesses",
      description:
        "Became the trusted choice for thousands of businesses across the globe.",
    },
    {
      year: "2024",
      title: "Innovation Continues",
      description: "Launched AI-powered features and advanced integrations.",
    },
  ];

  const stats = [
    {
      icon: Users,
      number: "10,000+",
      label: "Active Businesses",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Globe,
      number: "50+",
      label: "Countries",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: TrendingUp,
      number: "1M+",
      label: "Appointments Booked",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Award,
      number: "99.9%",
      label: "Uptime",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const teamPlaceholders = [
    { role: "CEO & Founder", name: "Team Member 1" },
    { role: "CTO", name: "Team Member 2" },
    { role: "Head of Product", name: "Team Member 3" },
    { role: "Head of Design", name: "Team Member 4" },
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
                <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                Our Story
              </div>
              <h1 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
                {t.pages.aboutUs.title}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                {t.pages.aboutUs.subtitle}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-lg sm:p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <div
                      className={`mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br sm:h-14 sm:w-14 md:h-16 md:w-16 ${stat.color} shadow-lg transition-transform group-hover:scale-110`}
                    >
                      <stat.icon className="h-6 w-6 text-white sm:h-7 sm:w-7 md:h-8 md:w-8" />
                    </div>
                    <div className="text-2xl font-bold sm:text-3xl md:text-4xl">
                      {stat.number}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-muted/30 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl items-center gap-8 md:gap-10 lg:gap-12 lg:grid-cols-2">
            <ScrollReveal>
              <div>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg sm:h-14 sm:w-14 md:h-16 md:w-16">
                  <Target className="h-6 w-6 text-white sm:h-7 sm:w-7 md:h-8 md:w-8" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                  {t.pages.aboutUs.mission.title}
                </h2>
                <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {t.pages.aboutUs.mission.description}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                <div className="aspect-[4/3] bg-gradient-to-br from-muted via-background to-muted/50 p-8">
                  <div className="h-full w-full rounded-xl border-2 border-dashed border-border bg-background/50 backdrop-blur-sm">
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        Mission Image Placeholder
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                {t.pages.aboutUs.story.title}
              </h2>
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                {t.pages.aboutUs.story.description}
              </p>
            </div>
          </ScrollReveal>

          <div className="mx-auto max-w-4xl">
            {timeline.map((item, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="relative pl-8 pb-12 last:pb-0">
                  {/* Timeline line */}
                  {index !== timeline.length - 1 && (
                    <div className="absolute left-[15px] top-[40px] h-full w-0.5 bg-border" />
                  )}

                  {/* Timeline dot */}
                  <div className="absolute left-0 top-2 h-8 w-8 rounded-full border-4 border-background bg-gradient-to-br from-primary to-secondary shadow-lg" />

                  <div className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg">
                    <div className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                      {item.year}
                    </div>
                    <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted/30 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                {t.pages.aboutUs.values.title}
              </h2>
            </div>
          </ScrollReveal>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {values.map((value, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-xl sm:p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <div
                      className={`mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br sm:h-14 sm:w-14 md:h-16 md:w-16 ${value.color} shadow-lg transition-transform group-hover:scale-110`}
                    >
                      <value.icon className="h-6 w-6 text-white sm:h-7 sm:w-7 md:h-8 md:w-8" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold">{value.title}</h3>
                    <p className="leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Meet Our Team
              </h2>
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                The people behind TuAgenda
              </p>
            </div>
          </ScrollReveal>

          <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamPlaceholders.map((member, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg">
                  {/* Photo placeholder */}
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-muted-foreground/50 transition-transform group-hover:scale-110" />
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
