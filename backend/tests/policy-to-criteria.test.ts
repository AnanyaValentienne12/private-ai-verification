import { describe, expect, it } from "vitest";
import { toPublicCriteria, tryToPublicCriteria } from "../midnight/policy-to-criteria";
import type { EligibilityPolicy } from "../types/policy";
import { AppError } from "../utils/errors";

function policy(overrides: Partial<EligibilityPolicy> = {}): EligibilityPolicy {
  return {
    version: 1,
    logic: "AND",
    rules: [
      { field: "age", operator: ">=", value: 21 },
      { field: "income", operator: ">=", value: 4000, unit: "USD_MONTHLY" },
    ],
    ...overrides,
  };
}

describe("toPublicCriteria", () => {
  it("maps the MVP age and monthly income policy onto Compact thresholds", () => {
    expect(toPublicCriteria(policy())).toEqual({ minAge: 21, minIncome: 4000 });
  });

  it("defaults a missing field to 0 so the unused Compact assert still passes", () => {
    expect(
      toPublicCriteria(
        policy({
          rules: [{ field: "age", operator: ">=", value: 21 }],
        }),
      ),
    ).toEqual({ minAge: 21, minIncome: 0 });

    expect(
      toPublicCriteria(
        policy({
          rules: [{ field: "income", operator: ">=", value: 4000, unit: "USD_MONTHLY" }],
        }),
      ),
    ).toEqual({ minAge: 0, minIncome: 4000 });
  });

  it("maps exclusive lower bounds onto the next integer for Compact >=", () => {
    expect(
      toPublicCriteria(
        policy({
          rules: [
            { field: "age", operator: ">", value: 21 },
            { field: "income", operator: ">", value: 4000, unit: "USD_MONTHLY" },
          ],
        }),
      ),
    ).toEqual({ minAge: 22, minIncome: 4001 });
  });

  it("keeps the strictest lower bound when AND combines compatible rules", () => {
    expect(
      toPublicCriteria(
        policy({
          rules: [
            { field: "age", operator: ">=", value: 18 },
            { field: "age", operator: ">", value: 21 },
            { field: "income", operator: ">=", value: 3000, unit: "USD_MONTHLY" },
            { field: "income", operator: ">=", value: 4000, unit: "USD_MONTHLY" },
          ],
        }),
      ),
    ).toEqual({ minAge: 22, minIncome: 4000 });
  });

  it("rejects OR logic that Compact cannot express", () => {
    expect(() => toPublicCriteria(policy({ logic: "OR" }))).toThrow(AppError);
    expect(tryToPublicCriteria(policy({ logic: "OR" }))).toBeNull();
  });

  it("rejects upper-bound and equality operators the circuit does not implement", () => {
    const lessThan = policy({
      rules: [{ field: "age", operator: "<", value: 65 }],
    });
    const lessOrEqual = policy({
      rules: [{ field: "age", operator: "<=", value: 65 }],
    });
    const equal = policy({
      rules: [{ field: "age", operator: "==", value: 21 }],
    });

    expect(() => toPublicCriteria(lessThan)).toThrow(AppError);
    expect(() => toPublicCriteria(lessOrEqual)).toThrow(AppError);
    expect(() => toPublicCriteria(equal)).toThrow(AppError);
    expect(tryToPublicCriteria(lessThan)).toBeNull();
    expect(tryToPublicCriteria(lessOrEqual)).toBeNull();
    expect(tryToPublicCriteria(equal)).toBeNull();
  });
});
