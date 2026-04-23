import { Suspense } from "react";
import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";
import { BookingFlow } from "@/client/components/booking/booking-flow";
import { serverTrpc } from "@/server/trpc";
import { BookingPageSkeleton } from "@/client/components/booking/shared/skeletons";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
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
    description:
      business.description || "Tu destino para servicios profesionales",
    avatar: business.logo,
    email: business.email,
    phone: business.phone || "",
    location: [business.address, business.city, business.country]
      .filter(Boolean)
      .join(", "),
    website: business.website || undefined,
    socialLinks: business.socialLinks ?? undefined,
  };

  return (
    <BookingFlow
      businessId={business.id}
      businessProfile={businessProfile}
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
