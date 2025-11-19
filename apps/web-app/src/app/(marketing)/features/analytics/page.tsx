"use client";

import { useTranslation } from "@/client/i18n";
import { Button } from "@/client/components/ui/button";
import { ScrollReveal } from "@/client/components/ui/scroll-reveal";
import Link from "next/link";
import {
  BarChart3,
  DollarSign,
  Users,
  FileDown,
  ArrowRight,
  Check,
  Image as ImageIcon,
} from "lucide-react";

export default function AnalyticsPage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: BarChart3,
      title: t.pages.features.categories.analytics.features.dashboard.title,
      description:
        t.pages.features.categories.analytics.features.dashboard.description,
      benefits: [
        "Comprehensive business insights dashboard",
        "Customizable report generation",
        "Visual charts and graphs",
        "Year-over-year comparisons",
      ],
    },
    {
      icon: DollarSign,
      title: t.pages.features.categories.analytics.features.revenue.title,
      description:
        t.pages.features.categories.analytics.features.revenue.description,
      benefits: [
        "Real-time revenue tracking",
        "Service profitability analysis",
        "Payment method breakdown",
        "Revenue forecasting tools",
      ],
    },
    {
      icon: Users,
      title: t.pages.features.categories.analytics.features.clients.title,
      description:
        t.pages.features.categories.analytics.features.clients.description,
      benefits: [
        "Client retention analysis",
        "Acquisition channel tracking",
        "Customer behavior insights",
        "Lifetime value calculations",
      ],
    },
    {
      icon: FileDown,
      title: t.pages.features.categories.analytics.features.export.title,
      description:
        t.pages.features.categories.analytics.features.export.description,
      benefits: [
        "Export to CSV, Excel, and PDF",
        "Scheduled automatic reports",
        "Custom data selection",
        "Integration with accounting software",
      ],
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-orange-500/5 to-background">
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-2 text-sm font-medium text-orange-600 backdrop-blur-sm dark:text-orange-400">
                <BarChart3 className="h-4 w-4" />
                {t.pages.features.categories.analytics.title}
              </div>
              <h1 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
                {t.pages.features.categories.analytics.title}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
                {t.pages.features.categories.analytics.description}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="space-y-24">
            {features.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div
                  className={`grid items-center gap-12 lg:grid-cols-2 ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}
                >
                  {/* Content */}
                  <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                      {feature.title}
                    </h2>
                    <p className="mb-6 text-lg text-muted-foreground">
                      {feature.description}
                    </p>
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="mt-1 h-5 w-5 shrink-0 text-orange-600 dark:text-orange-400" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Image Placeholder */}
                  <div className={index % 2 === 1 ? "lg:col-start-1" : ""}>
                    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                      <div className="aspect-[4/3] bg-gradient-to-br from-orange-500/10 via-background to-red-500/10 p-8">
                        <div className="h-full w-full rounded-xl border-2 border-dashed border-orange-500/20 bg-background/50 backdrop-blur-sm">
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
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-orange-500/5 to-background py-16 md:py-24">
        <div className="container relative mx-auto px-4">
          <ScrollReveal>
            <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 shadow-2xl sm:rounded-3xl">
              <div className="relative px-6 py-12 text-center text-white sm:px-8 sm:py-16 md:px-12 md:py-20">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Ready to unlock data-driven insights?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg opacity-95 md:text-xl">
                  Start making informed business decisions today
                </p>
                <div className="mt-8">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="group h-14 gap-2 bg-white px-8 text-base font-semibold text-orange-600 shadow-2xl transition-all hover:scale-105 hover:bg-white"
                    >
                      Start Free Trial
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
