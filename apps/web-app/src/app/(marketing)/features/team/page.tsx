"use client";

import { useTranslation } from "@/client/i18n";
import { Button } from "@/client/components/ui/button";
import { ScrollReveal } from "@/client/components/ui/scroll-reveal";
import {
  Shield,
  Users,
  TrendingUp,
  Smartphone,
  ArrowRight,
  Check,
  Image as ImageIcon,
} from "lucide-react";

export default function TeamPage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Shield,
      title: t.pages.features.categories.team.features.roles.title,
      description: t.pages.features.categories.team.features.roles.description,
      benefits: [
        "Customizable role-based access control",
        "Granular permission settings",
        "Secure data protection by role",
        "Admin, manager, and staff levels",
      ],
    },
    {
      icon: Users,
      title: t.pages.features.categories.team.features.scheduling.title,
      description:
        t.pages.features.categories.team.features.scheduling.description,
      benefits: [
        "Shared calendars and schedules",
        "Manage team availability",
        "Working hours configuration",
        "Real-time updates and notifications",
      ],
    },
    {
      icon: TrendingUp,
      title: t.pages.features.categories.team.features.performance.title,
      description:
        t.pages.features.categories.team.features.performance.description,
      benefits: [
        "Individual performance metrics",
        "Revenue tracking per team member",
        "Client satisfaction ratings",
        "Goal setting and achievement tracking",
      ],
    },
    {
      icon: Smartphone,
      title: t.pages.features.categories.team.features.mobile.title,
      description: t.pages.features.categories.team.features.mobile.description,
      benefits: [
        "Full mobile app for iOS and Android",
        "Access schedules on the go",
        "Clock in/out functionality",
        "Push notifications for updates",
      ],
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-green-500/5 to-background">
        <div className="container relative mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-4 py-2 text-sm font-medium text-green-600 backdrop-blur-sm dark:text-green-400">
                <Users className="h-4 w-4" />
                {t.pages.features.categories.team.title}
              </div>
              <h1 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
                {t.pages.features.categories.team.title}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                {t.pages.features.categories.team.description}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="space-y-16 md:space-y-20 lg:space-y-24">
            {features.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div
                  className={`grid items-center gap-8 md:gap-10 lg:gap-12 lg:grid-cols-2 ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}
                >
                  {/* Content */}
                  <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                    <div className="mb-6 inline-flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                      <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                    </div>
                    <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                      {feature.title}
                    </h2>
                    <p className="mb-6 text-base text-muted-foreground sm:text-lg">
                      {feature.description}
                    </p>
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="mt-1 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Image Placeholder */}
                  <div className={index % 2 === 1 ? "lg:col-start-1" : ""}>
                    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                      <div className="aspect-[4/3] bg-gradient-to-br from-green-500/10 via-background to-emerald-500/10 p-4 sm:p-6 md:p-8">
                        <div className="h-full w-full rounded-xl border-2 border-dashed border-green-500/20 bg-background/50 backdrop-blur-sm">
                          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                            <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">
                              {feature.title} Screenshot
                            </p>
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

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-green-500/5 to-background py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container relative mx-auto px-4">
          <ScrollReveal>
            <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-emerald-500 shadow-2xl sm:rounded-3xl">
              <div className="relative px-4 py-10 text-center text-white sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-12 lg:py-20">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
                  Ready to empower your team?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base opacity-95 sm:text-lg md:text-xl">
                  Start collaborating more efficiently today
                </p>
                <div className="mt-8">
                  <a
                    href={
                      process.env.NEXT_PUBLIC_WAITLIST_FORM_URL ||
                      `https://wa.me/${process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_NUMBER ?? ""}?text=${encodeURIComponent("Hola! Quiero más información sobre tuAgenda 📅")}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="lg"
                      variant="secondary"
                      className="group h-14 gap-2 bg-white px-8 text-base font-semibold text-green-600 shadow-2xl transition-all hover:scale-105 hover:bg-white"
                    >
                      Unirse a la lista de espera
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
