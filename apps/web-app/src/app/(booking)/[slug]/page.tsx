import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BusinessProfile } from "@/components/booking/business-profile";
import { PublicFooter } from "@/components/public-footer";
import { BookingHeader } from "@/components/booking/booking-header";
import { BookingPageSkeleton } from "@/components/booking/booking-page-skeleton";
import { BookingFlow } from "@/components/booking/booking-flow";
import { getBusinessBySlug } from "@/actions/business";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function BookingContent({ slug }: { slug: string }) {
  // Fetch business data on the server
  const result = await getBusinessBySlug(slug);

  // Redirect to 404 if business not found
  if (!result.success || !result.business) {
    notFound();
  }

  const business = result.business;

  // Map business data to the expected format for BusinessProfile component
  const businessProfile = {
    name: business.title,
    description: business.description || "Tu destino para servicios profesionales",
    avatar: business.pictureFullPath || `https://api.dicebear.com/7.x/initials/svg?seed=${business.title}`,
    email: business.email,
    phone: business.cellphone || business.phone || "",
    location: [business.address, business.city, business.country]
      .filter(Boolean)
      .join(", "),
    website: business.website || undefined,
  };

  return (
    <>
      <BusinessProfile business={businessProfile} />
      <BookingFlow business={business} />
    </>
  );
}

export default async function BookingPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <BookingHeader />

      <Suspense fallback={<BookingPageSkeleton />}>
        <BookingContent slug={slug} />
      </Suspense>

      <PublicFooter />
    </div>
  );
}
