import type { EligibilityPolicy, MidnightPublicCriteria, PolicyRule } from "../types/policy";
import { AppError } from "../utils/errors";

const UINT32_MAX = 4_294_967_295;

/**
 * Maps a validated EligibilityPolicy onto the existing Compact circuit:
 *   assert(age >= minAge); assert(income >= minIncome);
 *
 * The circuit is a conjunction of two lower bounds. Applicant values are not
 * used here; they remain private witnesses in executeVerification.
 */
export function toPublicCriteria(policy: EligibilityPolicy): MidnightPublicCriteria {
  if (policy.logic !== "AND") {
    throw new AppError(
      422,
      "UNSUPPORTED_POLICY",
      "The requirement could not be converted into a supported policy.",
    );
  }

  let minAge = 0;
  let minIncome = 0;
  let hasAge = false;
  let hasIncome = false;

  for (const rule of policy.rules) {
    const lowerBound = lowerBoundForCircuit(rule);
    if (rule.field === "age") {
      hasAge = true;
      minAge = Math.max(minAge, lowerBound);
    } else {
      hasIncome = true;
      minIncome = Math.max(minIncome, lowerBound);
    }
  }

  if (!hasAge && !hasIncome) {
    throw new AppError(
      422,
      "INVALID_POLICY",
      "The requirement could not be converted into a supported policy.",
    );
  }

  return { minAge, minIncome };
}

export function tryToPublicCriteria(policy: EligibilityPolicy): MidnightPublicCriteria | null {
  try {
    return toPublicCriteria(policy);
  } catch (error) {
    if (error instanceof AppError && (error.code === "UNSUPPORTED_POLICY" || error.code === "INVALID_POLICY")) {
      return null;
    }
    throw error;
  }
}

function lowerBoundForCircuit(rule: PolicyRule): number {
  if (rule.operator === ">=") {
    return rule.value;
  }

  if (rule.operator === ">") {
    if (rule.value >= UINT32_MAX) {
      throw new AppError(
        422,
        "UNSUPPORTED_POLICY",
        "The requirement could not be converted into a supported policy.",
      );
    }
    return rule.value + 1;
  }

  throw new AppError(
    422,
    "UNSUPPORTED_POLICY",
    "The requirement could not be converted into a supported policy.",
  );
}
