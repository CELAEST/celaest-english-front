/**
 * Application Route Definitions
 * Centralized paths for clean navigation and URL management
 */

export const ROUTES = {
  HOME: '/',
  WORKSPACE: '/workspace',
  READING: '/reading',
  WRITING: '/writing',
  INTERVIEW: '/interview',
  MEMORY: '/memory',
  SETTINGS: '/settings',
  ONBOARDING: '/onboarding',
} as const;

export type RouteKey = keyof typeof ROUTES;
