import { db } from '@/lib/db';
import { usageLogs } from '@/lib/db/schema';
import { and, eq, gte } from 'drizzle-orm';

/**
 * Rate limiting helper using usage_logs table
 */

export type RateLimitConfig = {
  eventType: string;
  limit: number;
  windowMs: number; // Time window in milliseconds
};

export async function checkRateLimit(
  userId: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const windowStart = new Date(Date.now() - config.windowMs);

  const recentEvents = await db
    .select()
    .from(usageLogs)
    .where(
      and(
        eq(usageLogs.userId, userId),
        eq(usageLogs.eventType, config.eventType),
        gte(usageLogs.createdAt, windowStart)
      )
    );

  const count = recentEvents.length;
  const allowed = count < config.limit;
  const remaining = Math.max(0, config.limit - count);
  const resetAt = new Date(Date.now() + config.windowMs);

  return { allowed, remaining, resetAt };
}

export async function logUsage(
  userId: string,
  eventType: string,
  eventData?: Record<string, any>,
  projectId?: string
) {
  await db.insert(usageLogs).values({
    userId,
    eventType,
    eventData: eventData || null,
    projectId: projectId || null,
  });
}

/**
 * Predefined rate limit configs
 */
export const RATE_LIMITS = {
  PROJECT_CREATION: {
    eventType: 'project_created',
    limit: 10,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
  },
  TASK_CREATION: {
    eventType: 'task_added',
    limit: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  COMMENT_CREATION: {
    eventType: 'task_commented',
    limit: 50,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  AI_QUERY: {
    eventType: 'ai_query',
    limit: 20,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
} as const;

/**
 * Usage example in API route:
 * 
 * ```typescript
 * import { checkRateLimit, logUsage, RATE_LIMITS } from '@/lib/rate-limit';
 * 
 * export async function POST(req: Request) {
 *   const userId = await getUserId(req);
 *   
 *   // Check rate limit
 *   const { allowed, remaining } = await checkRateLimit(userId, RATE_LIMITS.PROJECT_CREATION);
 *   
 *   if (!allowed) {
 *     return NextResponse.json(
 *       { error: 'Rate limit exceeded. Max 10 projects per day.' },
 *       { status: 429 }
 *     );
 *   }
 *   
 *   // Create project...
 *   const project = await createProject(...);
 *   
 *   // Log usage
 *   await logUsage(userId, 'project_created', { project_id: project.id }, project.id);
 *   
 *   return NextResponse.json({ project, remaining });
 * }
 * ```
 */
