import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns the base URL of the app depending on the environment.
 *
 * - In development: always use localhost
 * - In production: prefer NEXT_PUBLIC_SITE_URL (should be set to https://orti.space),
 *   otherwise fall back to the public orti.space domain as a safe default.
 */
export function getBaseUrl() {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000"
  }

  return process.env.NEXT_PUBLIC_SITE_URL || "https://orti.space"
}
