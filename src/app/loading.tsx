import { BlogCardSkeleton } from "@/components/BlogCardSkeleton";

export default function Loading() {
  return (
    <section className="space-y-10" aria-label="Loading blog list">
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="h-3 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-12 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <BlogCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
