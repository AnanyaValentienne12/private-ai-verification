import { describe, expect, it } from "vitest";
import type { EligibilityPolicy } from "../types/policy";
import { AppError } from "../utils/errors";
import { validatePolicySemantics } from "../utils/policy-validator";

function policy(overrides: Partial<EligibilityPolicy> = {}): EligibilityPolicy {
  return {
    version: 1,
    logic: "AND",
    rules: [{ field: "age", operator: ">=", value: 21 }],
    ...overrides,
  };
}

describe("validatePolicySemantics", () => {
  it("accepts a valid age and income policy", () => {
    const result = validatePolicySemantics(
      policy({
        rules: [
          { field: "age", operator: ">=", value: 21 },
          { field: "income", operator: ">=", value: 4000, unit: "USD_MONTHLY" },
        ],
      }),
    );

    expect(result.rules).toHaveLength(2);
  });

  it("rejects fractional income", () => {
    expect(() =>
      validatePolicySemantics(
        policy({
          rules: [{ field: "income", operator: ">=", value: 4000.5, unit: "USD_MONTHLY" }],
        }),
      ),
    ).toThrow(AppError);
  });

  it("rejects negative income", () => {
    expect(() =>
      validatePolicySemantics(
        policy({
          rules: [{ field: "income", operator: ">=", value: -1000, unit: "USD_MONTHLY" }],
        }),
      ),
    ).toThrow(AppError);
  });

  it("rejects an empty rule list", () => {
    expect(() => validatePolicySemantics(policy({ rules: [] }))).toThrow(AppError);
  });

  it("rejects absurd ages", () => {
    expect(() =>
      validatePolicySemantics(
        policy({
          rules: [{ field: "age", operator: ">=", value: 200 }],
        }),
      ),
    ).toThrow(AppError);
  });

  it("rejects Infinity", () => {
    expect(() =>
      validatePolicySemantics(
        policy({
          rules: [{ field: "age", operator: ">=", value: Number.POSITIVE_INFINITY }],
        }),
      ),
    ).toThrow(AppError);
  });

  it("rejects impossible AND age ranges", () => {
    expect(() =>
      validatePolicySemantics(
        policy({
          rules: [
            { field: "age", operator: ">=", value: 30 },
            { field: "age", operator: "<", value: 18 },
          ],
        }),
      ),
    ).toThrow(AppError);
  });
});
