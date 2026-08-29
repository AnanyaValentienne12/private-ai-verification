import { Router } from "express";
import { parsePolicyRequestSchema } from "../../schemas/policy.schema";
import { parsePolicy } from "../controllers/policy.controller";
import { validateBody } from "../middleware/validate.middleware";

const router = Router();

router.post("/parse", validateBody(parsePolicyRequestSchema), parsePolicy);

export const policyRoutes = router;
