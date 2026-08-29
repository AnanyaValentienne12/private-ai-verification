import OpenAI from "openai";
import { getEnv } from "../config/env";
import { AppError } from "../utils/errors";
import { log } from "../utils/logger";
import { buildUserPrompt, POLICY_JSON_SCHEMA, SYSTEM_PROMPT } from "./prompts";

export interface AiClient {
  generateStructuredPolicy(requirement: string): Promise<unknown>;
}

function createOpenAiClient(): OpenAI {
  const env = getEnv();
  return new OpenAI({
    apiKey: env.AI_API_KEY,
    baseURL: env.AI_BASE_URL,
    timeout: env.AI_TIMEOUT_MS,
  });
}

export async function generateStructuredPolicy(requirement: string): Promise<unknown> {
  const env = getEnv();
  const client = createOpenAiClient();

  try {
    const completion = await client.chat.completions.create({
      model: env.AI_MODEL,
      temperature: 0,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(requirement) },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "eligibility_policy",
          strict: true,
          schema: POLICY_JSON_SCHEMA as unknown as Record<string, unknown>,
        },
      },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new AppError(
        502,
        "AI_PROVIDER_ERROR",
        "The eligibility requirement could not be processed.",
      );
    }
    if (content.length > 16_384) {
      throw new AppError(
        422,
        "INVALID_POLICY",
        "The requirement could not be converted into a supported policy.",
      );
    }

    return parseModelContent(content);
  } catch (error) {
    throw mapProviderError(error);
  }
}

export function parseModelContent(content: string): unknown {
  const trimmed = stripFence(content.trim());
  if (trimmed.length > 16_384) {
    throw new AppError(
      422,
      "INVALID_POLICY",
      "The requirement could not be converted into a supported policy.",
    );
  }
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    throw new AppError(
      422,
      "INVALID_POLICY",
      "The requirement could not be converted into a supported policy.",
    );
  }
}

function stripFence(content: string): string {
  const match = content.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return match?.[1] ?? content;
}

function mapProviderError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  const status = getErrorStatus(error);
  const code = typeof error === "object" && error !== null && "code" in error
    ? String((error as { code?: unknown }).code)
    : "";

  if (code === "ETIMEDOUT" || code === "ERR_CANCELED" || status === 408 || status === 504) {
    log("error", "ai.provider.timeout");
    return new AppError(502, "AI_TIMEOUT", "The eligibility requirement could not be processed.");
  }

  if (status === 429) {
    log("error", "ai.provider.rate_limit");
    return new AppError(502, "AI_PROVIDER_ERROR", "The eligibility requirement could not be processed.");
  }

  log("error", "ai.provider.failure", { status: status ?? "unknown" });
  return new AppError(502, "AI_PROVIDER_ERROR", "The eligibility requirement could not be processed.");
}

function getErrorStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) {
    return undefined;
  }

  if ("status" in error && typeof error.status === "number") {
    return error.status;
  }

  if (
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "status" in error.response &&
    typeof error.response.status === "number"
  ) {
    return error.response.status;
  }

  return undefined;
}

export const openAiClient: AiClient = {
  generateStructuredPolicy,
};

