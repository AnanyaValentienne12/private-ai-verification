import { z } from "zod";
import {
  INCOME_UNITS,
  POLICY_FIELDS,
  POLICY_LOGIC,
  POLICY_OPERATORS,
  POLICY_VERSION,
} from "../types/policy";

export const parsePolicyRequestSchema = z
  .object({
    requirement: z
      .string({ required_error: "requirement is required" })
      .trim()
      .min(3, "requirement is too short")
      .max(4000, "requirement exceeds maximum length"),
  })
  .strict();

export type ParsePolicyRequest = z.infer<typeof parsePolicyRequestSchema>;

const incomeUnitSchema = z.enum(INCOME_UNITS);

export const aiRuleSchema = z
  .object({
    field: z.string().min(1).max(32),
    operator: z.string().min(1).max(8),
    value: z.number({ invalid_type_error: "value must be numeric" }).finite().int().safe(),
    unit: z.string().max(32).nullable().optional(),
  })
  .strict();

export const aiPolicyOutputSchema = z
  .object({
    status: z.enum(["ok", "unsupported"]),
    reason: z.string().max(500).optional().default(""),
    version: z.number().int().optional(),
    logic: z.enum(POLICY_LOGIC).optional(),
    rules: z.array(aiRuleSchema).max(16).optional().default([]),
  })
  .strict();

export type AiPolicyOutput = z.infer<typeof aiPolicyOutputSchema>;

export const ageRuleSchema = z
  .object({
    field: z.literal("age"),
    operator: z.enum(POLICY_OPERATORS),
    value: z.number().int().finite().safe(),
  })
  .strict();

export const incomeRuleSchema = z
  .object({
    field: z.literal("income"),
    operator: z.enum(POLICY_OPERATORS),
    value: z.number().int().finite().safe(),
    unit: incomeUnitSchema,
  })
  .strict();

export const eligibilityPolicySchema = z
  .object({
    version: z.literal(POLICY_VERSION),
    logic: z.enum(POLICY_LOGIC),
    rules: z.array(z.union([ageRuleSchema, incomeRuleSchema])).min(1).max(16),
  })
  .strict();

export const supportedFieldSchema = z.enum(POLICY_FIELDS);
export const supportedOperatorSchema = z.enum(POLICY_OPERATORS);
