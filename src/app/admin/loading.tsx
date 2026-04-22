import { BlogCardSkeleton } from "@/components/BlogCardSkeleton";

export default function Loading() {
  return (
    <section className="space-y-6" aria-label="Loading admin page">
      <div className="h-24 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <BlogCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
