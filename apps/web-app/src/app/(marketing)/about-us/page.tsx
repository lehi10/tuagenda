"use client";

import { useTranslation } from "@/i18n";
import { CheckCircle2 } from "lucide-react";

export default function AboutUsPage() {
  const { t } = useTranslation();

  const values = [
    {
      title: t.pages.aboutUs.values.value1.title,
      description: t.pages.aboutUs.values.value1.description,
    },
    {
      title: t.pages.aboutUs.values.value2.title,
      description: t.pages.aboutUs.values.value2.description,
    },
    {
      title: t.pages.aboutUs.values.value3.title,
      description: t.pages.aboutUs.values.value3.description,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {t.pages.aboutUs.title}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              {t.pages.aboutUs.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight">
              {t.pages.aboutUs.mission.title}
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              {t.pages.aboutUs.mission.description}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight">
              {t.pages.aboutUs.story.title}
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              {t.pages.aboutUs.story.description}
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-3xl font-bold tracking-tight">
              {t.pages.aboutUs.values.title}
            </h2>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
