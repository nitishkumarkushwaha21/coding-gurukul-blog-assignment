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
    problem: extractField(normalized, "problem", ["customer", "market", "competitors", "risk_level", "profit_score", "profit_reasoning"]),
    customer: extractField(normalized, "customer", ["market", "competitors", "risk_level", "profit_score", "profit_reasoning"]),
    market: extractField(normalized, "market", ["competitors", "risk_level", "profit_score", "profit_reasoning"]),
    competitors: extractField(normalized, "competitors", ["risk_level", "profit_score", "profit_reasoning"]),
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
Use exactly these 7 keys and no others: ${REPORT_KEYS.join(", ")}.

Startup Idea: "${ideaText}"

Return this exact JSON structure:
{
  "problem": "What core problem does this solve? (2-3 sentences)",
  "customer": "Who is the target customer? Be specific about demographics and psychographics. (2-3 sentences)",
  "market": "What is the estimated market size and growth opportunity? (2-3 sentences)",
  "competitors": "List 3-4 main competitors and what makes this idea different.",
  "risk_level": "Low | Medium | High",
  "profit_score": 7,
  "profit_reasoning": "Why did you give this profitability score? (1-2 sentences)"
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
    risk_level:
      parsed.risk_level === "Low" || parsed.risk_level === "Medium" || parsed.risk_level === "High"
        ? parsed.risk_level
        : "Medium",
    profit_score:
      typeof parsed.profit_score === "number" && parsed.profit_score >= 1 && parsed.profit_score <= 10
        ? parsed.profit_score
        : 5,
    profit_reasoning: parsed.profit_reasoning ?? "No profitability reasoning returned."
  };
}
