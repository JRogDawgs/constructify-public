/**
 * CEEBO — Route Registry (Phase 2)
 *
 * Single source of truth for valid Constructify routes.
 * All CEEBO navigation and Training Hub references must validate against this.
 * Prevents hallucinated routes.
 */

/** Canonical valid routes (exact or prefix). Updated when app routes change. */
const VALID_ROUTES: ReadonlySet<string> = new Set([
  '/',
  '/auth',
  '/auth/login',
  '/auth/register',
  '/auth/onboarding',
  '/auth/company-signup',
  '/auth/plan-selection',
  '/auth/post-payment-wizard',
  '/auth/post-payment-success',
  '/dashboard',
  '/dashboard/projects',
  '/dashboard/projects/create',
  '/dashboard/projects/[projectId]',
  '/dashboard/projects/[projectId]/team',
  '/dashboard/projects/[projectId]/schedule',
  '/dashboard/projects/[projectId]/schedule/edit',
  '/dashboard/projects/[projectId]/settings',
  '/dashboard/projects/[projectId]/edit',
  '/dashboard/projects/[projectId]/files',
  '/dashboard/projects/[projectId]/boundary',
  '/dashboard/tasks',
  '/dashboard/tasks/assign',
  '/dashboard/tasks/create',
  '/dashboard/tasks/[taskId]',
  '/dashboard/schedule',
  '/dashboard/scheduling',
  '/dashboard/scheduling/shift',
  '/dashboard/settings',
  '/dashboard/profile',
  '/dashboard/profile/request-pto',
  '/dashboard/messaging',
  '/dashboard/admin',
  '/dashboard/admin/team',
  '/dashboard/admin/team/add-user',
  '/dashboard/admin/team/[userId]',
  '/dashboard/admin/team/[userId]/assign-project',
  '/dashboard/admin/reports',
  '/dashboard/admin/reports/timecards',
  '/dashboard/admin/reports/attendance-exceptions',
  '/dashboard/admin/reports/payroll-by-worker',
  '/dashboard/admin/reports/payroll-by-project',
  '/dashboard/admin/reports/jobsite-roster',
  '/dashboard/admin/reports/daily-labor-report',
  '/dashboard/admin/reports/hours-by-supervisor',
  '/dashboard/admin/reports/idle-workers',
  '/dashboard/admin/reports/worker-utilization',
  '/dashboard/admin/reports/overtime',
  '/dashboard/admin/billing',
  '/dashboard/admin/settings',
  '/dashboard/admin/safety',
  '/dashboard/admin/activity',
  '/dashboard/admin/video-library',
  '/dashboard/admin/system-sync',
  '/dashboard/admin/training',
  '/dashboard/supervisor',
  '/dashboard/workers',
  '/worker/dashboard',
  '/worker/dashboard/tasks',
  '/worker/dashboard/schedule',
  '/worker/dashboard/reports',
  '/supervisor/dashboard',
]);

/** Route prefixes that match dynamic segments (e.g. /dashboard/projects/xyz) */
const ROUTE_PREFIXES: readonly string[] = [
  '/dashboard/projects/',
  '/dashboard/tasks/',
  '/dashboard/admin/team/',
  '/worker/dashboard/tasks/',
];

function normalizeForCheck(route: string): string {
  const r = route.split('?')[0].replace(/\/$/, '') || '/';
  return r.startsWith('/') ? r : `/${r}`;
}

/**
 * Phase 2: Validate route exists in registry.
 * Returns true if route is registered (exact or matches dynamic pattern).
 */
export function validateRouteExists(route: string): boolean {
  if (!route || typeof route !== 'string') return false;
  const norm = normalizeForCheck(route);

  if (VALID_ROUTES.has(norm)) return true;

  for (const prefix of ROUTE_PREFIXES) {
    if (norm.startsWith(prefix) && norm.length > prefix.length) {
      return true;
    }
  }

  return false;
}

/** Get all registered routes (for debug/inspection) */
export function getRegisteredRoutes(): string[] {
  return [...VALID_ROUTES];
}
