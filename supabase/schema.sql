-- Run this in Supabase → SQL Editor
-- It creates the projects table, RLS policies, and storage bucket setup.

-- =========================================
-- 1. projects table
-- =========================================
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  number text not null default '',
  title text not null,
  description text not null default '',
  category text not null default '',
  image text not null default '',
  media jsonb not null default '[]'::jsonb,
  link text not null default '#',
  created_at timestamp with time zone not null default now()
);

-- Allow public read (portfolio is public)
alter table public.projects enable row level security;

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
  on public.projects for select
  using (true);

-- For now admin is client-side without Supabase Auth.
-- These policies allow anon to insert/update/delete.
-- When you add Supabase Auth, replace with `auth.role() = 'authenticated'` or a custom claim.
drop policy if exists "Anon can insert projects" on public.projects;
create policy "Anon can insert projects"
  on public.projects for insert
  with check (true);

drop policy if exists "Anon can update projects" on public.projects;
create policy "Anon can update projects"
  on public.projects for update
  using (true)
  with check (true);

drop policy if exists "Anon can delete projects" on public.projects;
create policy "Anon can delete projects"
  on public.projects for delete
  using (true);

-- Helpful index
create index if not exists projects_created_at_idx on public.projects (created_at);

-- =========================================
-- 2. Storage bucket: project-images
-- =========================================
-- Create via Dashboard → Storage → New bucket → name: project-images, Public: ON
-- Or via SQL (requires storage extension):
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update set public = true;

-- Storage policies — allow public read, anon upload/delete
-- Run these AFTER creating the bucket:

-- Public read
drop policy if exists "Public read project-images" on storage.objects;
create policy "Public read project-images"
  on storage.objects for select
  using (bucket_id = 'project-images');

-- Anon upload
drop policy if exists "Anon upload project-images" on storage.objects;
create policy "Anon upload project-images"
  on storage.objects for insert
  with check (bucket_id = 'project-images');

-- Anon update (needed for upsert/replace)
drop policy if exists "Anon update project-images" on storage.objects;
create policy "Anon update project-images"
  on storage.objects for update
  using (bucket_id = 'project-images');

-- Anon delete
drop policy if exists "Anon delete project-images" on storage.objects;
create policy "Anon delete project-images"
  on storage.objects for delete
  using (bucket_id = 'project-images');

-- =========================================
-- 3. Optional: seed DEFAULT_PROJECTS
-- =========================================
-- Uncomment if you want the 3 built-in projects in Supabase:
-- insert into public.projects (number, title, description, image, media, link) values
-- ('01 / WEB APPLICATION', 'POS & Inventory', 'A point-of-sale and inventory management system designed to manage products, transactions, and stock.', '/pos-inventory.svg', '[{"type":"image","src":"/pos-inventory.svg"},{"type":"image","src":"/pos-inventory.svg"},{"type":"image","src":"/pos-inventory.svg"}]'::jsonb, 'https://example.com'),
-- ('02 / FULL STACK', 'Real Estate Platform', 'A modern property platform built with a frontend application and CMS architecture.', '/real-estate.svg', '[{"type":"image","src":"/real-estate.svg"},{"type":"image","src":"/real-estate.svg"},{"type":"image","src":"/real-estate.svg"}]'::jsonb, 'https://example.com'),
-- ('03 / WEB DEVELOPMENT', 'Minimalist Login & Sign-Up Web Page', 'A clean and modern authentication interface designed with a minimalist black-and-white aesthetic. The original UI concept was designed by me in Canva, and I developed the design into a functional web page using AI-assisted coding tools.', '/login-system.svg', '[{"type":"image","src":"/login-system.svg"},{"type":"image","src":"/login-system.svg"},{"type":"image","src":"/login-system.svg"}]'::jsonb, '#');
