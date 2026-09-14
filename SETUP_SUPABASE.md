# Supabase Cloud Setup — Complete Beginner Guide

> **Goal:** Make projects you add in your portfolio appear on **every device/browser** via Supabase cloud (not just your current browser's localStorage).

> **Stack:** `GitHub → Vercel → Vite + React → Supabase (PostgreSQL + Storage project-images)`
> **Project path:** `C:\Users\LEA\Projects\lealene-portfolio`
> Vercel is your deploy target — **GitHub Pages is removed** (no `.github/workflows`).

---

## 1. Create a Supabase Account

1. Go to **https://supabase.com**
2. Click **Start your project** → Sign up (GitHub recommended)
3. Verify email if asked

## 2. Create a Supabase Project

1. Dashboard → **New Project**
2. **Name:** `lealene-portfolio` (any name works)
3. **Database Password:** generate strong one → Save it somewhere safe (not needed for frontend)
4. **Region:** choose closest to you (e.g., `Southeast Asia (Singapore)` for PH)
5. Click **Create new project** → Wait 2–3 minutes until “Project is ready”

> Your **Project ID** is `scblwteuxpemnwghmszd` and URL is `https://scblwteuxpemnwghmszd.supabase.co`

## 3. Open SQL Editor

1. In Supabase Dashboard, left sidebar → **SQL Editor**
2. Click **+ New Query**

## 4. Locate Schema File

On your PC, open:

```
C:\Users\LEA\Projects\lealene-portfolio\supabase\schema.sql
```

Right-click → **Open with** → Notepad / VS Code → **Select All (Ctrl+A) → Copy (Ctrl+C)**

## 5. Paste SQL

In Supabase SQL Editor (the New Query tab you opened):

1. Click inside the editor
2. **Paste (Ctrl+V)** the entire `schema.sql` content

## 6. Verify SQL Content (what it does)

You should see 3 sections:

- **Section 1:** `create table public.projects (...)` — creates table with `id, number, title, description, category, image, media, link, created_at`
- **Section 2:** `insert into storage.buckets ... project-images` + storage policies
- **Section 3:** Optional seed (commented `insert into public.projects...`)

Do **not** edit it unless you know SQL.

## 7. Run It

1. Click **Run** (or `Ctrl+Enter`)
2. Wait for **Success. No rows returned** (green)

> If you see error about `storage.buckets` already exists, it's fine — `on conflict do update` handles it.

## 8. Create / Configure Storage Bucket

The SQL already creates bucket `project-images` as **Public**.

Verify:

1. Left sidebar → **Storage**
2. You should see bucket **project-images** → **Public = ON** (eye icon)
3. If missing: Click **New Bucket** → Name: `project-images` → Toggle **Public** ON → Create
4. If it exists but Private: Click bucket → **Configuration** → Make public

## 9. Configure Policies (already done by SQL)

Left sidebar → **Authentication → Policies** (or **Database → Policies**):

- **Table `projects`:** 4 policies — `Public can read`, `Anon can insert/update/delete` (see `supabase/schema.sql` security note)
- **Storage `project-images`:** 4 policies — Public read + Anon upload/update/delete

> **Security note:** Your admin is currently client-side hash `/#secret-admin` + password `lealene2026` in `src/App.jsx:511` — NOT Supabase Auth. So anon policies allow writes via anon key. This is intentional for now so Vercel can write without backend. For real protection later, enable Supabase Auth and change policies to `auth.role() = 'authenticated'`. Never put `service_role` / `sb_secret_` in frontend `VITE_` vars.

## 10. Find Project URL

1. Supabase → **Project Settings** (gear icon bottom left) → **API** (or **Data API**)
2. Copy **Project URL**: `https://scblwteuxpemnwghmszd.supabase.co`
3. **Do NOT** add `/rest/v1/` — the client in `src/supabaseClient.js:3` adds it internally

## 11. Find Public Anon Key

Still in **Project Settings → API**:

- **Publishable / anon public key** — long string starting `sb_publishable_...` OR legacy JWT `eyJhbGciOi...`
- For `scblwteuxpemnwghmszd`, valid anon is:
  - Legacy JWT: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjYmx3dGV1eHBlbW53Z2htc3pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0MDY5MDMsImV4cCI6MjEwNDk4MjkwM30.kXwFuG4sDAUe_ZDYoAx8-8B_kU_rrCBqTNAGu84hTdo`
  - Publishable alias: `sb_publishable_gJLSVLlMWk6rCK-qJJxEyQ_igN86t-r` (both work)
- **Copy** the anon key — **never** copy `service_role` / `sb_secret_` (bypasses RLS, secret)

## 12. Create Local `.env.local`

1. Open **PowerShell** (Windows → type `PowerShell` → Enter)
2. Run:

```powershell
Set-Location -LiteralPath "C:\Users\LEA\Projects\lealene-portfolio"
notepad .env.local
```

3. If file doesn't exist, Notepad will ask to create → **Yes**
4. Paste (replace with your real values):

```
VITE_SUPABASE_URL=https://scblwteuxpemnwghmszd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjYmx3dGV1eHBlbW53Z2htc3pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0MDY5MDMsImV4cCI6MjEwNDk4MjkwM30.kXwFuG4sDAUe_ZDYoAx8-8B_kU_rrCBqTNAGu84hTdo
```

5. **Save (Ctrl+S) → Close Notepad**
6. Verify `.env.local` is at root next to `package.json` and `.env.example`, and is **gitignored** (`.gitignore` has `.env` + `.env.local` + `.env.*.local`)

> Where to paste what:
> - `VITE_SUPABASE_URL` ← Project URL from step 10
> - `VITE_SUPABASE_ANON_KEY` ← anon/publishable key from step 11

## 13. Verify `.env.example`

Check `C:\Users\LEA\Projects\lealene-portfolio\.env.example` contains:

```
VITE_SUPABASE_URL=https://scblwteuxpemnwghmszd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

This is the template others copy — it is committed (safe, anon is public with RLS).

## 14. Install Dependencies

In same PowerShell at `C:\Users\LEA\Projects\lealene-portfolio`:

```powershell
Set-Location -LiteralPath "C:\Users\LEA\Projects\lealene-portfolio"
pnpm install
```

> Use `pnpm` (project has `pnpm-lock.yaml`). If you use `npm`, run `npm install` but then update `pnpm-lock.yaml` with `pnpm install` before pushing to fix Vercel `frozen-lockfile` error.

Expected: `Done` with `@supabase/supabase-js` installed.

## 15. Run Locally

```powershell
Set-Location -LiteralPath "C:\Users\LEA\Projects\lealene-portfolio"
pnpm run dev
```

Expected:

```
  VITE v8.2.0  ready in 300 ms
  ➜  Local:   http://localhost:5173/
```

Open `http://localhost:5173/` — banner should be gone (no yellow warning). Admin should show `✅ Supabase connected`.

> If you still see `⚠️ Supabase NOT connected`, check: file is named `.env.local` (not `.env`), values have no extra spaces, and you **restarted** `pnpm run dev`.

## 16. Test Project Loading

1. Portfolio loads → `03 — Selected Work` shows `DEFAULT_PROJECTS` fallback (3 projects) while Supabase empty
2. Open DevTools (F12) → Console → should NOT show `[Supabase] load projects failed` unless table missing (means step 7 not run)

## 17. Test Project Upload (Supabase)

1. Go to `http://localhost:5173/#secret-admin` → Password: `lealene2026` → **Unlock Admin**
2. Fill **Title**, **Description**, **Category**, pick **Images** (drag & drop or click)
3. Click **Add Project**
4. Expected: `Uploading images…` → success → new card appears in list and in `03 — Selected Work`

Flow: `src/App.jsx:234 uploadImageFile()` → `project-images` bucket → `getPublicUrl()` → `supabase.from('projects').insert()` (`src/App.jsx:314`)

## 18. Test Image Upload

- Use JPG/PNG/WebP, any size — uploaded as **file** (not base64) with unique name `${Date.now()}-${random}.ext`
- Check Supabase → **Storage → project-images** → file appears
- Portfolio card → `SafeImage` (`src/App.jsx:377`) displays via public URL `https://...supabase.co/storage/v1/object/public/project-images/...`

## 19. Test Edit

1. Admin → **Edit** on a project → change title/description/image → **Update Project**
2. Expected: `supabase.from('projects').update()` (`src/App.jsx:327`) → card updates, old orphaned image deleted via `deleteStorageByUrl` if replaced

## 20. Test Delete

1. Admin → **Delete** → Confirm
2. Expected: `supabase.from('projects').delete()` (`src/App.jsx:341`) + storage cleanup → card disappears

## 21. Add ENV to Vercel

Vercel reads **dashboard env vars**, not `.env` files (`.gitignore` prevents committing secrets).

1. Go to **https://vercel.com** → Your Project (`PORTFOLIO`, ID `prj_Z5iUmg9EG9bQ5MyV0pjlpsilMvOg`) → **Settings** → **Environment Variables**
2. Click **Add New**:
   - **Key:** `VITE_SUPABASE_URL` → **Value:** `https://scblwteuxpemnwghmszd.supabase.co` → **Environments:** ✅ Production, Preview, Development → Save
   - **Key:** `VITE_SUPABASE_ANON_KEY` → **Value:** `eyJhbGciOi...` (same anon JWT) → same envs → Save
3. **Never** add `service_role` / `sb_secret_` as `VITE_` — frontend vars are public in build

## 22. Redeploy Vercel

1. Vercel → **Deployments** → **… → Redeploy** (or push to `main` triggers auto-deploy)
2. Wait for **Build → Ready**

## 23. Test Production on Another Device

1. Open deployed URL (e.g., `https://lealene-portfolio.vercel.app`) on **another PC / phone / incognito**
2. `03 — Selected Work` should show same Supabase projects (not just local fallback)
3. Login `/#secret-admin` → add project → refresh other device → **same project appears**

> If production still shows `⚠️ Supabase NOT connected`, Vercel env vars not set for **Production** or not redeployed after adding them.

## 24. Verify in Supabase

- **Table Editor → projects:** rows with `image` = `https://scblwteuxpemnwghmszd.supabase.co/storage/v1/object/public/project-images/...`, `media` = JSON array of those URLs
- **Storage → project-images:** files visible, **Public = ON**

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `⚠️ Supabase NOT connected` locally | `.env.local` missing/wrong name/not restarted | Create `C:\Users\LEA\Projects\lealene-portfolio\.env.local` exactly, `pnpm run dev` restart |
| Same warning on Vercel | Env not set for Production | Add `VITE_` vars in Vercel Settings → Redeploy |
| `PGRST205 Could not find table 'public.projects'` | `schema.sql` not run | Re-run `supabase/schema.sql` in SQL Editor |
| `401 Unauthorized` on insert | RLS policies not run | Re-run `supabase/schema.sql` storage policies section |
| Image 404 | Bucket not Public | Storage → `project-images` → Make Public |
| `ERR_PNPM_OUTDATED_LOCKFILE` on Vercel | `pnpm-lock.yaml` stale after `npm install` | Run `pnpm install` locally → commit `pnpm-lock.yaml` → push |

## Security Notes

- `VITE_` vars are **public** in Vite build — only use **anon/publishable** key, never `service_role`/`sb_secret_`
- Current admin uses client-side hash `#secret-admin` + password `lealene2026` (`src/App.jsx:511`) — not Supabase Auth. Anon policies allow writes; for real protection enable Supabase Auth and change policies to `auth.role() = 'authenticated'`

## Commands Reference (PowerShell)

```powershell
Set-Location -LiteralPath "C:\Users\LEA\Projects\lealene-portfolio"
pnpm install          # install deps (use pnpm, not npm, to keep lockfile fresh)
pnpm run build        # must pass before push — creates dist/
pnpm run dev          # local dev http://localhost:5173/
pnpm run lint         # oxlint checks
```
