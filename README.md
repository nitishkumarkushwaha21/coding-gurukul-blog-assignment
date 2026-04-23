# Coding Gurukul Blog Management System

Modern blog management app built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui.

GitHub Repository: https://github.com/nitishkumarkushwaha21/coding-gurukul-blog-assignment

## What This App Does

- Publishes SEO-friendly blog posts with clean slug routes.
- Provides admin tools to create, edit, delete, and publish drafts.
- Supports rich writing using MDX, code blocks, images, links, embeds, and Mermaid diagrams.
- Gives a polished reading experience with search, tags, pagination, table of contents, and dark mode.

## Main Pages

### Public Pages

- `/`:
  - Blog listing page with featured cards, search, tag filters, and pagination.
- `/blog/[slug]`:
  - Full blog detail page with title, cover image, author/date, tags, TOC, and rich content rendering.

### Admin Pages

- `/admin`:
  - Blog management table with edit/delete and draft/publish actions.
- `/admin/new`:
  - New blog creation form + rich editor.
- `/admin/edit/[slug]`:
  - Edit existing post with preview and publishing controls.

### SEO/System Routes

- `/sitemap.xml`: dynamic sitemap from published posts.
- `/robots.txt`: robots rules and sitemap reference.

## Feature Highlights

### Core Blog Features

- Published-only listing on homepage.
- Blog cards include cover image, title, excerpt, author, featured badge, and date.
- Full blog CRUD from admin UI.
- Draft and publish toggle.
- Live preview inside editor.

### Rich Content

- MDX-based rendering pipeline.
- Rich editor for headings, lists, code blocks, and formatting.
- Image support:
  - Add image URL directly.
  - Upload image from editor via API endpoint.
- Links support for internal and external URLs.
- Advanced content blocks:
  - Syntax-highlighted code snippets.
  - YouTube embed component.
  - Link embed card component.
  - Mermaid diagram support.

### UI/UX

- Responsive UI across desktop and mobile.
- Reusable components (BlogCard, editor components, form controls).
- Strong typography and spacing for long-form reading.
- Dark mode support.

### SEO and Performance

- Slug-based blog URLs.
- Dynamic metadata for blog pages (title/description/Open Graph/Twitter).
- Semantic heading structure in content pages.
- Static generation strategy for blog detail pages.
- Dynamic sitemap and robots generation.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- next-mdx-remote/rsc + rehype plugins
- @uiw/react-md-editor
- next-themes
- postgres (optional Neon persistence)
- cloudinary (image upload path)

## Storage Model

- Default development mode:
  - Local JSON file store.
- Optional production mode:
  - Neon Postgres using `DATABASE_URL`.

If `DATABASE_URL` is not set, app automatically falls back to local JSON storage.

## Setup

1. Install dependencies.

```bash
npm install
```

2. Create local env file.

```bash
cp .env.example .env.local
```

3. Add required environment values in `.env.local`.

```bash
DATABASE_URL=postgresql://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

4. Start development server.

```bash
npm run dev
```

5. Open the app.

```text
http://localhost:3000
```

## Optional Production DB Setup

1. Create a Neon Postgres database.
2. Run schema from `postgres-schema.sql`.
3. Restart app after setting `DATABASE_URL`.

## Assignment Context

This project was built for the Software Developer Intern assignment with focus on:

- UI/UX quality
- complete blog features
- SEO implementation
- rich MDX/editor content support

Scope followed intentionally:

- no authentication layer
- simple backend for blog CRUD
