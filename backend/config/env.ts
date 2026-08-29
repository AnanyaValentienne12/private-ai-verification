import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  AI_API_KEY: z.string().min(1, "AI_API_KEY is required"),
  AI_MODEL: z.string().min(1).default("gpt-4o-mini"),
  AI_BASE_URL: z.string().url().optional(),
  AI_TIMEOUT_MS: z.coerce.number().int().positive().default(30000),
  CORS_ORIGINS: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | undefined;

export function loadEnv(overrides: Record<string, string | undefined> = {}): Env {
  const parsed = envSchema.safeParse({
    NODE_ENV: overrides.NODE_ENV ?? process.env.NODE_ENV,
    PORT: overrides.PORT ?? process.env.PORT,
    AI_API_KEY: overrides.AI_API_KEY ?? process.env.AI_API_KEY,
    AI_MODEL: overrides.AI_MODEL ?? process.env.AI_MODEL,
    AI_BASE_URL: overrides.AI_BASE_URL ?? process.env.AI_BASE_URL,
    AI_TIMEOUT_MS: overrides.AI_TIMEOUT_MS ?? process.env.AI_TIMEOUT_MS,
    CORS_ORIGINS: overrides.CORS_ORIGINS ?? process.env.CORS_ORIGINS,
  });

  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => issue.message).join("; ");
    throw new Error(`Invalid environment configuration: ${details}`);
  }

  cached = parsed.data;
  return parsed.data;
}

export function getEnv(): Env {
  if (!cached) {
    cached = loadEnv();
  }
  return cached;
}

export function resetEnvCache(): void {
  cached = undefined;
}

export function getCorsOrigins(env: Env = getEnv()): string[] {
  if (env.CORS_ORIGINS && env.CORS_ORIGINS.trim().length > 0) {
    return env.CORS_ORIGINS.split(",")
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0);
  }

  if (env.NODE_ENV === "production") {
    return [];
  }

  return ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"];
}
