# Software Developer Intern Assignment

## Blog Management System (Next.js)

GitHub Repository: https://github.com/nitishkumarkushwaha21/coding-gurukul-blog-assignment

## Objective

Build a modern Blog Management System with focus on:

- High-quality UI/UX
- Complete blog features
- Strong SEO implementation
- Rich content using MDX and editor workflow

## Tech Requirements

- Next.js (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui

## Scope Constraint

- No authentication required
- Keep backend simple (blog CRUD only)
- Focus on frontend, content experience, and SEO

## Requirement Coverage

### Core Features

#### Blog Listing Page

- Shows published blogs
- Blog card includes: cover image, title, excerpt, author, featured, date
- Clean responsive layout
- Pagination implemented

#### Blog Detail Page

- Route: /blog/[slug]
- Renders title (H1), cover image, full content, tags, author, date
- Rich content rendering through MDX

#### Blog Management (Admin UI)

- Create, edit, delete blog
- Draft and publish toggle
- Live preview in editor

### Rich Content Requirements

- MDX and rich editor support for headings, lists, and code blocks
- Images in content via URL and upload endpoint
- Internal and external links support
- Code snippets with syntax highlighting
- Embeds and diagrams support:
  - YouTube embed component
  - Link embed card component
  - Mermaid diagram rendering

### UI and UX Expectations

- Clean modern UI with Tailwind and shadcn/ui
- Good typography and readability for long-form content
- Proper spacing and visual hierarchy
- Responsive behavior across screen sizes
- Reusable components:
  - BlogCard
  - Editor UI
  - Form elements

### SEO Requirements

- Slug-based URLs
- Dynamic metadata (title, description)
- Open Graph and Twitter tags
- Semantic HTML structure (H1/H2 etc.)
- Performance-oriented rendering:
  - Static generation for blog detail pages
  - Dynamic sitemap and robots generation

### Bonus Features

- Search blogs
- Filter by tags
- Dark mode
- Table of contents from headings
- Reading time calculation
- Syntax highlighting

## Evaluation Criteria Mapping

### UI and UX (35%)

- Visual quality and spacing covered with Tailwind + shadcn/ui
- Blog reading experience with readable typography and TOC
- Responsive layout for listing, detail, and admin screens
- Reusable component-based architecture

### Blog Features (25%)

- Full CRUD flow in admin panel
- Draft and publish control
- Accurate rendering of authored content

### Rich Content Handling (20%)

- MDX pipeline integrated
- Image handling inside content
- Link and formatting support
- Complex content support through embeds and Mermaid

### SEO (20%)

- Metadata implementation per page
- Clean URL structure
- Semantic HTML in content pages
- Static rendering strategy for better performance

## Setup

1. Install dependencies.

```bash
npm install
```

2. Start development server.

```bash
npm run dev
```

3. Open the app.

```text
http://localhost:3000
```

## Environment

Copy .env.example to .env.local and set values:

```bash
DATABASE_URL=postgresql://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

If DATABASE_URL is missing, app falls back to local JSON storage for development.

## Database (Optional, Recommended for Production)

1. Create Neon Postgres database.
2. Run SQL from postgres-schema.sql.
3. Restart app.

## Architecture Decisions

- Simple backend CRUD with route handlers to match assignment scope.
- MDX rendering on server for better SEO and performance.
- Static generation for blog detail pages.
- Optional Postgres mode for persistent production data.

## Submission

- GitHub repo: included
- Live demo: preferred (add deployed URL when available)
- README with setup and decisions: included
