import type { NextFunction, Request, Response } from "express";
import { parseRequirement } from "../../ai/policy-parser";
import { parsePolicyRequestSchema } from "../../schemas/policy.schema";
import { AppError } from "../../utils/errors";
import { log } from "../../utils/logger";
import { validatePolicySemantics } from "../../utils/policy-validator";

export async function parsePolicy(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsedBody = parsePolicyRequestSchema.safeParse(req.body);
    if (!parsedBody.success) {
      throw new AppError(400, "INVALID_REQUEST", "Invalid request.");
    }

    const { requirement } = parsedBody.data;

    log("info", "policy.parse.request", {
      requestId: req.requestId,
      requirementLength: requirement.length,
    });

    const policy = validatePolicySemantics(await parseRequirement(requirement));

    log("info", "policy.parse.success", {
      requestId: req.requestId,
      logic: policy.logic,
      ruleCount: policy.rules.length,
    });

    res.status(200).json({
      success: true,
      policy,
    });
  } catch (error) {
    next(error);
  }
}
