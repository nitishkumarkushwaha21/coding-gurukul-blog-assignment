import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex gap-3">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        <Skeleton className="h-7 w-4/5" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[92%]" />
        <Skeleton className="h-4 w-[76%]" />
        <div className="flex items-center justify-between pt-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-12">
        <div className="mb-10 flex flex-col gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-5 w-full max-w-2xl" />
          <Skeleton className="h-5 w-[70%] max-w-xl" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <DashboardCardSkeleton key={index} />
          ))}
        </div>
      </main>
    </div>
  );
}
