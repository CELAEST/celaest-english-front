import { ApiError } from "./ApiError";

/**
 * Translates backend error codes and network issues into clean user-facing strings.
 */
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.code) {
      case "NETWORK_ERROR":
        return "Network connection issue. Please check your internet connection.";
      case "UNAUTHORIZED":
        return "Your session has expired. Please log in again.";
      case "RATE_LIMITED":
        return "Too many requests. Please slow down and try again in a moment.";
      case "REQUEST_TIMEOUT":
        return "The request timed out. Please try again.";
      case "PATH_TRAVERSAL_BLOCKED":
      case "REQUEST_BLOCKED":
        return "Request blocked by security policy.";
      default:
        return error.message || "An unexpected error occurred. Please try again.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred.";
};
