import { isDummyEnvValue } from "@/lib/utils";

export const env = {
  openRouterApiKey: process.env.OPENROUTER_API_KEY,
  openRouterModel: process.env.OPENROUTER_MODEL,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

export const isUsingMockServices =
  isDummyEnvValue(env.openRouterApiKey) ||
  isDummyEnvValue(env.supabaseUrl) ||
  isDummyEnvValue(env.supabaseAnonKey);
