import Image from "next/image";
import Link from "next/link";

import type { Blog } from "@/types/blog";

import { BlogCard } from "@/components/BlogCard";
import { BlogSearchBar } from "@/components/BlogSearchBar";

const PAGE_SIZE = 6;

function normalize(text: string) {
  return text.trim().toLowerCase();
}

export function BlogListingClient({
  blogs,
  searchParams,
}: {
  blogs: Blog[];
  searchParams?: { q?: string; tag?: string; page?: string };
}) {
  const query = normalize(searchParams?.q ?? "");
  const tagFilter = normalize(searchParams?.tag ?? "");
  const page = Math.max(1, Number(searchParams?.page ?? "1"));

  const filtered = blogs.filter((blog) => {
    const haystack = `${blog.title} ${blog.tags.join(" ")}`.toLowerCase();
    const matchesQuery = query ? haystack.includes(query) : true;
    const matchesTag = tagFilter
      ? blog.tags.some((tag) => tag.toLowerCase() === tagFilter)
      : true;
    return matchesQuery && matchesTag;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageBlogs = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const hero = pageBlogs.find((blog) => blog.featured) ?? pageBlogs[0] ?? null;
  const gridBlogs = hero
    ? pageBlogs.filter((blog) => blog.id !== hero.id)
    : pageBlogs;
  const hasFilters = Boolean(query || tagFilter);
  const isFirstPage = safePage <= 1;
  const isLastPage = safePage >= pageCount;

  return (
    <section className="space-y-10" aria-label="Homepage blog listing">
      <header className="space-y-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-amber-50/60 p-8 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Editorial Magazine
        </p>
        <h1 className="font-display text-5xl leading-tight text-slate-900 dark:text-slate-100 md:text-6xl">
          Stories for builders, creators, and curious minds.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Read practical essays, technical deep dives, and strategy notes
          curated in a clean content-first experience.
        </p>
        <BlogSearchBar
          q={searchParams?.q ?? ""}
          tag={searchParams?.tag ?? ""}
        />
        {hasFilters ? (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold uppercase tracking-[0.14em] text-slate-500">
              Active filters
            </span>
            {query ? (
              <span className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                Search: {query}
              </span>
            ) : null}
            {tagFilter ? (
              <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 font-medium text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                Tag: #{tagFilter}
              </span>
            ) : null}
            <Link
              href="/"
              className="rounded-full border border-transparent px-3 py-1 font-medium text-slate-600 underline decoration-slate-400 underline-offset-4 transition hover:border-slate-200 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-100"
            >
              Clear all
            </Link>
          </div>
        ) : null}
      </header>

      {hero ? (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <Link href={`/blog/${hero.slug}`} className="block">
            <div className="relative aspect-[16/7] w-full">
              <Image
                src={hero.coverImage}
                alt={hero.title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-slate-900/10 to-transparent" />
            </div>
          </Link>
          <div className="space-y-4 p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              Featured Story
            </p>
            <h2 className="font-display text-4xl leading-tight text-slate-900 dark:text-slate-100 md:text-5xl">
              <Link href={`/blog/${hero.slug}`} className="hover:underline">
                {hero.title}
              </Link>
            </h2>
            <p className="max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {hero.excerpt}
            </p>
          </div>
        </article>
      ) : (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          No matching posts found.
        </p>
      )}

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {gridBlogs.map((blog, index) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            priority={index < 2 && safePage === 1}
          />
        ))}
      </div>

      <nav aria-label="Pagination" className="flex items-center justify-center gap-3 pb-2">
        <Link
          href={`/?${new URLSearchParams({
            ...(query ? { q: query } : {}),
            ...(tagFilter ? { tag: tagFilter } : {}),
            page: String(Math.max(1, safePage - 1)),
          }).toString()}`}
          aria-disabled={isFirstPage}
          className={`rounded-lg border px-4 py-2 text-sm transition ${
            isFirstPage
              ? "pointer-events-none border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800"
          }`}
        >
          Previous
        </Link>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          Page {safePage} of {pageCount}
        </span>
        <Link
          href={`/?${new URLSearchParams({
            ...(query ? { q: query } : {}),
            ...(tagFilter ? { tag: tagFilter } : {}),
            page: String(Math.min(pageCount, safePage + 1)),
          }).toString()}`}
          aria-disabled={isLastPage}
          className={`rounded-lg border px-4 py-2 text-sm transition ${
            isLastPage
              ? "pointer-events-none border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800"
          }`}
        >
          Next
        </Link>
      </nav>
    </section>
  );
}
