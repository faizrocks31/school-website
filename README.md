# Sunrise Public School — Website

Stack: Next.js 14 (App Router) + TypeScript + Tailwind + Prisma (SQLite for dev, Postgres-ready) + Zod + React Hook Form.

## Routes
`/`, `/about`, `/achievements`, `/contact`, `/enquiry` — header/footer shared, mobile menu, breadcrumbs, `/enquiry` has the full Admission Enquiry form + `POST /api/v1/admission-enquiries`.

## Run locally
```
npm install
npx prisma db push
npm run dev
```
Open http://localhost:3000  — enquiry page at /enquiry.

## Env
Copy `.env.example` to `.env` and set `DATABASE_URL`. For Postgres set e.g. `postgresql://user:pass@localhost:5432/schooldb` and update `prisma/schema.prisma` datasource provider to `postgresql`, then `npx prisma migrate dev`.

## API
`POST /api/v1/admission-enquiries` — validates with Zod, rate-limited (10/min/IP), stores enquiry, returns `{ enquiryNumber, id }`. 422 on validation errors with `errors` map. Never exposes DB internals.

## Notes
- All placeholder content is marked as such; no fabricated rankings/awards.
- `AdmissionEnquiry.status` defaults to `NEW` (future values: CONTACTED, FOLLOW_UP_REQUIRED, CONVERTED, CLOSED).
- Form has frontend (Zod + RHF) and authoritative backend validation, duplicate-submit guard, loading state, accessible labels/errors, 2-col desktop / 1-col mobile.
