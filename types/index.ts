export type RiskLevel = "Low" | "Medium" | "High";

export interface ValidationReport {
  problem: string;
  customer: string;
  market: string;
  competitors: string;
  tech_stack: string;
  risk_level: RiskLevel;
  profit_score: number;
  profit_reasoning?: string;
}

export interface IdeaRecord extends ValidationReport {
  id: string;
  created_at: string;
  idea_text: string;
  raw_response: string | null;
}

export interface ValidateIdeaPayload {
  idea_text: string;
}
