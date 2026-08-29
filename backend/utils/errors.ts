export type ErrorCode =
  | "INVALID_REQUEST"
  | "INVALID_POLICY"
  | "UNSUPPORTED_POLICY"
  | "AI_PROVIDER_ERROR"
  | "AI_TIMEOUT"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode;
  readonly expose: boolean;

  constructor(statusCode: number, code: ErrorCode, message: string, expose = true) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.expose = expose;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
