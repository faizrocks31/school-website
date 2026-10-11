# Free Hosting + Free Domain — Deploy Guide

> **Sunrise Public School** — Next.js 14 on Vercel (free `vercel.app` domain)

---

## Option A — Vercel (Recommended, 5 minutes)

**What you get free:** `https://your-school-xxxxx.vercel.app` + HTTPS + global CDN + auto-deploys from GitHub.

### Step 1 — Push to GitHub (one-time)

```powershell
cd "C:\Users\hp\Documents\Claude Project\School Website"

# if not already a git repo
git init
git add .
git commit -m "initial: school website + admin panel"

# create a repo on github.com (empty, no README), then:
git remote add origin https://github.com/YOUR_USERNAME/school-website.git
git branch -M main
git push -u origin main
```

> Don't have Git? Install from https://git-scm.com/downloads

### Step 2 — Create a free Postgres DB (required for enquiries on Vercel)

SQLite (`dev.db`) works locally, but Vercel's filesystem is ephemeral — enquiries would be lost on every deploy. Use a **free Postgres**:

**Pick one (all free):**
- **Neon** — https://neon.tech — Create project → Copy connection string
- **Supabase** — https://supabase.com — New project → Database → Connection string
- **Vercel Postgres** — vercel.com dashboard → Storage → Create Postgres

Copy the connection string, looks like:
```
postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
```

### Step 3 — Deploy on Vercel

**Method 1 — Via Website (easiest, no CLI):**
1. Go to https://vercel.com → Sign up with GitHub (free)
2. Click **Add New → Project** → Import `school-website` repo
3. Framework: Next.js (auto-detected) — leave Build Command: `npm run build`
4. **Environment Variables** → Add:
   ```
   DATABASE_URL=postgresql://... (from Step 2)
   ADMIN_TOKEN=choose-a-strong-password
   ```
5. Click **Deploy** → wait 2 min → Done! Your URL: `https://school-website-xxxxx.vercel.app`

**After deploy, run the DB migration once:**
```powershell
# from your PC, pointed at production DB:
$env:DATABASE_URL="postgresql://...same as above..."
npx prisma db push
```

**Method 2 — Via CLI (from your PC):**
```powershell
npm i -g vercel
vercel login          # opens browser to auth
vercel --prod         # follow prompts: link to project, set env vars when asked
# when it asks for DATABASE_URL, paste the Postgres URL
# when it asks for ADMIN_TOKEN, enter your admin password
```

### Step 4 — Test live site
- `https://your-url.vercel.app/` — home
- `https://your-url.vercel.app/enquiry` — submit a test enquiry
- `https://your-url.vercel.app/admin` — login with `ADMIN_TOKEN` → manage content

### Free domain — custom name
- Vercel auto-gives `*.vercel.app` free forever
- For `yourschool.vercel.app` — Vercel Dashboard → Project → Settings → Domains → Edit
- Want a real `.com` free? Use **Freenom** (free `.tk/.ml`) + add to Vercel → Domains → Add

### Auto-updates
Every `git push` to `main` auto-redeploys. Edit content via `/admin` on the live site — no redeploy needed for content changes!

---

## Option B — Netlify (Alternative)

Also free, also gives `*.netlify.app`. Steps:
1. Push to GitHub (same as above)
2. netlify.com → Add new site → Import from Git → pick repo
3. Build: `npm run build`, Publish: `.next`
4. Add env vars: `DATABASE_URL`, `ADMIN_TOKEN` → Deploy
5. Note: Next.js on Netlify needs `@netlify/plugin-nextjs` — Vercel is smoother for Next.js.

## Option C — Render (Alternative)

render.com → New → Web Service → Connect GitHub → Build `npm run build` + Start `npm start` → Add `DATABASE_URL` (use Neon/Supabase) → Free tier includes `*.onrender.com` (spins down after 15 min idle).

---

## Local → Production Checklist

```powershell
# Before pushing, make sure this passes:
npm run build   # must show 29/29 pages, no errors

# For production build, change prisma provider if using Postgres:
# In prisma/schema.prisma, change:
#   provider = "sqlite"  →  provider = "postgresql"
# Then:
npx prisma generate
npm run build
```

**.env for local (SQLite):**
```
DATABASE_URL="file:./dev.db"
ADMIN_TOKEN="admin123"
```

**Env vars on Vercel (Postgres):**
```
DATABASE_URL="postgresql://..."
ADMIN_TOKEN="your-strong-password"
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `500` on live site | Check Vercel → Deployments → Logs. Usually `DATABASE_URL` missing or DB not migrated — run `npx prisma db push` with prod URL |
| Enquiries lost after redeploy | You used SQLite on Vercel — switch to Neon/Supabase Postgres |
| Build fails: `EPERM query_engine` | Local only — `Remove-Item -Recurse -Force node_modules\.prisma; npx prisma generate; npm run build` |
| `ADMIN_TOKEN` not working | Set it in Vercel → Settings → Environment Variables → Redeploy |
| Want to keep SQLite free? | Use **Turso** (libSQL) — free, works like SQLite in the cloud. Ask me and I'll switch the adapter |

---

## Quick Deploy (copy-paste)

```powershell
cd "C:\Users\hp\Documents\Claude Project\School Website"
git init
git add .
git commit -m "deploy: ready for Vercel"
# create empty repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/school-website.git
git push -u origin main
# then go to vercel.com → Import → Deploy (add DATABASE_URL + ADMIN_TOKEN)
```

Need help? Paste your Vercel deploy log here and I'll fix it.
