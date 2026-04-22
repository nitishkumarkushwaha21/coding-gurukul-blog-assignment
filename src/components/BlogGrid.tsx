import type { Blog } from "@/types/blog";

import { BlogCard } from "./BlogCard";

export function BlogGrid({ blogs }: { blogs: Blog[] }) {
  if (blogs.length === 0) {
    return (
      <p className="rounded-xl border bg-white p-6 text-slate-600">
        No blogs published yet.
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
