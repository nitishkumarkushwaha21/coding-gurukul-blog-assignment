import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

import type { Blog } from "@/types/blog";

import { renderMDX } from "@/lib/mdx";

import { TableOfContents } from "./TableOfContents";

export function BlogDetail({ blog }: { blog: Blog }) {
  return (
    <article className="space-y-10" aria-label="Blog post article">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
      >
        <span aria-hidden="true">←</span> All Posts
      </Link>

      <header className="space-y-5 border-b border-slate-200 pb-8 dark:border-slate-700" aria-label="Blog header">
        <h1 className="max-w-4xl font-display text-5xl leading-tight tracking-tight text-slate-900 dark:text-slate-100 md:text-6xl">
          {blog.title}
        </h1>
        <p className="max-w-3xl text-xl leading-8 text-slate-600 dark:text-slate-300">
          {blog.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <Image
            src={blog.author.avatar}
            alt={blog.author.name}
            width={32}
            height={32}
            className="rounded-full"
          />
          <span>{blog.author.name}</span>
          <span>•</span>
          <span>{format(new Date(blog.updatedAt), "MMM d, yyyy")}</span>
          <span>•</span>
          <span>{blog.readingTime}</span>
        </div>

        <nav className="flex flex-wrap gap-2" aria-label="Post tags">
          {blog.tags.map((tag) => (
            <Link
              key={tag}
              href={`/?tag=${encodeURIComponent(tag)}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-slate-100"
            >
              #{tag}
            </Link>
          ))}
        </nav>
      </header>

      <Image
        src={blog.coverImage}
        alt={blog.title}
        width={1200}
        height={600}
        priority
        className="max-h-[500px] w-full rounded-2xl border border-slate-200 object-cover shadow-sm ring-1 ring-slate-200/60 dark:border-slate-700 dark:ring-slate-700/70"
      />

      <div className="grid gap-8 lg:grid-cols-[68%_32%]">
        <section
          aria-label="Post content"
          className="article-prose rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200/60 md:p-12 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/25 dark:ring-slate-700/70"
        >
          {renderMDX(blog.content)}
        </section>
        <aside
          className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm ring-1 ring-slate-200/60 lg:sticky lg:top-24 lg:self-start dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/25 dark:ring-slate-700/70"
          aria-label="Post table of contents"
        >
          <TableOfContents content={blog.content} />
        </aside>
      </div>
    </article>
  );
}
