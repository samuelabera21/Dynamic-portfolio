type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

const cacheStore = new Map<string, CacheEntry<unknown>>();

export async function getOrSetCache<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const existing = cacheStore.get(key);

  if (existing && existing.expiresAt > now) {
    return existing.value as T;
  }

  try {
    const value = await fetcher();
    cacheStore.set(key, {
      value,
      expiresAt: now + ttlMs,
    });

    return value;
  } catch (error) {
    // If fetcher fails but we have a stale entry, return it as a graceful fallback.
    if (existing) {
      // give the stale value a short extension to avoid immediate reattempt storms
      cacheStore.set(key, {
        value: existing.value,
        expiresAt: Date.now() + Math.min(60_000, ttlMs),
      });
      return existing.value as T;
    }

    // No cached value to fall back to — rethrow so callers can handle the error.
    throw error;
  }
}

export function clearCacheByPrefix(prefixes: string[]): void {
  for (const key of cacheStore.keys()) {
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      cacheStore.delete(key);
    }
  }
}
