import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function ReportSectionSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-7 w-40" />
        </div>
        <Skeleton className="h-px w-16" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[95%]" />
        <Skeleton className="h-4 w-[78%]" />
      </CardContent>
    </Card>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-12">
        <div className="mb-6 flex justify-end">
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="gap-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="w-full max-w-3xl space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-12 w-full max-w-2xl" />
                  <Skeleton className="h-5 w-52" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-px w-full" />
              <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="rounded-xl border bg-muted/50 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[90%]" />
                  </div>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="rounded-xl border bg-muted/50 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-5 w-28" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[85%]" />
                  </div>
                ))}
              </div>
            </CardHeader>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <ReportSectionSkeleton key={index} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
