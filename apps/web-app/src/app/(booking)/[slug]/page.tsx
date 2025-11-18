import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BusinessProfile } from "@/client/components/booking/shared/business-profile";
import { PublicFooter } from "@/client/components/public-footer";
import { BookingHeader } from "@/client/components/booking/shared/booking-header";
import { BookingPageSkeleton } from "@/client/components/booking/shared/booking-page-skeleton";
import { BookingFlow } from "@/client/components/booking/booking-flow";
import { GetBusinessBySlugUseCase } from "@/server/core/application/use-cases/business";
import { PrismaBusinessRepository } from "@/server/infrastructure/repositories";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function BookingContent({ slug }: { slug: string }) {
  // Fetch business data on the server using the use case directly
  const businessRepository = new PrismaBusinessRepository();
  const getBusinessBySlugUseCase = new GetBusinessBySlugUseCase(
    businessRepository
  );
  const result = await getBusinessBySlugUseCase.execute({ slug });

  // Redirect to 404 if business not found
  if (!result.success || !result.business) {
    notFound();
  }

  const business = result.business.toObject();

  // Ensure business has an ID (should always be present from database)
  if (!business.id) {
    throw new Error("Business ID is missing");
  }

  // Map business data to the expected format for BusinessProfile component
  const businessProfile = {
    name: business.title,
    description:
      business.description || "Tu destino para servicios profesionales",
    avatar:
      business.logo ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${business.title}`,
    email: business.email,
    phone: business.phone || "",
    location: [business.address, business.city, business.country]
      .filter(Boolean)
      .join(", "),
    website: business.website || undefined,
  };

  return (
    <>
      <BusinessProfile business={businessProfile} />
      <BookingFlow businessId={business.id} />
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
