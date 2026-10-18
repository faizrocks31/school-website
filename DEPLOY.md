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

Vercel's filesystem is ephemeral, so enquiries would be lost on every deploy. Use a **free Postgres** — the Prisma schema is already set to `provider = "postgresql"`, so no code change is needed:

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

### Step 4 — Make the URL public (do not skip)

By default Vercel may leave **Deployment Protection** on, which makes every URL — pages *and* `/api/*` — redirect to a Vercel login. The site then looks broken and the enquiry form fails with a generic error.

1. Vercel Dashboard → your project → **Settings → Deployment Protection**
2. Set the scope to **Standard Protection** (protects preview URLs, leaves the production domain public)
   - **Disabled / None** also works if you don't need preview protection
   - **All Deployments** is what breaks a shareable link — it protects the production domain too
3. **Save**

Verify — this must print `200`, not `302`:
```powershell
curl.exe -sI https://your-project.vercel.app/ | findstr /R "^HTTP"
```
If it prints `302` with a `Location:` pointing at `vercel.com/sso-api`, protection is still on.

Use the **production domain** from Settings → Domains (e.g. `https://your-project.vercel.app`). Preview URLs of the form `your-project-abc123-you.vercel.app` stay protected under Standard Protection — never share those.

### Step 5 — Test live site
- `https://your-url.vercel.app/` — home
- `https://your-url.vercel.app/enquiry` — submit a test enquiry, expect an `ENQ-YYYYMMDD-XXXX` reference
- `https://your-url.vercel.app/admin` — login with `ADMIN_TOKEN` → manage content

Sanity-check the enquiry API from DevTools console on the live site:
```js
fetch("/api/v1/admission-enquiries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({studentName:"Test Student",fatherName:"Test Father",studentAge:6,contactNumber:"9876543210",address:"House 12, Knowledge City, State 110001",admissionClass:"Class 1",parentEmail:"test-enquiry@example.com",consent:true})}).then(async r=>({status:r.status,body:await r.json().catch(()=>({}))})).then(console.log)
```
`201` = saved · `409` = duplicate or per-contact limit reached · `422` = validation · `503` = DB not migrated · `429` = rate limited.

### Free domain — custom name
- Vercel auto-gives `*.vercel.app` free forever — this is the realistic free option
- For `yourschool.vercel.app` — Vercel Dashboard → Project → Settings → Domains → Edit
- **Freenom no longer issues free `.tk/.ml` domains** (it stopped in 2023) — ignore any older advice about it

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
npm run build   # must compile with no errors
```

`prisma/schema.prisma` is already `provider = "postgresql"` — the same Neon/Supabase database serves local dev and production, so no provider switch is needed.

**.env for local (gitignored — use the Postgres URL, NOT sqlite):**
```
DATABASE_URL="postgresql://...same database as production..."
ADMIN_TOKEN="admin123"
```

**Env vars on Vercel (Settings → Environment Variables):**
```
DATABASE_URL="postgresql://..."
ADMIN_TOKEN="your-strong-password"
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Live URL asks for a Vercel login | Deployment Protection set to **All Deployments** → switch scope to **Standard Protection** (or Disabled). See Step 4 |
| `500` on live site | Check Vercel → Deployments → Logs. Usually `DATABASE_URL` missing or DB not migrated — run `npx prisma db push` with prod URL |
| `503` on live site (enquiry) | Tables missing in prod DB — run `npx prisma db push` with the prod `DATABASE_URL` |
| Enquiries lost after redeploy | You used SQLite on Vercel — switch to Neon/Supabase Postgres |
| `P1012: URL must start with postgresql://` | `.env` reverted to `file:./dev.db` — replace with the Postgres URL |
| Build fails: `EPERM query_engine` | Local only — `taskkill /F /IM node.exe; Remove-Item -Recurse -Force node_modules\.prisma; npx prisma generate` |
| `ADMIN_TOKEN` not working | Set it in Vercel → Settings → Environment Variables → Redeploy |
| Test rows appear on the live site | Dev and prod share one database — delete test enquiries from `/admin/enquiries` |

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
