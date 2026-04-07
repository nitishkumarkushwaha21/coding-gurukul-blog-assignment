create extension if not exists pgcrypto;

create table if not exists public.ideas (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  idea_text text not null,
  problem text,
  customer text,
  market text,
  competitors text,
  tech_stack text,
  risk_level text,
  profit_score integer,
  profit_reasoning text,
  raw_response text
);

alter table public.ideas enable row level security;

create policy "Allow public read ideas"
on public.ideas
for select
to anon
using (true);

create policy "Allow public insert ideas"
on public.ideas
for insert
to anon
with check (true);
