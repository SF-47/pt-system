import { isAxiosError } from "axios";

/**
 * Extracts a useful, user-facing message from an API error.
 *
 * Backend errors come back in one of two shapes:
 * - business-rule errors: `{ message: "..." }` (e.g. conflicts, inactive
 *   client, empty plan)
 * - ASP.NET Core's automatic DataAnnotations validation failures:
 *   `{ title: "...", errors: { FieldName: ["message", ...] } }`
 *
 * Falls back to `fallback` when neither shape yields anything usable.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError(error)) {
    return fallback;
  }

  const data = error.response?.data as
    | {
        message?: unknown;
        errors?: Record<string, unknown>;
        title?: unknown;
      }
    | undefined;

  if (!data) {
    return fallback;
  }

  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (data.errors && typeof data.errors === "object") {
    for (const fieldErrors of Object.values(data.errors)) {
      if (Array.isArray(fieldErrors) && typeof fieldErrors[0] === "string") {
        return fieldErrors[0];
      }
    }
  }

  if (typeof data.title === "string" && data.title.trim()) {
    return data.title;
  }

  return fallback;
}
