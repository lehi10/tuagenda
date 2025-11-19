"use client";

import { useState } from "react";
import { useTranslation } from "@/client/i18n";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Textarea } from "@/client/components/ui/textarea";
import { ScrollReveal } from "@/client/components/ui/scroll-reveal";
import {
  Mail,
  Phone,
  MessageCircle,
  Send,
  ChevronDown,
  ChevronUp,
  HeadphonesIcon,
  Clock,
} from "lucide-react";

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const channels = [
    {
      icon: Mail,
      title: t.pages.contact.channels.email.title,
      value: t.pages.contact.channels.email.value,
      description: t.pages.contact.channels.email.description,
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Phone,
      title: t.pages.contact.channels.phone.title,
      value: t.pages.contact.channels.phone.value,
      description: t.pages.contact.channels.phone.description,
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: MessageCircle,
      title: t.pages.contact.channels.chat.title,
      value: t.pages.contact.channels.chat.value,
      description: t.pages.contact.channels.chat.description,
      color: "from-purple-500 to-pink-500",
    },
  ];

  const faqs = [
    {
      question: t.pages.contact.faq.questions.trial.question,
      answer: t.pages.contact.faq.questions.trial.answer,
    },
    {
      question: t.pages.contact.faq.questions.setup.question,
      answer: t.pages.contact.faq.questions.setup.answer,
    },
    {
      question: t.pages.contact.faq.questions.support.question,
      answer: t.pages.contact.faq.questions.support.answer,
    },
    {
      question: t.pages.contact.faq.questions.data.question,
      answer: t.pages.contact.faq.questions.data.answer,
    },
    {
      question: t.pages.contact.faq.questions.migration.question,
      answer: t.pages.contact.faq.questions.migration.answer,
    },
    {
      question: t.pages.contact.faq.questions.pricing.question,
      answer: t.pages.contact.faq.questions.pricing.answer,
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
                <HeadphonesIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                {t.pages.contact.badge}
              </div>
              <h1 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
                {t.pages.contact.title}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                {t.pages.contact.subtitle}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Form & Channels */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-8 md:gap-10 lg:grid-cols-2 lg:gap-12">
            {/* Contact Form */}
            <ScrollReveal>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
                <h2 className="mb-2 text-2xl font-bold">
                  {t.pages.contact.form.title}
                </h2>
                <p className="mb-6 text-muted-foreground">
                  {t.pages.contact.form.description}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium"
                    >
                      {t.pages.contact.form.name}
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={t.pages.contact.form.namePlaceholder}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="h-12 sm:h-14"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium"
                    >
                      {t.pages.contact.form.email}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t.pages.contact.form.emailPlaceholder}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="h-12 sm:h-14"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-medium"
                    >
                      {t.pages.contact.form.subject}
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder={t.pages.contact.form.subjectPlaceholder}
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      required
                      className="h-12 sm:h-14"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium"
                    >
                      {t.pages.contact.form.message}
                    </label>
                    <Textarea
                      id="message"
                      placeholder={t.pages.contact.form.messagePlaceholder}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      rows={5}
                      className="resize-none min-h-[120px] sm:min-h-[140px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full gap-2 h-12 sm:h-14"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        {t.pages.contact.form.sending}
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        {t.pages.contact.form.send}
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </ScrollReveal>

            {/* Contact Channels & Hours */}
            <div className="space-y-8">
              {/* Channels */}
              <ScrollReveal delay={200}>
                <div>
                  <h2 className="mb-6 text-2xl font-bold">
                    {t.pages.contact.channels.title}
                  </h2>
                  <div className="space-y-4">
                    {channels.map((channel, index) => (
                      <div
                        key={index}
                        className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg sm:p-8"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="relative flex items-start gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br sm:h-14 sm:w-14 ${channel.color} shadow-md`}
                          >
                            <channel.icon className="h-6 w-6 text-white sm:h-7 sm:w-7" />
                          </div>
                          <div className="flex-1">
                            <h3 className="mb-1 font-semibold">
                              {channel.title}
                            </h3>
                            <p className="mb-1 text-sm font-medium text-primary">
                              {channel.value}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {channel.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Business Hours */}
              <ScrollReveal delay={300}>
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-md sm:h-14 sm:w-14">
                      <Clock className="h-6 w-6 text-white sm:h-7 sm:w-7" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {t.pages.contact.hours.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {t.pages.contact.hours.timezone}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t.pages.contact.hours.schedule.weekdays}
                      </span>
                      <span className="font-medium">
                        {t.pages.contact.hours.schedule.weekdaysHours}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t.pages.contact.hours.schedule.saturday}
                      </span>
                      <span className="font-medium">
                        {t.pages.contact.hours.schedule.saturdayHours}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t.pages.contact.hours.schedule.sunday}
                      </span>
                      <span className="font-medium text-muted-foreground">
                        {t.pages.contact.hours.schedule.sundayHours}
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/30 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                {t.pages.contact.faq.title}
              </h2>
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                {t.pages.contact.faq.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, index) => (
              <ScrollReveal key={index} delay={index * 50}>
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/20 sm:p-6 min-h-[56px]"
                  >
                    <span className="pr-8 font-semibold">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-5 w-5 shrink-0 text-primary" />
                    ) : (
                      <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="border-t border-border bg-muted/10 px-4 py-4 sm:px-6">
                      <p className="leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
