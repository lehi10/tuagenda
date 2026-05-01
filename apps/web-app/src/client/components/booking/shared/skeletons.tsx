import { Skeleton } from "@/client/components/ui/skeleton";

const UserMenuSkeleton = () => {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="h-3 w-[100px]" />
        <Skeleton className="h-2 w-[120px]" />
      </div>
    </div>
  );
};

export function BookingPageSkeleton() {
  return (
    <div className="w-full">
      {/* Hero Skeleton — matches BusinessHero: h-52 sm:h-64, gradient banner */}
      <div className="relative h-52 sm:h-64 bg-primary/20 overflow-hidden">
        {/* Diagonal texture hint */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg,currentColor 0,currentColor 1px,transparent 1px,transparent 14px)",
          }}
        />
        {/* Top-right pill buttons */}
        <div className="absolute top-4 right-4 sm:right-6 flex gap-2">
          <Skeleton className="h-7 w-24 rounded-full bg-white/20" />
          <Skeleton className="h-7 w-24 rounded-full bg-white/20" />
        </div>
        {/* Bottom-left: avatar + name + location */}
        <div className="absolute bottom-5 left-4 sm:left-6 max-w-6xl flex items-end gap-4">
          <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shrink-0 bg-white/30" />
          <div className="pb-1 space-y-2">
            <Skeleton className="h-6 w-48 sm:h-7 sm:w-64 bg-white/30" />
            <Skeleton className="h-3.5 w-32 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Main content — matches BusinessProfilePage layout */}
      <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 px-4 sm:px-6 pt-6 pb-12 max-w-6xl mx-auto">
        {/* Service Grid Skeleton */}
        <div className="flex-1 min-w-0">
          {/* Category tabs */}
          <div className="flex gap-0 border-b mb-5">
            {[
              { w: "w-16", badge: "w-5" },
              { w: "w-20", badge: "w-6" },
              { w: "w-14", badge: "w-4" },
            ].map((tab, i) => (
              <div key={i} className="px-4 py-2.5 flex items-center gap-1.5">
                <Skeleton className={`h-4 ${tab.w}`} />
                <Skeleton className={`h-4 ${tab.badge} rounded-full`} />
              </div>
            ))}
          </div>

          {/* Service cards — matches rounded-2xl border bg-card layout */}
          <div className="grid gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-2xl border bg-card">
                <div className="flex gap-3 items-start">
                  {/* Emoji icon */}
                  <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
                  {/* Service info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-16 rounded-md" />
                      <Skeleton className="h-4 w-20 rounded-md" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                  {/* Price badge */}
                  <Skeleton className="h-6 w-14 rounded-lg shrink-0 ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Skeleton — matches BusinessSidebar: w-full lg:w-72 xl:w-80 */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 mt-6 lg:mt-0">
          <div className="rounded-2xl border bg-card p-5">
            {/* Section label */}
            <Skeleton className="h-3 w-20 mb-4" />
            {/* Social icon buttons row */}
            <div className="flex gap-2 mb-3">
              <Skeleton className="w-9 h-9 rounded-xl" />
              <Skeleton className="w-9 h-9 rounded-xl" />
              <Skeleton className="w-9 h-9 rounded-xl" />
            </div>
            {/* WhatsApp-style wide button */}
            <Skeleton className="h-14 w-full rounded-xl" />
            {/* Phone button */}
            <Skeleton className="h-14 w-full rounded-xl mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export { UserMenuSkeleton };
