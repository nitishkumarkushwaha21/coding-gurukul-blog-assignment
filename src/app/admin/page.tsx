// Shows admin dashboard table for managing all blogs.
import Link from "next/link";

import { AdminBlogTable } from "@/components/AdminBlogTable";
import { Button } from "@/components/ui/button";
import { getAllBlogs } from "@/lib/blogs";

export default async function AdminPage() {
  const blogs = await getAllBlogs();

  return (
    <section className="space-y-6" aria-label="Admin dashboard">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-blue-700">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            Manage blogs
          </h1>
        </div>
        <Button asChild>
          <Link href="/admin/new">New Blog</Link>
        </Button>
      </header>

      <AdminBlogTable blogs={blogs} />
    </section>
  );
}
