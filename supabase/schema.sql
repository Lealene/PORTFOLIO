-- ============================================================
-- Supabase schema for lealene-portfolio
-- Project: scblwteuxpemnwghmszd
-- Run this in Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================
-- What this does:
-- 1. Creates public.projects table (all fields used by src/App.jsx)
-- 2. Enables Row Level Security (RLS) + policies
-- 3. Creates Storage bucket project-images (public) + storage policies
-- ============================================================

-- =========================================
-- 1. projects table
-- Matches the UI object in src/App.jsx:
--   DEFAULT_PROJECTS = { id, number, title, description, category, image, media, link }
--   + created_at (server timestamp)
-- Do NOT store base64 — image/media contain public URLs (https://...supabase.co/storage/...)
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

alter table public.projects enable row level security;

-- Public read: anyone can view portfolio (required for Vercel frontend)
drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
  on public.projects for select
  using (true);

-- ── SECURITY NOTE ──────────────────────────────────────────
-- Your portfolio at src/App.jsx:511 has a client-side admin
-- (hash #secret-admin + ADMIN_PASSWORD = "lealene2026" stored in
-- browser code, NOT in Supabase Auth). There is no Supabase Auth
-- user yet. So these anon policies allow anyone with the anon key
-- to insert/update/delete IF they know the table name.
-- This is intentional for now so Vercel can write without a backend.
-- RLS still applies, but anon key is public by design.
-- For real protection later:
--   1. Enable Supabase Auth (email/password or magic link)
--   2. Replace these policies with: using (auth.role() = 'authenticated')
--      or a custom claim like auth.jwt() ->> 'is_admin' = 'true'
--   3. Change ADMIN_PASSWORD flow to supabase.auth.signInWithPassword()
-- Do NOT put service_role/secret key in frontend (VITE_ vars are public).
-- ─────────────────────────────────────────────────────────────
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

create index if not exists projects_created_at_idx on public.projects (created_at);

-- =========================================
-- 2. Storage bucket: project-images
-- Frontend flow: src/App.jsx:234 uploadImageFile()
--   file → supabase.storage.from('project-images').upload()
--   → getPublicUrl() → save URL in projects.image/media
-- Do NOT store base64/data: URLs in DB — store only https://... URLs
-- Uses unique filenames: ${Date.now()}-${random}.ext to avoid collisions
-- =========================================
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update set public = true;

-- Storage RLS — run AFTER bucket exists
-- Public read: portfolio images visible to everyone (Vercel)
drop policy if exists "Public read project-images" on storage.objects;
create policy "Public read project-images"
  on storage.objects for select
  using (bucket_id = 'project-images');

-- Anon upload: admin panel uploads via anon key (no login yet)
drop policy if exists "Anon upload project-images" on storage.objects;
create policy "Anon upload project-images"
  on storage.objects for insert
  with check (bucket_id = 'project-images');

-- Anon update: needed for upsert/replace on edit
drop policy if exists "Anon update project-images" on storage.objects;
create policy "Anon update project-images"
  on storage.objects for update
  using (bucket_id = 'project-images')
  with check (bucket_id = 'project-images');

-- Anon delete: admin delete cleans up old images (src/App.jsx:258 deleteStorageByUrl)
drop policy if exists "Anon delete project-images" on storage.objects;
create policy "Anon delete project-images"
  on storage.objects for delete
  using (bucket_id = 'project-images');

-- =========================================
-- 3. Optional: seed DEFAULT_PROJECTS
-- Your src/App.jsx:142 DEFAULT_PROJECTS is the fallback when Supabase
-- is empty/unreachable. Uncomment to persist those 3 as real rows.
-- After seeding, refresh portfolio — they will come from Supabase.
-- =========================================
-- insert into public.projects (number, title, description, image, media, link) values
-- ('01 / WEB APPLICATION', 'POS & Inventory', 'A point-of-sale and inventory management system designed to manage products, transactions, and stock.', '/pos-inventory.svg', '[{"type":"image","src":"/pos-inventory.svg"},{"type":"image","src":"/pos-inventory.svg"},{"type":"image","src":"/pos-inventory.svg"}]'::jsonb, 'https://example.com'),
-- ('02 / FULL STACK', 'Real Estate Platform', 'A modern property platform built with a frontend application and CMS architecture.', '/real-estate.svg', '[{"type":"image","src":"/real-estate.svg"},{"type":"image","src":"/real-estate.svg"},{"type":"image","src":"/real-estate.svg"}]'::jsonb, 'https://example.com'),
-- ('03 / WEB DEVELOPMENT', 'Minimalist Login & Sign-Up Web Page', 'A clean and modern authentication interface designed with a minimalist black-and-white aesthetic. The original UI concept was designed by me in Canva, and I developed the design into a functional web page using AI-assisted coding tools.', '/login-system.svg', '[{"type":"image","src":"/login-system.svg"},{"type":"image","src":"/login-system.svg"},{"type":"image","src":"/login-system.svg"}]'::jsonb, '#');
