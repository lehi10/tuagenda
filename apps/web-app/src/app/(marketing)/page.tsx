import type { Metadata } from "next";
import { LandingPageClient } from "./_components/landing-page-client";

export const metadata: Metadata = {
  title: "TuAgenda - Gestión de Citas para Profesionales",
  description:
    "Simplifica tu agenda, gestiona tus clientes y aumenta tus reservas con TuAgenda. La plataforma de gestión de citas diseñada para profesionales independientes y negocios en Perú.",
  metadataBase: new URL("https://tuagenda.pe"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TuAgenda - Gestión de Citas para Profesionales",
    description:
      "Simplifica tu agenda, gestiona tus clientes y aumenta tus reservas con TuAgenda. La plataforma de gestión de citas diseñada para profesionales independientes y negocios en Perú.",
    url: "https://tuagenda.pe",
    siteName: "TuAgenda",
    images: [
      {
        url: "/images/landing/banner1.png",
        width: 1200,
        height: 630,
        alt: "TuAgenda - Gestión de Citas",
      },
    ],
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TuAgenda - Gestión de Citas para Profesionales",
    description:
      "Simplifica tu agenda, gestiona tus clientes y aumenta tus reservas con TuAgenda.",
    images: ["/images/landing/banner1.png"],
  },
};

export default function Home() {
  return <LandingPageClient />;
}
