import Link from "next/link";

export default function NotFound() {
  return (
    <section
      className="mx-auto max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900"
      aria-label="Page not found"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
        404
      </p>
      <h1 className="font-display text-4xl text-slate-900 dark:text-slate-100">
        Page not found
      </h1>
      <p className="text-slate-600 dark:text-slate-300">
        The page you are looking for may have been moved or deleted.
      </p>
      <Link
        href="/"
        className="inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Back to Home
      </Link>
    </section>
  );
}
