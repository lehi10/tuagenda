import { Suspense } from "react";
import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";
import type { Metadata } from "next";
import { BookingFlow } from "@/client/components/booking/booking-flow";
import { serverTrpc } from "@/server/trpc";
import { BookingPageSkeleton } from "@/client/components/booking/shared/skeletons";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  let business;
  try {
    business = await serverTrpc.business.getBySlug({ slug });
  } catch {
    return { title: "Reserva tu cita | TuAgenda" };
  }

  const businessName = business.title;
  const description =
    business.description ||
    `Reserva tu cita con ${businessName} de forma rápida y sencilla a través de TuAgenda.`;
  const location = [business.city, business.country].filter(Boolean).join(", ");
  const fullDescription = location
    ? `${description} Ubicado en ${location}.`
    : description;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://tuagenda.app";
  const pageUrl = `${appUrl}/${slug}`;

  const ogImage = business.logo
    ? {
        url: business.logo,
        width: 800,
        height: 800,
        alt: `Logo de ${businessName}`,
      }
    : {
        url: `${appUrl}/images/og-booking-default.png`,
        width: 1200,
        height: 630,
        alt: `Reserva en ${businessName} | TuAgenda`,
      };

  return {
    title: `Reserva en ${businessName} | TuAgenda`,
    description: fullDescription,
    openGraph: {
      title: `Reserva tu cita en ${businessName}`,
      description: fullDescription,
      url: pageUrl,
      siteName: "TuAgenda",
      images: [ogImage],
      type: "website",
      locale: "es_ES",
    },
    twitter: {
      card: "summary_large_image",
      title: `Reserva tu cita en ${businessName}`,
      description: fullDescription,
      images: [ogImage.url],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

async function BookingContent({ slug }: { slug: string }) {
  // Fetch business data using server-side tRPC caller
  // This respects hexagonal architecture by going through the tRPC layer
  let business;
  try {
    business = await serverTrpc.business.getBySlug({ slug });
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }

  // Ensure business has an ID (should always be present from database)
  if (!business.id) {
    throw new Error("Business ID is missing");
  }

  // Map business data to the expected format for BusinessProfile component
  const businessProfile = {
    name: business.title,
    description: business.description || "",
    avatar: business.logo,
    email: business.email,
    phone: business.phone || "",
    location: [business.address, business.city, business.country]
      .filter(Boolean)
      .join(", "),
    website: business.website || undefined,
    socialLinks: business.socialLinks ?? undefined,
  };

  const businessLocation = {
    address: [business.address, business.city, business.country]
      .filter(Boolean)
      .join(", "),
    lat: business.latitude ?? undefined,
    lng: business.longitude ?? undefined,
  };

  return (
    <BookingFlow
      businessId={business.id}
      businessProfile={businessProfile}
      businessLocation={businessLocation}
      currency={business.currency}
    />
  );
}

export default async function BookingPage({ params }: PageProps) {
  const { slug } = await params;
  return (
    <Suspense fallback={<BookingPageSkeleton />}>
      <BookingContent slug={slug} />
    </Suspense>
  );
}
