import { Skeleton } from "@/client/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/client/components/ui/card";

const UserMenuSkeleton = () => {
  return (
    <div className="flex items-center">
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
    <>
      {/* Business Profile Skeleton */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <Skeleton className="h-20 w-20 rounded-full shrink-0" />
            <div className="flex-1 space-y-2 sm:space-y-3">
              <Skeleton className="h-8 w-64 mx-auto sm:mx-0" />
              <Skeleton className="h-4 w-96 mx-auto sm:mx-0" />
              <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto flex-1 px-4 py-6 sm:py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Service Selection Skeleton */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </div>

            {/* Service Cards Skeleton */}
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card
                  key={i}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column - Summary Skeleton */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 pb-3 border-b">
                      <Skeleton className="h-4 w-4 mt-1" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <div className="flex items-start gap-3 pb-3 border-b">
                      <Skeleton className="h-4 w-4 mt-1" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    </div>
                    <div className="flex items-start gap-3 pb-3 border-b">
                      <Skeleton className="h-4 w-4 mt-1" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-36" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>

                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { UserMenuSkeleton };
