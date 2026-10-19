# School Website — Complete Command Guide

> Project: **School Website** — Next.js 14 + Prisma + Tailwind
> Location: `C:\Users\hp\Documents\Claude Project\School Website`

All commands from the **project folder**:
```powershell
cd "C:\Users\hp\Documents\Claude Project\School Website"
```
> In Claude Code chat, prefix every command with `!` — e.g. `! npm run dev`

---

## 1. Stop and Start the Application

```powershell
# Check ports
netstat -ano | findstr ":3000"
netstat -ano | findstr ":3001"
netstat -ano | findstr ":5555"

# Stop (in the terminal where it runs, press Ctrl + C)
# If stuck:
npx kill-port 3000
npx kill-port 3001
npx kill-port 5555
taskkill /F /IM node.exe   # kills all Node apps

# Start (dev — hot reload)
npm run dev
# → http://localhost:3000  (or 3001 if 3000 busy)

# Production
npm run build
npm run start   # serves build on port 3000

# After DB/schema change — restart to fix EPERM lock:
# 1. Stop (Ctrl+C)  2. npx prisma generate  3. npm run build  4. npm run dev
```

---

## 2. Open the Application in Browser

Dev server must be running (`npm run dev`).

| Page | URL |
|------|-----|
| Home | http://localhost:3000/ |
| About | http://localhost:3000/about |
| Achievements | http://localhost:3000/achievements |
| Contact | http://localhost:3000/contact |
| **Admission Enquiry** | **http://localhost:3000/enquiry** |
| **Admin Panel** | **http://localhost:3000/admin** |
| Admin Login | http://localhost:3000/admin/login |

> If 3000 busy, use 3001 — check terminal output. Admin password: `admin123` (set `ADMIN_TOKEN` in `.env` to change).

### Admin sections

| Section | What it edits |
|---------|---------------|
| `/admin/site` | School name, tagline, address, phone, email, hours, social links (header/footer/contact) |
| `/admin/home` | Hero title/subtitle, welcome title/text, CTA, hero & welcome images (upload or URL) |
| `/admin/about` | Intro, history, mission, vision, principal (name/title/message/photo), core values |
| `/admin/achievements` | Add/edit/delete achievements (title/description/category/date/image) |
| `/admin/gallery` | Upload/delete home page gallery photos (JPG/PNG/WebP/GIF, max 5 MB, stored in `public/uploads/`) |
| `/admin/enquiries` | View enquiries, change status (New/Contacted/Follow-up/Converted/Closed) |

---

## 3. Open the Database & View / Manage Enquiries

Database: `prisma/dev.db` (SQLite). `public/uploads/` holds gallery images.

```powershell
npx prisma studio
# → http://localhost:5555 — click any table to browse/edit

node scripts/list-enquiries.mjs
# quick terminal table

# Backup
copy prisma\dev.db prisma\dev.db.backup
# Reset (dev only — deletes all data)
del prisma\dev.db
npx prisma db push
```

---

## 4. Modify the Application

| What to change | File |
|----------------|------|
| School name etc. (also via Admin) | `lib/site-config.ts` (defaults) or `/admin/site` (DB) |
| Admission classes / age range / enquiry limits | `lib/site-config.ts` → `ADMISSION_CLASSES`, `AGE_RANGE`, `ENQUIRY_LIMITS` |
| Form validation | `lib/validators/admission.ts` |
| Admin validation | `lib/validators/admin.ts` |
| Enquiry page / form | `app/enquiry/page.tsx`, `components/AdmissionEnquiryForm.tsx` |
| Home / About / Achievements / Contact | `app/page.tsx`, `app/about/page.tsx`, etc. (now DB-driven) |
| Header / Footer | `components/Header.tsx`, `components/Footer.tsx` |
| Enquiry API + duplicate/limit logic | `app/api/v1/admission-enquiries/route.ts` |
| Admin APIs | `app/api/admin/*` |
| Database schema | `prisma/schema.prisma` → `npx prisma db push` |
| Admin password | `.env` → `ADMIN_TOKEN` |
| Colors & theme | `tailwind.config.ts` |
| Global styles | `app/globals.css` |

```powershell
# After editing schema:
# Ctrl+C to stop
npx prisma db push
npx prisma generate
npm run build
npm run dev

# After editing validation/config/pages:
npm run build
npm run dev
```

```powershell
# Env
# DATABASE_URL="file:./dev.db"
# ADMIN_TOKEN="admin123"

# Fixes
npm run build          # type/lint check
# EPERM rename query_engine… → stop dev, then npx prisma generate
# Port 3000 in use → npx kill-port 3000 then npm run dev
```

---

## Quick Reference

```powershell
# FIRST TIME
cd "C:\Users\hp\Documents\Claude Project\School Website"
npm install
npx prisma generate
npx prisma db push
npm run build
npm run dev

# DAILY
npm run dev                          # start
# open http://localhost:3000/admin  (password: admin123)
npx prisma studio                    # DB on http://localhost:5555
node scripts/list-enquiries.mjs
# Ctrl+C to stop

# AFTER EDITING prisma/schema.prisma
# Ctrl+C
npx prisma db push
npx prisma generate
npm run build
npm run dev
```
