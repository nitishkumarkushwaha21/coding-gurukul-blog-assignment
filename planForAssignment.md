# 🚀 AI Startup Idea Validator — Full Build Plan

**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Supabase + Claude API + jsPDF  
**Deploy:** Vercel  
**Time Budget:** 24 hours  

---

## 📁 Project Structure

```
ai-startup-validator/
├── app/
│   ├── page.tsx                  # Landing page with idea input form
│   ├── dashboard/
│   │   └── page.tsx              # All saved ideas dashboard
│   ├── report/
│   │   └── [id]/
│   │       └── page.tsx          # Single idea full report page
│   └── api/
│       ├── validate/
│       │   └── route.ts          # POST - calls Claude, saves to Supabase
│       └── ideas/
│           └── route.ts          # GET - fetches all ideas from Supabase
├── components/
│   ├── IdeaForm.tsx              # Startup idea input form
│   ├── ReportCard.tsx            # Card shown on dashboard
│   ├── ReportFull.tsx            # Full validation report display
│   ├── ScoreBadge.tsx            # Profitability score badge component
│   ├── RiskBadge.tsx             # Risk level badge (Low/Medium/High)
│   ├── ExportPDFButton.tsx       # jsPDF export button
│   └── Navbar.tsx                # Top navigation bar
├── lib/
│   ├── supabase.ts               # Supabase client setup
│   ├── claude.ts                 # Claude API call + prompt logic
│   └── pdfExport.ts              # jsPDF export logic
├── types/
│   └── index.ts                  # Shared TypeScript types/interfaces
├── .env.local                    # API keys (never commit this)
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🗄️ Database Schema (Supabase)

Create one table called `ideas` in Supabase:

```sql
create table ideas (
  id           uuid default gen_random_uuid() primary key,
  created_at   timestamp with time zone default now(),

  -- Input
  idea_text    text not null,

  -- AI Report Fields
  problem      text,
  customer     text,
  market       text,
  competitors  text,
  tech_stack   text,
  risk_level   text,        -- 'Low' | 'Medium' | 'High'
  profit_score integer,     -- 1 to 10

  -- Raw AI response (optional, good for debugging)
  raw_response text
);
```

> Go to Supabase → SQL Editor → paste and run this.

---

## 🔑 Environment Variables

Create `.env.local` in the root:

```
ANTHROPIC_API_KEY=your_claude_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📦 Packages to Install

```bash
npx create-next-app@latest ai-startup-validator --typescript --tailwind --app
cd ai-startup-validator

# UI
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input textarea card badge spinner

# Supabase
npm install @supabase/supabase-js

# Anthropic
npm install @anthropic-ai/sdk

# PDF Export
npm install jspdf
```

---

## 🧠 Claude API — Prompt Design

**File: `lib/claude.ts`**

The key to this project is a well-structured prompt that forces Claude to return clean JSON.

```ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function validateStartupIdea(ideaText: string) {
  const prompt = `
You are a startup analyst. Analyze the following startup idea and return a JSON object only — no extra text, no markdown.

Startup Idea: "${ideaText}"

Return this exact JSON structure:
{
  "problem": "What core problem does this solve? (2-3 sentences)",
  "customer": "Who is the target customer? Be specific about demographics and psychographics. (2-3 sentences)",
  "market": "What is the estimated market size and growth opportunity? (2-3 sentences)",
  "competitors": "List 3-4 main competitors and what makes this idea different.",
  "tech_stack": "Recommend a tech stack to build this MVP. List tools/frameworks.",
  "risk_level": "Low | Medium | High",
  "profit_score": <integer from 1 to 10>,
  "profit_reasoning": "Why did you give this profitability score? (1-2 sentences)"
}
`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const parsed = JSON.parse(text);
  return parsed;
}
```

---

## 🔌 API Routes

### `POST /api/validate` — `app/api/validate/route.ts`

**What it does:**
1. Receives `{ idea_text }` from the frontend form
2. Calls `validateStartupIdea()` from `lib/claude.ts`
3. Saves the result to Supabase `ideas` table
4. Returns the saved record (with `id`) to the frontend

```ts
import { NextRequest, NextResponse } from "next/server";
import { validateStartupIdea } from "@/lib/claude";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { idea_text } = await req.json();

  if (!idea_text) {
    return NextResponse.json({ error: "idea_text is required" }, { status: 400 });
  }

  try {
    // 1. Call Claude
    const report = await validateStartupIdea(idea_text);

    // 2. Save to Supabase
    const { data, error } = await supabase
      .from("ideas")
      .insert([{ idea_text, ...report, raw_response: JSON.stringify(report) }])
      .select()
      .single();

    if (error) throw error;

    // 3. Return saved record
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
```

---

### `GET /api/ideas` — `app/api/ideas/route.ts`

**What it does:** Fetches all saved ideas from Supabase, ordered newest first.

```ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
```

---

## 🖥️ Pages & Components

### Page 1: Landing / Input Page — `app/page.tsx`

- Big headline: "Validate Your Startup Idea with AI"
- `<IdeaForm />` component with a textarea and a "Validate" button
- On submit → calls `POST /api/validate` → shows loading spinner → redirects to `/report/[id]`

**IdeaForm behavior:**
```
1. User types idea
2. Clicks "Validate Now"
3. Button shows loading spinner + disabled state
4. On success → router.push(`/report/${data.id}`)
5. On error → show error toast
```

---

### Page 2: Report Page — `app/report/[id]/page.tsx`

- Fetches one idea from Supabase by `id`
- Renders `<ReportFull />` component
- Has an `<ExportPDFButton />` at the top right

**ReportFull sections (one card each):**
| Section | Icon | Content |
|---|---|---|
| Problem | 🎯 | problem text |
| Target Customer | 👥 | customer text |
| Market Opportunity | 📈 | market text |
| Competitors | ⚔️ | competitors text |
| Recommended Tech Stack | 💻 | tech_stack text |
| Risk Level | ⚠️ | `<RiskBadge />` — color coded |
| Profitability Score | 💰 | `<ScoreBadge />` out of 10 |

---

### Page 3: Dashboard — `app/dashboard/page.tsx`

- Fetches all ideas via `GET /api/ideas`
- Grid of `<ReportCard />` components
- Each card shows: idea text (truncated), profit score badge, risk badge, date, "View Full Report" button

---

## 🧩 Key Components

### `ScoreBadge.tsx`
```tsx
// Shows score as colored circle: 1-4 red, 5-7 yellow, 8-10 green
<ScoreBadge score={8} />  →  🟢 8/10
```

### `RiskBadge.tsx`
```tsx
// Low = green, Medium = yellow, High = red
<RiskBadge level="Medium" />  →  🟡 Medium Risk
```

### `ExportPDFButton.tsx`
Calls `lib/pdfExport.ts` which uses jsPDF to:
1. Create a new PDF document
2. Add the idea title at the top
3. Loop through each report section and add text
4. Add score and risk level
5. `doc.save("startup-report.pdf")`

---

## 📄 PDF Export Logic — `lib/pdfExport.ts`

```ts
import jsPDF from "jspdf";

export function exportReportToPDF(idea: IdeaReport) {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text("Startup Validation Report", 20, y); y += 12;

  doc.setFontSize(12);
  doc.text(`Idea: ${idea.idea_text}`, 20, y); y += 10;
  doc.text(`Date: ${new Date(idea.created_at).toLocaleDateString()}`, 20, y); y += 16;

  const sections = [
    { title: "Problem", content: idea.problem },
    { title: "Target Customer", content: idea.customer },
    { title: "Market Opportunity", content: idea.market },
    { title: "Competitors", content: idea.competitors },
    { title: "Recommended Tech Stack", content: idea.tech_stack },
    { title: "Risk Level", content: idea.risk_level },
    { title: "Profitability Score", content: `${idea.profit_score}/10` },
  ];

  sections.forEach(({ title, content }) => {
    doc.setFont("helvetica", "bold");
    doc.text(title, 20, y); y += 7;
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(content, 170);
    doc.text(lines, 20, y);
    y += lines.length * 6 + 6;
  });

  doc.save(`startup-report-${idea.id}.pdf`);
}
```

---

## 🎨 UI Design Guidelines

Keep it clean and impressive:

- **Color scheme:** Dark navy/black background with a vibrant accent (green or cyan works well for "AI/tech" feel)
- **Font:** Use `Geist` (Next.js default) or `Inter` — clean and professional
- **Cards:** Use shadcn `<Card>` with slight border glow on hover
- **Loading state:** Spinner + "Analyzing your idea with AI..." text
- **Animations:** Use Tailwind's `animate-pulse` for loading skeleton cards on dashboard
- **Score display:** Large bold number with color ring (use inline SVG circle or Tailwind rings)

---

## ⏰ 24-Hour Build Timeline

### Hour 0–1: Setup
- [ ] Create Next.js app with TypeScript + Tailwind
- [ ] Install all packages
- [ ] Init shadcn/ui
- [ ] Create Supabase project + run SQL to create `ideas` table
- [ ] Set up `.env.local` with all keys

### Hour 1–2: Backend Core
- [ ] Write `lib/supabase.ts`
- [ ] Write `lib/claude.ts` with the prompt
- [ ] Write `app/api/validate/route.ts`
- [ ] Write `app/api/ideas/route.ts`
- [ ] Test both endpoints with Postman or curl

### Hour 2–4: Input Page + Form
- [ ] Build `IdeaForm.tsx` with loading state
- [ ] Build `app/page.tsx` landing page
- [ ] Wire up form → API → redirect to report page
- [ ] Test full flow end to end

### Hour 4–6: Report Page
- [ ] Build all sub-components: `ScoreBadge`, `RiskBadge`, `ReportFull`
- [ ] Build `app/report/[id]/page.tsx`
- [ ] Fetch data server-side using Supabase
- [ ] Make it look great with cards and badges

### Hour 6–7: Dashboard
- [ ] Build `ReportCard.tsx`
- [ ] Build `app/dashboard/page.tsx`
- [ ] Add Navbar with links to Home and Dashboard

### Hour 7–8: PDF Export
- [ ] Build `lib/pdfExport.ts`
- [ ] Build `ExportPDFButton.tsx`
- [ ] Test PDF download on report page

### Hour 8–9: Polish + UI Cleanup
- [ ] Responsive design check (mobile)
- [ ] Empty states on dashboard ("No ideas yet")
- [ ] Error handling and toast notifications
- [ ] Loading skeletons on dashboard

### Hour 9–10: Deploy
- [ ] Push to GitHub (public repo)
- [ ] Connect to Vercel
- [ ] Add all env variables in Vercel dashboard
- [ ] Test deployed URL end to end

### Hour 10–24: Buffer
- [ ] Fix any bugs on deployed version
- [ ] Write README.md with setup instructions and screenshots
- [ ] Write your 300-word technical notes for the submission form
- [ ] Take screenshots for README

---

## 📝 README.md Must Include

1. Project description (2-3 lines)
2. Live demo link
3. Tech stack list
4. Setup instructions (clone, install, env vars, run)
5. Screenshot of the dashboard
6. Screenshot of a full report
7. Brief note on AI prompt design

---

## ✅ Final Checklist Before Submitting

- [ ] Idea input form works
- [ ] Claude generates a full structured report
- [ ] Report is saved to Supabase
- [ ] Dashboard shows all past ideas
- [ ] Individual report page works via URL
- [ ] PDF export downloads correctly
- [ ] App is deployed on Vercel
- [ ] GitHub repo is public
- [ ] README is clear
- [ ] `.env.local` is in `.gitignore`
- [ ] Technical notes written (max 300 words)

---

## 💡 Tips to Impress the Evaluator

1. **Make the prompt smart** — The quality of Claude's output is your biggest differentiator. Spend time on the prompt.
2. **Handle loading states** — A spinner and disabled button while Claude is thinking shows polish.
3. **The score visual matters** — A big colored circle showing 7/10 is more impressive than plain text.
4. **Don't skip the README** — Evaluators check this. Screenshots make a huge difference.
5. **Deploy early** — Deploy at hour 9, not hour 23. Gives you time to fix deployment issues.

---

*Good luck. Ship it clean, ship it working. That's all that matters.*