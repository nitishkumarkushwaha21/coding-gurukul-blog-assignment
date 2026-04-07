# AI Startup Validator - Scoring Criteria Audit

Date: 2026-04-07

## Summary

Current status: **Partially compliant** with the assignment rubric.

- Core MVP exists and works as a full-stack Next.js app.
- OpenRouter + Supabase are integrated.
- Main missing points are around exact rubric alignment (API shape, input fields, and scoring format).

---

## Criteria Check

## 1) Frontend (React/Next.js)

Status: **Partial**

- Implemented:
  - Idea submission page: [app/page.tsx](app/page.tsx)
  - Dashboard page: [app/dashboard/page.tsx](app/dashboard/page.tsx)
  - Detail report page: [app/report/[id]/page.tsx](app/report/[id]/page.tsx)
- Gap:
  - Rubric asks for **title + description** input.
  - Current form sends a single field (`idea_text`) from [components/IdeaForm.tsx](components/IdeaForm.tsx).

## 2) Backend (API)

Status: **Partial**

- Implemented:
  - `GET /api/ideas`: [app/api/ideas/route.ts](app/api/ideas/route.ts)
  - `GET /api/ideas/:id`: [app/api/ideas/[id]/route.ts](app/api/ideas/[id]/route.ts)
  - `DELETE /api/ideas/:id` (optional): [app/api/ideas/[id]/route.ts](app/api/ideas/[id]/route.ts)
- Gap:
  - Rubric asks for `POST /ideas`.
  - Current project uses `POST /api/validate`: [app/api/validate/route.ts](app/api/validate/route.ts)
  - This is functionally equivalent, but **not endpoint-name compliant**.

## 3) AI Integration

Status: **Partial**

- Implemented with OpenRouter:
  - [lib/claude.ts](lib/claude.ts)
- Implemented report fields:
  - problem summary
  - customer persona
  - market overview
  - competitor list
  - risk level
  - profitability score
- Gaps:
  - Rubric requires **suggested tech stack**. This field is currently missing in:
    - Prompt/output contract: [lib/claude.ts](lib/claude.ts)
    - Types: [types/index.ts](types/index.ts)
    - UI rendering: [components/ReportFull.tsx](components/ReportFull.tsx)
    - DB usage path: [lib/supabase.ts](lib/supabase.ts)
  - Rubric requires profitability score **0-100**.
  - Current app uses **1-10** visual and validation logic:
    - [components/ScoreBadge.tsx](components/ScoreBadge.tsx)
    - [lib/claude.ts](lib/claude.ts)

## 4) Database

Status: **Pass**

- Supabase integrated in [lib/supabase.ts](lib/supabase.ts)
- SQL schema file exists: [supabase-schema.sql](supabase-schema.sql)

## 5) Deployment (Preferred)

Status: **Unknown / Not evidenced in repo**

- No live deployment URL is documented in [README.md](README.md).
- Project does build locally, but rubric asks for preferred deployment targets.

## 6) Submission Requirements

Status: **Partial**

- Implemented:
  - GitHub repository exists and code is pushed.
  - README exists: [README.md](README.md)
- Gaps:
  - Rubric asks for `/client` and `/server` folders.
  - Current repo is a single Next.js full-stack app (no split folders).
  - README currently does not include a dedicated section with exact **prompts used** for AI generation.
  - No live demo link is documented.

---

## Features Left To Reach Full Rubric Compliance

1. Add **title + description** fields in form, API payload, DB schema, and detail view.
2. Make backend endpoint rubric-compliant by adding `POST /api/ideas` (or aliasing to existing validate logic).
3. Add `tech_stack` back into AI prompt, types, DB write/read, and report UI.
4. Change profitability scoring scale from 1-10 to **0-100** across prompt, validation, storage, and UI badge.
5. Update README with:
   - installation steps
   - exact AI prompts used
   - architecture notes
   - live demo link (if deployed)
6. Optional but rubric-aligned structure: include `/client` and `/server` directories (or clearly justify single full-stack Next.js architecture in README).

---

## Estimated Rubric Readiness

Approximate readiness: **75-80%**

- Strong core product implementation.
- Main deductions likely from strict rubric mismatches rather than missing MVP fundamentals.
