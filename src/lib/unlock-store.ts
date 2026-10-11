export interface UnlockRecord {
  tier: 'stream' | 'vvip';
  step: number;
  total: number;
  code: string;
  time: number;
}

// Global store to survive module reloads in Next.js
const globalForUnlock = global as unknown as {
  unlockStore?: Map<string, UnlockRecord>;
};

export const unlockStore = globalForUnlock.unlockStore || new Map<string, UnlockRecord>();
globalForUnlock.unlockStore = unlockStore;

export function recordUserUnlock(
  uid: string,
  tier: 'stream' | 'vvip',
  step: number,
  total: number,
  code: string
) {
  if (!uid) return;
  const cleanUid = uid.trim().toLowerCase();
  unlockStore.set(cleanUid, {
    tier,
    step,
    total,
    code,
    time: Date.now(),
  });
}

export function getUserUnlock(uid: string): UnlockRecord | null {
  if (!uid) return null;
  const cleanUid = uid.trim().toLowerCase();
  const record = unlockStore.get(cleanUid);
  if (!record) return null;

  // Valid for 1 hour
  if (Date.now() - record.time > 3600 * 1000) {
    unlockStore.delete(cleanUid);
    return null;
  }
  return record;
}
