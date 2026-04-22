"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useState } from "react";

import type { Blog } from "@/types/blog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AdminBlogTable({ blogs }: { blogs: Blog[] }) {
  const router = useRouter();
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  async function remove(slug: string) {
    await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
    router.refresh();
  }

  async function toggle(slug: string) {
    await fetch(`/api/blogs/${slug}/publish`, { method: "PATCH" });
    router.refresh();
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell className="font-medium text-slate-900">
                {blog.title}
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    blog.status === "published"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }
                >
                  {blog.status === "published" ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="text-slate-600">
                {format(new Date(blog.updatedAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1.5">
                  {blog.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} className="bg-slate-100 text-slate-700">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/edit/${blog.slug}`}>Edit</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggle(blog.slug)}
                  >
                    Toggle Publish
                  </Button>

                  <AlertDialog
                    open={deletingSlug === blog.slug}
                    onOpenChange={(open) =>
                      setDeletingSlug(open ? blog.slug : null)
                    }
                  >
                    <AlertDialogTrigger>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete this blog.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove(blog.slug)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
