import { isAxiosError } from "axios";

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
