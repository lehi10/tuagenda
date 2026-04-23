"use client";

import { BusinessHero } from "@/client/components/booking/business-profile/business-hero";
import { ServiceGrid } from "@/client/components/booking/business-profile/service-grid";
import { BusinessSidebar } from "@/client/components/booking/business-profile/business-sidebar";
import { SchedulePopup } from "@/client/components/booking/business-profile/schedule-popup";
import { useBusinessProfile } from "@/client/components/booking/business-profile/use-business-profile";
import type { BookingService } from "@/client/types/booking";

interface BusinessData {
  name: string;
  description: string;
  avatar?: string | null;
  email: string;
  phone: string;
  location: string;
  website?: string;
}

interface BusinessProfilePageProps {
  businessId: string;
  business: BusinessData;
  onServiceSelect: (service: BookingService) => void;
}

export function BusinessProfilePage({
  businessId,
  business,
  onServiceSelect,
}: BusinessProfilePageProps) {
  const {
    filteredServices,
    categoryTabs,
    categoryFilter,
    setCategoryFilter,
    isLoading,
    showSchedule,
    setShowSchedule,
  } = useBusinessProfile(businessId);

  return (
    <div className="w-full">
      <BusinessHero
        name={business.name}
        avatar={business.avatar}
        location={business.location}
        onShowSchedule={() => setShowSchedule(true)}
      />

      <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 px-4 sm:px-6 pt-6 pb-12 max-w-6xl mx-auto">
        <ServiceGrid
          services={filteredServices}
          categoryTabs={categoryTabs}
          categoryFilter={categoryFilter}
          isLoading={isLoading}
          onCategoryChange={setCategoryFilter}
          onServiceSelect={onServiceSelect}
        />
        <BusinessSidebar phone={business.phone} />
      </div>

      {showSchedule && <SchedulePopup onClose={() => setShowSchedule(false)} />}
    </div>
  );
}
