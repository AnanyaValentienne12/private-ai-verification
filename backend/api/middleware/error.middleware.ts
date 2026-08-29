import type { NextFunction, Request, Response } from "express";
import { AppError, isAppError } from "../../utils/errors";
import { log } from "../../utils/logger";

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, "INVALID_REQUEST", "Route not found."));
}

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof Error && error.message === "Origin not allowed by CORS") {
    res.status(403).json({
      success: false,
      error: {
        code: "INVALID_REQUEST",
        message: "Origin not allowed.",
      },
    });
    return;
  }

  if (isAppError(error)) {
    if (error.statusCode >= 500) {
      log("error", "http.error", {
        requestId: req.requestId,
        code: error.code,
        statusCode: error.statusCode,
      });
    }

    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.expose ? error.message : "An unexpected error occurred.",
      },
    });
    return;
  }

  log("error", "http.unhandled", { requestId: req.requestId });

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred.",
    },
  });
}
