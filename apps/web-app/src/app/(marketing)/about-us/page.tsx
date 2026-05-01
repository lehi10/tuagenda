import { ScrollReveal } from "@/client/components/ui/scroll-reveal";
import { Target, Heart, Sparkles, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/client/components/shared";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_NUMBER ?? "";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola! Quiero más información sobre tuAgenda 📅")}`;

const values = [
  {
    icon: Target,
    color: "from-blue-500 to-cyan-500",
    title: "Simplicidad ante todo",
    description:
      "Diseñamos cada función para que cualquier profesional pueda usarla sin complicaciones, sin manuales y sin conocimientos técnicos.",
  },
  {
    icon: Heart,
    color: "from-pink-500 to-rose-500",
    title: "Cercanos y accesibles",
    description:
      "Creemos en el trato humano. Cada negocio que usa tuAgenda cuenta con nuestro acompañamiento directo, no con respuestas automáticas.",
  },
  {
    icon: Sparkles,
    color: "from-purple-500 to-indigo-500",
    title: "Pensado para LATAM",
    description:
      "Construido desde Lima para profesionales latinoamericanos, con las herramientas que realmente se usan en la región: WhatsApp, pagos locales y más.",
  },
];

const differentiators = [
  {
    emoji: "📱",
    title: "Notificaciones por WhatsApp",
    description:
      "Tus clientes reciben recordatorios donde ya están, sin apps adicionales.",
  },
  {
    emoji: "🗓️",
    title: "Presencial y virtual",
    description:
      "Gestiona citas en tu local, en videollamada o en ambas modalidades desde un solo lugar.",
  },
  {
    emoji: "📊",
    title: "Gráficos de tu agenda",
    description:
      "Visualiza el estado de tus citas a lo largo del tiempo y toma mejores decisiones.",
  },
  {
    emoji: "🤝",
    title: "Onboarding personalizado",
    description:
      "No te dejamos solo. Te acompañamos en la configuración y te capacitamos para sacarle el máximo provecho.",
  },
];

export default function AboutUsPage() {
  return (
    <>
      {/* Hero */}
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
                Nuestra historia
              </div>
              <h1 className="bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
                Quiénes somos
              </h1>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                Ayudamos a profesionales y pequeños negocios a organizar sus
                citas, automatizar recordatorios y reducir ausencias, para que
                puedan enfocarse en atender mejor a sus clientes.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Historia / Origen */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <ScrollReveal>
              <div>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg sm:h-14 sm:w-14">
                  <Target className="h-6 w-6 text-white sm:h-7 sm:w-7" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                  Por qué nació tuAgenda
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Vi de cerca cómo muchos profesionales —psicólogos,
                  nutricionistas, profesores, consultores— perdían horas
                  coordinando citas por WhatsApp, olvidaban confirmarlas y
                  sufrían ausencias que afectaban su ingreso.
                </p>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Las herramientas existentes eran demasiado genéricas, costosas
                  o simplemente no estaban pensadas para la realidad de los
                  pequeños negocios latinoamericanos. Así nació tuAgenda: una
                  plataforma intuitiva, local y orientada a quien realmente la
                  necesita.
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  Hecho en Lima, Perú
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              {/* Founder card */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-white shadow-lg">
                    LQ
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Lehi Quincho</h3>
                    <p className="text-sm text-primary font-medium">
                      Fundador y desarrollador
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Desarrollé tuAgenda desde cero porque creía que los
                      profesionales merecen una herramienta moderna, simple y
                      pensada para su día a día. Hoy acompaño personalmente a
                      cada negocio que se suma.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Por qué somos diferentes */}
      <section className="bg-muted/30 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                ¿Por qué tuAgenda?
              </h2>
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                No es otro calendario genérico. Está hecho para tu tipo de
                negocio.
              </p>
            </div>
          </ScrollReveal>

          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            {differentiators.map((item, index) => (
              <ScrollReveal key={index} delay={index * 80}>
                <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg">
                  <div className="mb-3 text-3xl">{item.emoji}</div>
                  <h3 className="mb-2 font-bold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Nuestros valores
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
                      className={`mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br sm:h-14 sm:w-14 ${value.color} shadow-lg transition-transform group-hover:scale-110`}
                    >
                      <value.icon className="h-6 w-6 text-white sm:h-7 sm:w-7" />
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

      {/* CTA contacto */}
      <section className="bg-muted/30 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mx-auto max-w-xl text-center">
              <h2 className="mb-3 text-xl font-bold sm:text-2xl">
                ¿Quieres saber más?
              </h2>
              <p className="mb-6 text-muted-foreground">
                Escríbeme directamente. Con gusto te cuento cómo tuAgenda puede
                ayudar a tu negocio.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white shadow-lg shadow-[#25D366]/25 transition-all hover:bg-[#1ebe5a] hover:-translate-y-0.5"
              >
                <WhatsAppIcon size={18} />
                Hablar con Lehi
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
