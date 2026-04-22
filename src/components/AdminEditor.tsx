"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import slugify from "slugify";
import { toast } from "sonner";

import type { Blog } from "@/types/blog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

const MarkdownPreview = dynamic(
  async () => {
    const mod = await import("@uiw/react-md-editor");
    return mod.default.Markdown;
  },
  { ssr: false },
);

interface AdminEditorProps {
  mode: "create" | "edit";
  initialBlog?: Blog;
}

export function AdminEditor({ mode, initialBlog }: AdminEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialBlog?.title ?? "");
  const [slug, setSlug] = useState(initialBlog?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialBlog?.slug));
  const [excerpt, setExcerpt] = useState(initialBlog?.excerpt ?? "");
  const [content, setContent] = useState(initialBlog?.content ?? "");
  const [coverImage, setCoverImage] = useState(
    initialBlog?.coverImage ?? "https://picsum.photos/800/400?random=99",
  );
  const [authorName, setAuthorName] = useState(
    initialBlog?.author.name ?? "Admin User",
  );
  const [authorAvatar, setAuthorAvatar] = useState(
    initialBlog?.author.avatar ?? "https://i.pravatar.cc/100?img=67",
  );
  const [tags, setTags] = useState<string[]>(initialBlog?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState<"draft" | "published">(
    initialBlog?.status ?? "draft",
  );
  const [featured, setFeatured] = useState(initialBlog?.featured ?? false);
  const [tab, setTab] = useState("edit");
  const [saving, setSaving] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const editorWrapRef = useRef<HTMLDivElement | null>(null);

  const storageKey = useMemo(
    () => `blog-editor-draft-${mode}-${initialBlog?.slug ?? "new"}`,
    [initialBlog?.slug, mode],
  );

  useEffect(() => {
    if (slugTouched) {
      return;
    }

    setSlug(slugify(title || "", { lower: true, strict: true, trim: true }));
  }, [title, slugTouched]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) {
      return;
    }

    try {
      const draft = JSON.parse(saved) as {
        title: string;
        slug: string;
        excerpt: string;
        content: string;
        coverImage: string;
        authorName: string;
        authorAvatar: string;
        tags: string[];
        status: "draft" | "published";
        featured: boolean;
      };

      setTitle(draft.title);
      setSlug(draft.slug);
      setExcerpt(draft.excerpt);
      setContent(draft.content);
      setCoverImage(draft.coverImage);
      setAuthorName(draft.authorName);
      setAuthorAvatar(draft.authorAvatar);
      setTags(draft.tags);
      setStatus(draft.status);
      setFeatured(draft.featured);
      setUnsaved(true);
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const payload = {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        authorName,
        authorAvatar,
        tags,
        status,
        featured,
      };

      localStorage.setItem(storageKey, JSON.stringify(payload));
      setUnsaved(true);
    }, 30000);

    return () => window.clearInterval(timer);
  }, [
    authorAvatar,
    authorName,
    content,
    coverImage,
    excerpt,
    featured,
    slug,
    status,
    storageKey,
    tags,
    title,
  ]);

  function addTag() {
    const normalized = tagInput.trim();
    if (!normalized || tags.includes(normalized)) {
      return;
    }

    setTags((prev) => [...prev, normalized]);
    setTagInput("");
    setUnsaved(true);
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((item) => item !== tag));
    setUnsaved(true);
  }

  function insertImageMarkdown() {
    if (!imageUrl.trim()) {
      return;
    }

    const snippet = `![${imageAlt.trim() || "image"}](${imageUrl.trim()})`;
    const input = editorWrapRef.current?.querySelector(
      "textarea",
    ) as HTMLTextAreaElement | null;

    if (input) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const next = `${content.slice(0, start)}${snippet}${content.slice(end)}`;
      setContent(next);
    } else {
      setContent((prev) => `${prev}\n\n${snippet}`);
    }

    setImageDialogOpen(false);
    setImageUrl("");
    setImageAlt("");
    setUnsaved(true);
  }

  async function handleSubmit() {
    setSaving(true);

    const payload = {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      tags,
      status,
      featured,
      author: {
        name: authorName,
        avatar: authorAvatar,
      },
    };

    const url =
      mode === "create" ? "/api/blogs" : `/api/blogs/${initialBlog?.slug}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      toast.error("Failed to save blog. Check required fields.");
      setSaving(false);
      return;
    }

    const result = (await res.json()) as { blog?: Blog };

    toast.success(mode === "create" ? "Blog created." : "Blog updated.");
    localStorage.removeItem(storageKey);
    setUnsaved(false);

    if (mode === "create" && result.blog?.slug) {
      router.push(`/admin/edit/${result.blog.slug}`);
    }

    if (
      mode === "edit" &&
      result.blog?.slug &&
      result.blog.slug !== initialBlog?.slug
    ) {
      router.replace(`/admin/edit/${result.blog.slug}`);
    }

    router.refresh();
    setSaving(false);
  }

  return (
    <section
      className="space-y-4 rounded-2xl border bg-white p-5"
      data-color-mode="light"
    >
      <div className="flex items-center justify-between">
        <Tabs value={tab} defaultValue="edit" onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="text-xs text-slate-500">
          {unsaved ? "Unsaved changes" : "All changes saved"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setUnsaved(true);
            }}
          />
        </div>
        <div className="space-y-1">
          <Label>Slug</Label>
          <Input
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
              setUnsaved(true);
            }}
          />
          <p className="text-xs text-slate-500">
            URL: /blog/{slug || "your-slug"}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label>Excerpt</Label>
          <span className="text-xs text-slate-500">{excerpt.length}/200</span>
        </div>
        <Textarea
          value={excerpt}
          maxLength={200}
          onChange={(event) => {
            setExcerpt(event.target.value);
            setUnsaved(true);
          }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Label>Cover Image URL</Label>
          <Input
            value={coverImage}
            onChange={(event) => {
              setCoverImage(event.target.value);
              setUnsaved(true);
            }}
          />
          <Image
            src={coverImage}
            alt="Cover preview"
            width={160}
            height={96}
            className="mt-2 h-24 w-40 rounded-md border object-cover"
          />
        </div>
        <div className="space-y-1">
          <Label>Author Name</Label>
          <Input
            value={authorName}
            onChange={(event) => {
              setAuthorName(event.target.value);
              setUnsaved(true);
            }}
          />
          <Label className="mt-2 block">Author Avatar URL</Label>
          <Input
            value={authorAvatar}
            onChange={(event) => {
              setAuthorAvatar(event.target.value);
              setUnsaved(true);
            }}
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            placeholder="Type a tag and press Enter"
            onChange={(event) => setTagInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addTag();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addTag}>
            Add
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} className="bg-slate-100 text-slate-700">
              {tag}
              <button
                type="button"
                className="ml-2"
                onClick={() => removeTag(tag)}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="inline-flex items-center gap-2">
          <Switch
            checked={featured}
            onCheckedChange={(checked) => {
              setFeatured(checked);
              setUnsaved(true);
            }}
          />
          Featured
        </label>
        <label className="inline-flex items-center gap-2">
          Draft
          <Switch
            checked={status === "published"}
            onCheckedChange={(checked) => {
              setStatus(checked ? "published" : "draft");
              setUnsaved(true);
            }}
          />
          Published
        </label>
      </div>

      <Tabs value={tab} defaultValue="edit" onValueChange={setTab}>
        <TabsContent value="edit" className="space-y-2">
          <div className="flex justify-between">
            <p className="text-sm">Content (MDX)</p>
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
              <DialogTrigger>
                <Button type="button" variant="outline" size="sm">
                  Insert Image
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Insert Image</DialogTitle>
                  <DialogDescription>
                    Add image URL and alt text to insert markdown.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(event) => setImageUrl(event.target.value)}
                  />
                  <Input
                    placeholder="Alt text"
                    value={imageAlt}
                    onChange={(event) => setImageAlt(event.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setImageDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="button" onClick={insertImageMarkdown}>
                      Insert
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div ref={editorWrapRef}>
            <MDEditor
              value={content}
              onChange={(value) => {
                setContent(value ?? "");
                setUnsaved(true);
              }}
              height={520}
            />
          </div>
        </TabsContent>
        <TabsContent value="preview">
          <div className="prose max-w-none rounded-xl border border-slate-200 bg-white p-5">
            <MarkdownPreview source={content} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-3">
        <Button type="button" onClick={handleSubmit} disabled={saving}>
          {saving
            ? "Saving..."
            : mode === "create"
              ? "Create Blog"
              : "Save Changes"}
        </Button>
      </div>
    </section>
  );
}
