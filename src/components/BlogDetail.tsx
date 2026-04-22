import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

import type { Blog } from "@/types/blog";

import { renderMDX } from "@/lib/mdx";

import { TableOfContents } from "./TableOfContents";

export function BlogDetail({ blog }: { blog: Blog }) {
  return (
    <article className="space-y-8" aria-label="Blog post article">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <span aria-hidden="true">←</span> All Posts
      </Link>

      <header className="space-y-5" aria-label="Blog header">
        <h1 className="font-display text-5xl leading-tight tracking-tight text-slate-900 dark:text-slate-100 md:text-6xl">
          {blog.title}
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
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
        className="max-h-[500px] w-full rounded-2xl border border-slate-200 object-cover"
      />

      <div className="grid gap-8 lg:grid-cols-[70%_30%]">
        <section
          aria-label="Post content"
          className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 dark:border-slate-800 dark:bg-slate-900"
        >
          {renderMDX(blog.content)}
        </section>
        <aside
          className="lg:sticky lg:top-24 lg:self-start"
          aria-label="Post table of contents"
        >
          <TableOfContents content={blog.content} />
        </aside>
      </div>
    </article>
  );
}
