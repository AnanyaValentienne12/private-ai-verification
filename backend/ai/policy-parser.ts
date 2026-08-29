import { generateStructuredPolicy } from "./ai-client";
import { aiPolicyOutputSchema } from "../schemas/policy.schema";
import type { EligibilityPolicy, PolicyOperator, PolicyRule } from "../types/policy";
import { AppError } from "../utils/errors";
import { log } from "../utils/logger";
import { validatePolicySemantics } from "../utils/policy-validator";

const MAX_ATTEMPTS = 2;

export type GenerateStructuredPolicy = (requirement: string) => Promise<unknown>;

export async function parseRequirement(
  requirement: string,
  generate: GenerateStructuredPolicy = generateStructuredPolicy,
): Promise<EligibilityPolicy> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const raw = await generate(requirement);
      const parsedJson = coerceJson(raw);
      const aiOutput = aiPolicyOutputSchema.safeParse(parsedJson);

      if (!aiOutput.success) {
        throw new AppError(
          422,
          "INVALID_POLICY",
          "The requirement could not be converted into a supported policy.",
        );
      }

      if (aiOutput.data.status === "unsupported") {
        log("warn", "policy.unsupported", { attempt });
        throw new AppError(
          422,
          "UNSUPPORTED_POLICY",
          "The requirement could not be converted into a supported policy.",
        );
      }

      if (aiOutput.data.status === "ok" && aiOutput.data.logic === undefined) {
        throw new AppError(
          422,
          "INVALID_POLICY",
          "The requirement could not be converted into a supported policy.",
        );
      }

      const policy = normalizePolicy(aiOutput.data);
      return validatePolicySemantics(policy);
    } catch (error) {
      lastError = error;
      const retryable = isMalformedOutput(error) && attempt < MAX_ATTEMPTS;
      if (!retryable) {
        if (isMalformedOutput(error)) {
          log("warn", "policy.validation_failed", { attempt });
        }
        throw error;
      }
      log("warn", "policy.retry_malformed_output", { attempt });
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new AppError(
        422,
        "INVALID_POLICY",
        "The requirement could not be converted into a supported policy.",
      );
}

function coerceJson(raw: unknown): unknown {
  if (typeof raw === "string") {
    const trimmed = raw.trim();
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

  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new AppError(
      422,
      "INVALID_POLICY",
      "The requirement could not be converted into a supported policy.",
    );
  }

  return raw;
}

function normalizePolicy(output: {
  version?: number;
  logic?: "AND" | "OR";
  rules: Array<{
    field: string;
    operator: string;
    value: number;
    unit?: string | null;
  }>;
}): EligibilityPolicy {
  if (output.rules.length === 0) {
    throw new AppError(
      422,
      "INVALID_POLICY",
      "The requirement could not be converted into a supported policy.",
    );
  }

  const rules: PolicyRule[] = output.rules.map((rule) => {
    if (rule.field !== "age" && rule.field !== "income") {
      throw new AppError(
        422,
        "UNSUPPORTED_POLICY",
        "The requirement could not be converted into a supported policy.",
      );
    }

    if (!isOperator(rule.operator)) {
      throw new AppError(
        422,
        "INVALID_POLICY",
        "The requirement could not be converted into a supported policy.",
      );
    }

    if (rule.field === "age") {
      if (rule.unit !== undefined && rule.unit !== null && rule.unit !== "NONE") {
        throw new AppError(
          422,
          "INVALID_POLICY",
          "The requirement could not be converted into a supported policy.",
        );
      }

      return {
        field: "age",
        operator: rule.operator,
        value: rule.value,
      };
    }

    if (rule.unit !== "USD_MONTHLY") {
      throw new AppError(
        422,
        "UNSUPPORTED_POLICY",
        "The requirement could not be converted into a supported policy.",
      );
    }

    return {
      field: "income",
      operator: rule.operator,
      value: rule.value,
      unit: "USD_MONTHLY",
    };
  });

  if (output.logic === undefined) {
    throw new AppError(
      422,
      "INVALID_POLICY",
      "The requirement could not be converted into a supported policy.",
    );
  }

  return {
    version: 1,
    logic: output.logic,
    rules,
  };
}

function isOperator(value: string): value is PolicyOperator {
  return value === ">=" || value === "<=" || value === ">" || value === "<" || value === "==";
}

function isMalformedOutput(error: unknown): boolean {
  return error instanceof AppError && error.code === "INVALID_POLICY";
}
