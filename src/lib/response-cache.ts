type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

const cacheStore = new Map<string, CacheEntry<unknown>>();
const inflightStore = new Map<string, Promise<unknown>>();

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

   const inflight = inflightStore.get(key);
   if (inflight) {
    return inflight as Promise<T>;
   }

  const operation = (async () => {
    try {
      const value = await fetcher();
      cacheStore.set(key, {
        value,
        expiresAt: Date.now() + ttlMs,
      });

      return value;
    } catch (error) {
      // If fetcher fails but we have a stale entry, return it as a graceful fallback.
      if (existing) {
        // Give stale value a short extension to avoid immediate reattempt storms.
        cacheStore.set(key, {
          value: existing.value,
          expiresAt: Date.now() + Math.min(60_000, ttlMs),
        });
        return existing.value as T;
      }

      // No cached value to fall back to - rethrow so callers can handle the error.
      throw error;
    } finally {
      inflightStore.delete(key);
    }
  })();

  inflightStore.set(key, operation as Promise<unknown>);
  return operation;
}

export function clearCacheByPrefix(prefixes: string[]): void {
  for (const key of cacheStore.keys()) {
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      cacheStore.delete(key);
    }
  }

  for (const key of inflightStore.keys()) {
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      inflightStore.delete(key);
    }
  }
}
