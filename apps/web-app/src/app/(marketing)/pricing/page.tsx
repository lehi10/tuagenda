"use client";

import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const { t } = useTranslation();

  const plans = [
    {
      name: t.pages.pricing.free.name,
      price: t.pages.pricing.free.price,
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
      price: t.pages.pricing.pro.price,
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
      price: t.pages.pricing.enterprise.price,
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

  return (
    <>
      {/* Hero Section */}
      <section className="border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {t.pages.pricing.title}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              {t.pages.pricing.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl border p-8 shadow-sm ${
                  plan.highlighted
                    ? "border-primary shadow-lg ring-2 ring-primary/20"
                    : "border-border"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-block rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
                      Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  <div className="mt-6">
                    <span className="text-5xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">
                      {t.pages.pricing.perMonth}
                    </span>
                  </div>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href} className="mt-8 block">
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
