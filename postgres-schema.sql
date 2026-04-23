-- Postgres schema for Coding Gurukul blog storage
-- Compatible with Neon/Postgres.

create table if not exists blogs (
  id text primary key,
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  cover_image text not null,
  author_name text not null,
  author_avatar text not null,
  tags text[] not null default '{}',
  featured boolean not null default false,
  status text not null check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blogs_status_created_at
  on blogs (status, created_at desc);

create index if not exists idx_blogs_featured
  on blogs (featured);
