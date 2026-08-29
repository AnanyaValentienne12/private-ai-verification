import {
  eligibilityPolicySchema,
  supportedFieldSchema,
  supportedOperatorSchema,
} from "../schemas/policy.schema";
import type { EligibilityPolicy, PolicyOperator, PolicyRule } from "../types/policy";
import { AppError } from "./errors";

const MIN_AGE = 0;
const MAX_AGE = 120;
const MIN_INCOME = 0;
const MAX_INCOME = 1_000_000_000;

interface NumericInterval {
  min: number;
  max: number;
  minInclusive: boolean;
  maxInclusive: boolean;
}

export function validatePolicySemantics(policy: EligibilityPolicy): EligibilityPolicy {
  const parsed = eligibilityPolicySchema.safeParse(policy);
  if (!parsed.success) {
    throw new AppError(
      422,
      "INVALID_POLICY",
      "The requirement could not be converted into a supported policy.",
    );
  }

  const normalized = parsed.data;

  if (normalized.rules.length === 0) {
    throw new AppError(
      422,
      "INVALID_POLICY",
      "The requirement could not be converted into a supported policy.",
    );
  }

  for (const rule of normalized.rules) {
    validateRule(rule);
  }

  if (normalized.logic === "AND" && hasImpossibleConjunction(normalized.rules)) {
    throw new AppError(
      422,
      "INVALID_POLICY",
      "The requirement could not be converted into a supported policy.",
    );
  }

  return normalized;
}

function validateRule(rule: PolicyRule): void {
  if (!supportedFieldSchema.safeParse(rule.field).success) {
    throw new AppError(
      422,
      "UNSUPPORTED_POLICY",
      "The requirement could not be converted into a supported policy.",
    );
  }

  if (!supportedOperatorSchema.safeParse(rule.operator).success) {
    throw new AppError(
      422,
      "INVALID_POLICY",
      "The requirement could not be converted into a supported policy.",
    );
  }

  if (typeof rule.value !== "number" || !Number.isFinite(rule.value)) {
    throw new AppError(
      422,
      "INVALID_POLICY",
      "The requirement could not be converted into a supported policy.",
    );
  }

  if (rule.field === "age") {
    if (!Number.isSafeInteger(rule.value) || rule.value < MIN_AGE || rule.value > MAX_AGE) {
      throw new AppError(
        422,
        "INVALID_POLICY",
        "The requirement could not be converted into a supported policy.",
      );
    }
  }

  if (rule.field === "income") {
    if (
      !Number.isSafeInteger(rule.value) ||
      rule.value < MIN_INCOME ||
      rule.value > MAX_INCOME
    ) {
      throw new AppError(
        422,
        "INVALID_POLICY",
        "The requirement could not be converted into a supported policy.",
      );
    }
    if (rule.unit !== "USD_MONTHLY") {
      throw new AppError(
        422,
        "INVALID_POLICY",
        "The requirement could not be converted into a supported policy.",
      );
    }
  }
}

function hasImpossibleConjunction(rules: PolicyRule[]): boolean {
  const byField = new Map<string, PolicyRule[]>();
  for (const rule of rules) {
    const existing = byField.get(rule.field) ?? [];
    existing.push(rule);
    byField.set(rule.field, existing);
  }

  for (const fieldRules of byField.values()) {
    let interval: NumericInterval | null = {
      min: Number.NEGATIVE_INFINITY,
      max: Number.POSITIVE_INFINITY,
      minInclusive: false,
      maxInclusive: false,
    };

    for (const rule of fieldRules) {
      interval = intersect(interval, toInterval(rule.operator, rule.value));
      if (interval === null) {
        return true;
      }
    }
  }

  return false;
}

function toInterval(operator: PolicyOperator, value: number): NumericInterval {
  switch (operator) {
    case ">":
      return { min: value, max: Number.POSITIVE_INFINITY, minInclusive: false, maxInclusive: false };
    case ">=":
      return { min: value, max: Number.POSITIVE_INFINITY, minInclusive: true, maxInclusive: false };
    case "<":
      return { min: Number.NEGATIVE_INFINITY, max: value, minInclusive: false, maxInclusive: false };
    case "<=":
      return { min: Number.NEGATIVE_INFINITY, max: value, minInclusive: false, maxInclusive: true };
    case "==":
      return { min: value, max: value, minInclusive: true, maxInclusive: true };
  }
}

function intersect(a: NumericInterval, b: NumericInterval): NumericInterval | null {
  const min = Math.max(a.min, b.min);
  const max = Math.min(a.max, b.max);
  const minInclusive =
    (min === a.min ? a.minInclusive : true) && (min === b.min ? b.minInclusive : true);
  const maxInclusive =
    (max === a.max ? a.maxInclusive : true) && (max === b.max ? b.maxInclusive : true);

  if (min > max) {
    return null;
  }

  if (min === max && (!minInclusive || !maxInclusive)) {
    return null;
  }

  return { min, max, minInclusive, maxInclusive };
}
