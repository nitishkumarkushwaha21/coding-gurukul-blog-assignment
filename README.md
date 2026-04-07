# AI Startup Validator

An App Router Next.js project for validating startup ideas with an AI-generated report, dashboard history, and PDF export.

## Live Demo

- Live URL: Not deployed yet
- If deployed, add your public link here (Vercel/Netlify): `https://your-live-url`

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- OpenRouter API
- jsPDF

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create/update `.env.local` with your real values.

3. Run development server:

```bash
npm run dev
```

4. Open:

```text
http://localhost:3000
```

## Environment Variables

```bash
OPENROUTER_API_KEY=dummy_openrouter_api_key
OPENROUTER_MODEL=anthropic/claude-sonnet-4
NEXT_PUBLIC_SUPABASE_URL=https://dummy-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy_supabase_anon_key
```

When dummy values are present, the app uses mock data so development can begin before backend credentials are ready.

## API Routes

- `POST /api/validate` - validates idea with OpenRouter and stores report
- `GET /api/ideas` - returns all ideas
- `GET /api/ideas/:id` - returns one idea
- `DELETE /api/ideas/:id` - deletes one idea

## Prompts Used (Exact)

Source: `lib/claude.ts`

System behavior in code sends this exact user prompt template to OpenRouter:

```text
You are a startup analyst. Analyze the following startup idea and return a JSON object only.
Return valid raw JSON only. Do not wrap it in markdown. Do not include any explanation text.
Use exactly these 8 keys and no others: problem, customer, market, competitors, tech_stack, risk_level, profit_score, profit_reasoning.

Startup Idea: "{ideaText}"

Return this exact JSON structure:
{
	"problem": "What core problem does this solve? (2-3 sentences)",
	"customer": "Who is the target customer? Be specific about demographics and psychographics. (2-3 sentences)",
	"market": "What is the estimated market size and growth opportunity? (2-3 sentences)",
	"competitors": "List 3-4 main competitors and what makes this idea different.",
	"tech_stack": "Suggested MVP tech stack. Keep it practical and concise.",
	"risk_level": "Low | Medium | High",
	"profit_score": 72,
	"profit_reasoning": "Why did you give this profitability score? (1-2 sentences)"
}
```

OpenRouter request settings used in code:

- Endpoint: `https://openrouter.ai/api/v1/chat/completions`
- Model: `OPENROUTER_MODEL` env var (fallback `anthropic/claude-sonnet-4`)
- Temperature: `0.2`
- Max tokens: `1024`
- Response format: `json_object`

## Build for Production

```bash
npm run build
npm run start
```
