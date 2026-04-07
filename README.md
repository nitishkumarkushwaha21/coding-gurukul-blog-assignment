# AI Startup Validator

An App Router Next.js project for validating startup ideas with an AI-generated report, clean dashboard history, and PDF export. The current scaffold supports both real services and dummy environment variables for local mock-mode development.

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn-inspired component structure
- Supabase
- OpenRouter API
- jsPDF

## Setup

1. Install dependencies.
2. Update `.env.local` with real values when ready.
3. Run `npm run dev`.

## Environment Variables

```bash
OPENROUTER_API_KEY=dummy_openrouter_api_key
OPENROUTER_MODEL=anthropic/claude-sonnet-4
NEXT_PUBLIC_SUPABASE_URL=https://dummy-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy_supabase_anon_key
```

When dummy values are present, the app uses mock data so development can begin before backend credentials are ready.
