export const POLICY_FIELDS = ["age", "income"] as const;
export type PolicyField = (typeof POLICY_FIELDS)[number];

export const POLICY_OPERATORS = [">=", "<=", ">", "<", "=="] as const;
export type PolicyOperator = (typeof POLICY_OPERATORS)[number];

export const POLICY_LOGIC = ["AND", "OR"] as const;
export type PolicyLogic = (typeof POLICY_LOGIC)[number];

export const INCOME_UNITS = ["USD_MONTHLY"] as const;
export type IncomeUnit = (typeof INCOME_UNITS)[number];

export const POLICY_VERSION = 1;

export interface AgeRule {
  field: "age";
  operator: PolicyOperator;
  value: number;
}

export interface IncomeRule {
  field: "income";
  operator: PolicyOperator;
  value: number;
  unit: IncomeUnit;
}

export type PolicyRule = AgeRule | IncomeRule;

/**
 * Flat eligibility policy for a future Midnight/Compact adapter.
 * One top-level combinator and a list of atomic predicates. No nested AST.
 * This backend never evaluates these rules against applicant values.
 */
export interface EligibilityPolicy {
  version: typeof POLICY_VERSION;
  logic: PolicyLogic;
  rules: PolicyRule[];
}

/**
 * Public circuit arguments for the existing Compact `verifyEligibility`
 * circuit. These are thresholds only — never applicant age or income.
 */
export interface MidnightPublicCriteria {
  minAge: number;
  minIncome: number;
}

/**
 * Handoff from the AI policy layer to `executeVerification` in
 * `private-ai-verification/mainAPI.ts`. Applicant values stay in the witness.
 */
export interface MidnightPolicyBinding {
  policy: EligibilityPolicy;
  publicCriteria: MidnightPublicCriteria;
}
