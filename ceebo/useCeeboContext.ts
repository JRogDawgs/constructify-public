/**
 * CEEBO — Route-aware context for AI copilot
 *
 * Provides current route, normalized context, and system prompt injection
 * for contextual AI assistance.
 */

import { usePathname } from 'expo-router';
import { useMemo } from 'react';
import { getCeeboRouteContext } from '@/src/ceebo/routeContext';
import type { CeeboRouteContext } from '@/src/ceebo/types';

const CEEBO_PERSONALITY = `
You are Ceebo, a professional construction-industry AI assistant for Constructify.
Be concise, helpful, and construction-aware. Never overly verbose.
`;

export interface CeeboContextValue {
  /** Raw path (e.g. /dashboard/admin/settings) */
  pathname: string;
  /** Normalized route context with workflow stage */
  routeContext: CeeboRouteContext;
  /** System prompt to inject for contextual help */
  systemPrompt: string;
}

export function useCeeboContext(): CeeboContextValue {
  const pathname = usePathname() ?? '';

  const routeContext = useMemo(
    () => getCeeboRouteContext(pathname),
    [pathname]
  );

  const systemPrompt = useMemo(() => {
    const parts = [
      CEEBO_PERSONALITY.trim(),
      '',
      `User is currently on ${pathname || '/'}. Provide contextual help when relevant.`,
    ];
    if (routeContext.workflowStage) {
      parts.push(`Workflow context: ${routeContext.workflowStage}.`);
    }
    return parts.join('\n');
  }, [pathname, routeContext.workflowStage]);

  return {
    pathname: pathname || '/',
    routeContext,
    systemPrompt,
  };
}
