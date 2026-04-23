import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

import type { Blog } from "@/types/blog";

import { TagBadge } from "./TagBadge";

export function BlogCard({
  blog,
  priority = false,
}: {
  blog: Blog;
  priority?: boolean;
}) {
  return (
    <article
      aria-label={`Blog card ${blog.title}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
    >
      <Link href={`/blog/${blog.slug}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
          />
          {blog.featured && (
            <span className="absolute left-3 top-3 rounded-md bg-amber-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-amber-800">
              Featured
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col space-y-4 p-5">
        <h2 className="font-display text-2xl leading-tight text-slate-900 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden dark:text-slate-100">
          <Link href={`/blog/${blog.slug}`} className="transition hover:underline">
            {blog.title}
          </Link>
        </h2>

        <p className="text-[15px] leading-7 text-slate-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden dark:text-slate-300">
          {blog.excerpt}
        </p>

        <div className="flex flex-wrap gap-2">
          {blog.tags.slice(0, 3).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <div className="flex min-w-0 items-center gap-2">
            <Image
              src={blog.author.avatar}
              alt={blog.author.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="truncate">{blog.author.name}</span>
          </div>
          <div className="shrink-0 whitespace-nowrap">
            {format(new Date(blog.createdAt), "MMM d, yyyy")} •{" "}
            {blog.readingTime}
          </div>
        </div>
      </div>
    </article>
  );
}
