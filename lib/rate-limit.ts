/**
 * In-memory rate limiter for API routes.
 *
 * IMPORTANT: This provides basic protection in single-instance deployments.
 * For production at scale with multiple serverless instances, use an
 * external store (Redis, Upstash, etc.) instead.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically to prevent memory leak
setInterval(() => {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (now >= entry.resetAt) {
      store.delete(key);
    }
  });
}, 60_000); // Clean every 60 seconds

/**
 * Check if a request is rate limited.
 *
 * @param identifier - Unique identifier (e.g., user ID or IP)
 * @param maxRequests - Maximum number of requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns Object with `limited` boolean and `remaining` count
 */
export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60_000
): { limited: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now >= entry.resetAt) {
    // Start a new window
    store.set(identifier, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: maxRequests - 1, retryAfterMs: 0 };
  }

  entry.count += 1;

  if (entry.count > maxRequests) {
    return {
      limited: true,
      remaining: 0,
      retryAfterMs: entry.resetAt - now,
    };
  }

  return {
    limited: false,
    remaining: maxRequests - entry.count,
    retryAfterMs: 0,
  };
}
