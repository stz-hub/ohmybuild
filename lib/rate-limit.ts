/**
 * Rate limiting — sliding window simple, par clé (typiquement IP + endpoint).
 *
 * Implémentation :
 * - Si Upstash Redis configuré (variables d'env), on utilise un compteur Redis avec TTL.
 * - Sinon, fallback en mémoire (Map). Suffisant en dev/local single-instance.
 *
 * API :
 *   const result = await rateLimit({ key, limit, windowMs });
 *   if (!result.ok) throw new RateLimitError();
 */

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// Fallback in-memory.
// ─────────────────────────────────────────────────────────────────────────────
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function memoryRateLimit({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || entry.resetAt <= now) {
    const resetAt = now + windowMs;
    memoryStore.set(key, { count: 1, resetAt });
    return { ok: true, remaining: limit - 1, resetAt };
  }

  entry.count += 1;
  return {
    ok: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    resetAt: entry.resetAt,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Upstash Redis (HTTP REST API). Configuré par UPSTASH_REDIS_REST_URL/TOKEN.
// ─────────────────────────────────────────────────────────────────────────────
async function upstashRateLimit({
  key,
  limit,
  windowMs,
}: RateLimitOptions): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const ttlSeconds = Math.ceil(windowMs / 1000);

  const command = ["INCR", key];
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify([command, ["EXPIRE", key, String(ttlSeconds), "NX"]]),
    cache: "no-store",
  });
  if (!res.ok) {
    console.warn("[rate-limit] Upstash error, falling back to memory");
    return memoryRateLimit({ key, limit, windowMs });
  }
  const json = (await res.json()) as Array<{ result?: number }>;
  const count = Number(json[0]?.result ?? 0);
  return {
    ok: count <= limit,
    remaining: Math.max(0, limit - count),
    resetAt: Date.now() + windowMs,
  };
}

export async function rateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return upstashRateLimit(options);
  }
  return memoryRateLimit(options);
}

/**
 * Extrait l'IP du client depuis les headers usuels (proxy aware).
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "unknown"
  );
}
