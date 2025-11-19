"use client";

import React, { useState } from "react";
import { useTranslation } from "@/client/i18n";
import { Button } from "@/client/components/ui/button";
import { ScrollReveal } from "@/client/components/ui/scroll-reveal";
import { Check, Sparkles, X } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const { t } = useTranslation();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: t.pages.pricing.free.name,
      monthlyPrice: t.pages.pricing.free.price,
      annualPrice: t.pages.pricing.free.price,
      description: t.pages.pricing.free.description,
      features: [
        t.pages.pricing.free.feature1,
        t.pages.pricing.free.feature2,
        t.pages.pricing.free.feature3,
        t.pages.pricing.free.feature4,
      ],
      cta: t.pages.pricing.getStarted,
      href: "/signup",
      highlighted: false,
    },
    {
      name: t.pages.pricing.pro.name,
      monthlyPrice: t.pages.pricing.pro.price,
      annualPrice: "23",
      description: t.pages.pricing.pro.description,
      features: [
        t.pages.pricing.pro.feature1,
        t.pages.pricing.pro.feature2,
        t.pages.pricing.pro.feature3,
        t.pages.pricing.pro.feature4,
        t.pages.pricing.pro.feature5,
        t.pages.pricing.pro.feature6,
      ],
      cta: t.pages.pricing.getStarted,
      href: "/signup",
      highlighted: true,
    },
    {
      name: t.pages.pricing.enterprise.name,
      monthlyPrice: t.pages.pricing.enterprise.price,
      annualPrice: "79",
      description: t.pages.pricing.enterprise.description,
      features: [
        t.pages.pricing.enterprise.feature1,
        t.pages.pricing.enterprise.feature2,
        t.pages.pricing.enterprise.feature3,
        t.pages.pricing.enterprise.feature4,
        t.pages.pricing.enterprise.feature5,
        t.pages.pricing.enterprise.feature6,
      ],
      cta: t.pages.pricing.getStarted,
      href: "/signup",
      highlighted: false,
    },
  ];

  const comparisonFeatures = [
    {
      category: t.pages.pricing.comparison.categories.coreFeatures,
      items: [
        {
          name: t.pages.pricing.comparison.features.appointments,
          free: `50${t.pages.pricing.comparison.perMonth}`,
          pro: t.pages.pricing.comparison.unlimited,
          enterprise: t.pages.pricing.comparison.unlimited,
        },
        {
          name: t.pages.pricing.comparison.features.locations,
          free: "1",
          pro: "3",
          enterprise: t.pages.pricing.comparison.unlimited,
        },
        {
          name: t.pages.pricing.comparison.features.staffMembers,
          free: "1",
          pro: "5",
          enterprise: t.pages.pricing.comparison.unlimited,
        },
        {
          name: t.pages.pricing.comparison.features.clientDatabase,
          free: true,
          pro: true,
          enterprise: true,
        },
        {
          name: t.pages.pricing.comparison.features.calendarSync,
          free: false,
          pro: true,
          enterprise: true,
        },
      ],
    },
    {
      category: t.pages.pricing.comparison.categories.advancedFeatures,
      items: [
        {
          name: t.pages.pricing.comparison.features.customBranding,
          free: false,
          pro: true,
          enterprise: true,
        },
        {
          name: t.pages.pricing.comparison.features.integrations,
          free: false,
          pro: true,
          enterprise: true,
        },
        {
          name: t.pages.pricing.comparison.features.apiAccess,
          free: false,
          pro: false,
          enterprise: true,
        },
        {
          name: t.pages.pricing.comparison.features.advancedAnalytics,
          free: false,
          pro: true,
          enterprise: true,
        },
        {
          name: t.pages.pricing.comparison.features.customDevelopment,
          free: false,
          pro: false,
          enterprise: true,
        },
      ],
    },
    {
      category: t.pages.pricing.comparison.categories.support,
      items: [
        {
          name: t.pages.pricing.comparison.features.emailSupport,
          free: true,
          pro: true,
          enterprise: true,
        },
        {
          name: t.pages.pricing.comparison.features.prioritySupport,
          free: false,
          pro: true,
          enterprise: true,
        },
        {
          name: t.pages.pricing.comparison.features.phoneSupport,
          free: false,
          pro: false,
          enterprise: true,
        },
        {
          name: t.pages.pricing.comparison.features.dedicatedManager,
          free: false,
          pro: false,
          enterprise: true,
        },
      ],
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
                Simple, transparent pricing
              </div>
              <h1 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
                {t.pages.pricing.title}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg md:text-xl">
                {t.pages.pricing.subtitle}
              </p>

              {/* Billing Toggle */}
              <div className="mt-6 inline-flex w-full max-w-sm items-center gap-2 rounded-full border border-border bg-card p-1 shadow-sm sm:mt-8 sm:w-auto sm:gap-3">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`flex-1 rounded-full px-4 py-2 text-xs font-medium transition-all sm:flex-none sm:px-6 sm:text-sm ${
                    !isAnnual
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.pages.pricing.monthly}
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all sm:flex-none sm:gap-2 sm:px-6 sm:text-sm ${
                    isAnnual
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.pages.pricing.annual}
                  <span className="rounded-full bg-green-500 px-1.5 py-0.5 text-[10px] font-semibold text-white sm:px-2 sm:text-xs">
                    {t.pages.pricing.save20}
                  </span>
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-6 sm:gap-8 lg:grid-cols-3 mt-8 sm:mt-10 lg:mt-12">
            {plans.map((plan, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="relative">
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-lg">
                        <Sparkles className="h-3 w-3" />
                        Popular
                      </span>
                    </div>
                  )}

                  <div
                    className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 transition-all ${
                      plan.highlighted
                        ? "border-primary shadow-2xl ring-2 ring-primary/20 hover:shadow-2xl"
                        : "border-border shadow-sm hover:border-primary/30 hover:shadow-lg"
                    }`}
                  >
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity hover:opacity-100" />

                    <div className="relative text-center">
                      <h3 className="text-xl font-bold sm:text-2xl">
                        {plan.name}
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                        {plan.description}
                      </p>
                      <div className="mt-4 sm:mt-6">
                        <span className="text-4xl font-bold sm:text-5xl">
                          ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                        </span>
                        <span className="text-sm text-muted-foreground sm:text-base">
                          {t.pages.pricing.perMonth}
                        </span>
                      </div>
                      {isAnnual && plan.monthlyPrice !== plan.annualPrice && (
                        <p className="mt-2 text-sm text-green-600">
                          Save $
                          {(parseFloat(plan.monthlyPrice) -
                            parseFloat(plan.annualPrice)) *
                            12}
                          /year
                        </p>
                      )}
                    </div>

                    <ul className="relative mt-8 space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          <Check className="h-5 w-5 shrink-0 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={plan.href} className="relative mt-8 block">
                      <Button
                        className="w-full shadow-lg transition-all hover:scale-105"
                        variant={plan.highlighted ? "default" : "outline"}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="bg-muted/30 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mb-8 text-center sm:mb-10 md:mb-12">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                {t.pages.pricing.comparison.title}
              </h2>
              <p className="mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg">
                {t.pages.pricing.comparison.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="mx-auto max-w-6xl overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-3 text-left text-xs font-semibold sm:p-4 sm:text-sm">
                      Features
                    </th>
                    <th className="p-3 text-center text-xs font-semibold sm:p-4 sm:text-sm">
                      Free
                    </th>
                    <th className="p-3 text-center text-xs font-semibold sm:p-4 sm:text-sm">
                      Pro
                    </th>
                    <th className="p-3 text-center text-xs font-semibold sm:p-4 sm:text-sm">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((category, categoryIndex) => (
                    <React.Fragment key={categoryIndex}>
                      <tr className="border-b border-border bg-muted/20">
                        <td
                          colSpan={4}
                          className="p-3 text-xs font-semibold text-primary sm:p-4 sm:text-sm"
                        >
                          {category.category}
                        </td>
                      </tr>
                      {category.items.map((item, itemIndex) => (
                        <tr
                          key={`${categoryIndex}-${itemIndex}`}
                          className="border-b border-border transition-colors hover:bg-muted/10"
                        >
                          <td className="p-3 text-xs sm:p-4 sm:text-sm">
                            {item.name}
                          </td>
                          <td className="p-3 text-center text-xs sm:p-4 sm:text-sm">
                            {typeof item.free === "boolean" ? (
                              item.free ? (
                                <Check className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                              ) : (
                                <X className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                              )
                            ) : (
                              item.free
                            )}
                          </td>
                          <td className="p-3 text-center text-xs sm:p-4 sm:text-sm">
                            {typeof item.pro === "boolean" ? (
                              item.pro ? (
                                <Check className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                              ) : (
                                <X className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                              )
                            ) : (
                              item.pro
                            )}
                          </td>
                          <td className="p-3 text-center text-xs sm:p-4 sm:text-sm">
                            {typeof item.enterprise === "boolean" ? (
                              item.enterprise ? (
                                <Check className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                              ) : (
                                <X className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                              )
                            ) : (
                              item.enterprise
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
