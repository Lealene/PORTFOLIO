# Fix: Make admin projects show on every device (Supabase)

Your code is already wired to Supabase — but it is **not connected** because `.env.local` and Vercel env vars are missing. That is why you see `Supabase not configured — local fallback` and projects disappear on other devices.

Do these 5 steps **once**:

### 1. Create Supabase project
- Go to https://supabase.com → New Project → pick region → wait ~2 min.

### 2. Run the SQL (creates table + policies + bucket)
- Supabase Dashboard → **SQL Editor** → New Query → paste **entire** `supabase/schema.sql` from this repo → Run.
- Check **Table Editor** → `projects` table exists.
- Check **Storage** → bucket `project-images` exists and is **Public = ON**. If not, create it manually: Storage → New Bucket → name `project-images` → Public ON → Create.

### 3. Get your keys
- Supabase → **Project Settings** → **API** → copy:
  - `Project URL` → `https://xxxxx.supabase.co`
  - `anon public` key (long JWT)

### 4. Connect locally
- In project root create file `.env.local` (same folder as `package.json`):
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key
```
- Restart dev: stop `npm run dev` → `npm run dev` → open `http://localhost:5173/#secret-admin` → banner should change to **✅ Supabase connected**.

### 5. Connect deployed site (Vercel)
- Vercel → your project → **Settings** → **Environment Variables** → Add:
  - `VITE_SUPABASE_URL` = same URL → check **Production, Preview, Development**
  - `VITE_SUPABASE_ANON_KEY` = same anon key → same envs
- **Deployments** → **Redeploy** (or `git push` again). Wait for build.
- Open your deployed URL on phone + laptop → add project via `your-site.vercel.app/#secret-admin` → refresh other device → it appears.

### Verify
- Admin → add project with image → Supabase → **Table Editor** → `projects` → new row with `image` = `https://...supabase.co/storage/v1/object/public/project-images/...`
- Supabase → **Storage** → `project-images` → file visible.
- Portfolio section `03 — Selected Work` shows same projects on every browser.

### Common fix
- **Still shows fallback?** `.env.local` wrong name (must be `.env.local`, not `.env`), forgot to restart dev, or forgot Vercel redeploy.
- **Insert fails / 401?** RLS policies not run — re-run `schema.sql`.
- **Image not showing?** Bucket not Public, or Storage RLS not run.
- **Old local projects still hiding Supabase?** Code now never reads `localStorage` — Supabase is source of truth. No cache to clear.

Do **NOT** use `service_role` key in frontend — only `anon` key with `VITE_` prefix.
