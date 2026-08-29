import cors from "cors";
import express, { type Express } from "express";
import { getCorsOrigins, getEnv } from "../config/env";
import { AppError } from "../utils/errors";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { requestIdMiddleware } from "./middleware/request-id.middleware";
import { policyRoutes } from "./routes/policy.routes";

export function createApp(): Express {
  const env = getEnv();
  const app = express();

  app.disable("x-powered-by");
  app.use(requestIdMiddleware);
  app.use(express.json({ limit: "32kb" }));
  app.use((error: unknown, _req: express.Request, _res: express.Response, next: express.NextFunction) => {
    if (error instanceof SyntaxError) {
      next(new AppError(400, "INVALID_REQUEST", "Invalid request."));
      return;
    }
    next(error);
  });

  const origins = getCorsOrigins(env);
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          callback(null, true);
          return;
        }

        if (origins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error("Origin not allowed by CORS"));
      },
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "x-request-id"],
    }),
  );

  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      service: "eligibility-backend",
    });
  });

  app.use("/api/policy", policyRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
