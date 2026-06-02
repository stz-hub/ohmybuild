/**
 * Hiérarchie d'erreurs métier + handler unique pour les Route Handlers.
 *
 * Côté code : `throw new ValidationError(...)`, `throw new NotFoundError(...)`.
 * Côté Route Handler : wrapper `handleApiError(error)` qui produit la réponse.
 */
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ErrorDetail = {
  field?: string;
  code: string;
  message: string;
};

export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: ErrorDetail[];

  constructor(status: number, code: string, message: string, details?: ErrorDetail[]) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: ErrorDetail[]) {
    super(400, "VALIDATION_ERROR", message, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(401, "UNAUTHENTICATED", message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "You are not allowed to access this resource") {
    super(403, "FORBIDDEN", message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(404, "NOT_FOUND", message);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(409, "CONFLICT", message);
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests") {
    super(429, "RATE_LIMITED", message);
  }
}

/**
 * Convertit une ZodError en payload détaillé prêt pour ValidationError.
 */
export function zodErrorToDetails(err: ZodError): ErrorDetail[] {
  return err.errors.map((e) => ({
    field: e.path.join(".") || undefined,
    code: e.code,
    message: e.message,
  }));
}

/**
 * Handler unique pour Route Handlers. Logge côté serveur, masque les détails
 * internes en prod, renvoie un JSON normalisé `{ error: { code, message, details? } }`.
 */
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    const ve = new ValidationError("Invalid request payload", zodErrorToDetails(error));
    return jsonError(ve);
  }
  if (error instanceof AppError) {
    if (error.status >= 500) {
      console.error("[AppError 5xx]", error);
    }
    return jsonError(error);
  }
  console.error("[Unhandled error]", error);
  const internal = new AppError(
    500,
    "INTERNAL_ERROR",
    process.env.NODE_ENV === "production" ? "Internal Server Error" : String(error),
  );
  return jsonError(internal);
}

function jsonError(error: AppError): NextResponse {
  return NextResponse.json(
    {
      error: {
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      },
    },
    { status: error.status },
  );
}
