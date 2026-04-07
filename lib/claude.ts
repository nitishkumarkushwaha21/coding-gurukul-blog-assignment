import { env, isUsingMockServices } from "@/lib/env";
import { createMockIdeaRecord } from "@/lib/mock-data";
import type { ValidationReport } from "@/types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "anthropic/claude-sonnet-4";
const REPORT_KEYS = [
  "problem",
  "customer",
  "market",
  "competitors",
  "tech_stack",
  "risk_level",
  "profit_score",
  "profit_reasoning"
] as const;

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

function extractJsonObject(content: string) {
  const fencedMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fencedMatch?.[1] ?? content;
  const firstBrace = candidate.indexOf("{");
  const lastBrace = candidate.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Model response did not contain valid JSON");
  }

  return candidate.slice(firstBrace, lastBrace + 1);
}

function sanitizeJsonLikeString(value: string) {
  return value
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]");
}

function extractField(text: string, field: string, nextFields: string[]) {
  const escapedNext = nextFields.map((item) => item.replace("_", "[ _]")).join("|");
  const pattern = escapedNext.length
    ? new RegExp(`${field.replace("_", "[ _]")}\\s*[:\\-]\\s*([\\s\\S]*?)(?=\\n\\s*(?:${escapedNext})\\s*[:\\-]|$)`, "i")
    : new RegExp(`${field.replace("_", "[ _]")}\\s*[:\\-]\\s*([\\s\\S]*)$`, "i");

  return text.match(pattern)?.[1]?.trim();
}

function parseFallbackReport(content: string): Partial<ValidationReport> {
  const normalized = content
    .replace(/\r/g, "")
    .replace(/\*\*/g, "")
    .replace(/^[-*]\s*/gm, "")
    .trim();

  return {
    problem: extractField(normalized, "problem", ["customer", "market", "competitors", "tech_stack", "risk_level", "profit_score", "profit_reasoning"]),
    customer: extractField(normalized, "customer", ["market", "competitors", "tech_stack", "risk_level", "profit_score", "profit_reasoning"]),
    market: extractField(normalized, "market", ["competitors", "tech_stack", "risk_level", "profit_score", "profit_reasoning"]),
    competitors: extractField(normalized, "competitors", ["tech_stack", "risk_level", "profit_score", "profit_reasoning"]),
    tech_stack: extractField(normalized, "tech_stack", ["risk_level", "profit_score", "profit_reasoning"]),
    risk_level: extractField(normalized, "risk_level", ["profit_score", "profit_reasoning"]) as ValidationReport["risk_level"] | undefined,
    profit_score: Number(extractField(normalized, "profit_score", ["profit_reasoning"])),
    profit_reasoning: extractField(normalized, "profit_reasoning", [])
  };
}

function parseModelResponse(content: string): Partial<ValidationReport> {
  try {
    return JSON.parse(sanitizeJsonLikeString(extractJsonObject(content))) as Partial<ValidationReport>;
  } catch {
    return parseFallbackReport(content);
  }
}

export async function validateStartupIdea(
  ideaText: string,
): Promise<ValidationReport> {
  if (!env.openRouterApiKey || isUsingMockServices) {
    const { id, created_at, idea_text, raw_response, ...mock } =
      createMockIdeaRecord(ideaText);
    void id;
    void created_at;
    void idea_text;
    void raw_response;
    return mock;
  }

  const prompt = `
You are a startup analyst. Analyze the following startup idea and return a JSON object only.
Return valid raw JSON only. Do not wrap it in markdown. Do not include any explanation text.
Use exactly these 8 keys and no others: ${REPORT_KEYS.join(", ")}.
Be opinionated and decisive. Do not default to Medium risk or average scores unless the idea is genuinely mixed.

Scoring rubric:
- profit_score must be an integer from 0 to 100
- use 0-30 for weak ideas with low demand, poor differentiation, or difficult economics
- use 31-49 for below-average ideas with clear concerns
- use 50-69 for mixed ideas with meaningful upside and meaningful risk
- use 70-84 for strong ideas with good demand and execution potential
- use 85-100 only for unusually strong and clearly differentiated opportunities

Risk rubric:
- Low: clear demand, realistic execution, and manageable competition
- Medium: some upside but notable execution, market, or competition risk
- High: weak differentiation, unclear market demand, regulatory friction, or hard distribution

Important:
- Avoid clustering around 50-70 unless justified
- Choose Low or High risk when the case is clearly strong or clearly weak
- Make profit_reasoning explicitly justify the score and risk choice

Startup Idea: "${ideaText}"

Return this exact JSON structure:
{
  "problem": "What core problem does this solve? (2-3 sentences)",
  "customer": "Who is the target customer? Be specific about demographics and psychographics. (2-3 sentences)",
  "market": "What is the estimated market size and growth opportunity? (2-3 sentences)",
  "competitors": "List 3-4 main competitors and what makes this idea different.",
  "tech_stack": "Suggested MVP tech stack. Keep it practical and concise.",
  "risk_level": "Low | Medium | High",
  "profit_score": 72,
  "profit_reasoning": "Why did you give this profitability score and risk level? (1-2 sentences)"
}
`.trim();

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.openRouterApiKey}`,
    },
    body: JSON.stringify({
      model: env.openRouterModel || DEFAULT_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
      temperature: 0.2,
      response_format: { type: "json_object" }
    }),
  });

  const result = (await response.json()) as OpenRouterResponse;

  if (!response.ok) {
    throw new Error(result.error?.message || "OpenRouter request failed");
  }

  const content = result.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenRouter returned an empty response");
  }

  const parsed = parseModelResponse(content);

  return {
    problem: parsed.problem ?? "No problem analysis returned.",
    customer: parsed.customer ?? "No customer analysis returned.",
    market: parsed.market ?? "No market analysis returned.",
    competitors: parsed.competitors ?? "No competitor analysis returned.",
    tech_stack: parsed.tech_stack ?? "No suggested tech stack returned.",
    risk_level:
      parsed.risk_level === "Low" || parsed.risk_level === "Medium" || parsed.risk_level === "High"
        ? parsed.risk_level
        : "Medium",
    profit_score:
      typeof parsed.profit_score === "number" && parsed.profit_score >= 0 && parsed.profit_score <= 100
        ? parsed.profit_score
        : 50,
    profit_reasoning: parsed.profit_reasoning ?? "No profitability reasoning returned."
  };
}
