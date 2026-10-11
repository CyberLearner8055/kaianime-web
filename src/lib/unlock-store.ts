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
  lastGlobalUnlock?: UnlockRecord | null;
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
  const cleanUid = (uid || 'default').trim().toLowerCase();
  const record: UnlockRecord = {
    tier,
    step,
    total,
    code,
    time: Date.now(),
  };

  unlockStore.set(cleanUid, record);
  // Also store globally for instant fallback sync
  globalForUnlock.lastGlobalUnlock = record;
}

export function getUserUnlock(uid: string): UnlockRecord | null {
  const cleanUid = (uid || '').trim().toLowerCase();
  const now = Date.now();

  // 1. Direct UID match
  if (cleanUid && unlockStore.has(cleanUid)) {
    const record = unlockStore.get(cleanUid)!;
    if (now - record.time <= 3600 * 1000) {
      return record;
    } else {
      unlockStore.delete(cleanUid);
    }
  }

  // 2. Fallback to 'default' key if created recently (within last 15 mins)
  if (unlockStore.has('default')) {
    const defaultRecord = unlockStore.get('default')!;
    if (now - defaultRecord.time <= 15 * 60 * 1000) {
      return defaultRecord;
    }
  }

  // 3. Fallback to last global unlock if within last 15 mins
  if (globalForUnlock.lastGlobalUnlock) {
    if (now - globalForUnlock.lastGlobalUnlock.time <= 15 * 60 * 1000) {
      return globalForUnlock.lastGlobalUnlock;
    }
  }

  return null;
}
