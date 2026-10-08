import defaultAppConfig from '@/data/app-shortener-config.json';

export interface AppShortener {
  id: string;
  name: string;
  urlTemplate: string;
  enabled: boolean;
  priority: number;
}

export interface AppShortenerConfig {
  enabled: boolean;
  streamShortenersRequired: number;
  vvipShortenersRequired: number;
  validityHours: number;
  shorteners: AppShortener[];
}

const CLOUD_APP_CONFIG_URL = process.env.CLOUD_APP_CONFIG_URL || 'https://extendsclass.com/api/json-storage/bin/bfedcae';
const CACHE_TTL_MS = 60 * 1000;

let runtimeAppConfig: AppShortenerConfig = JSON.parse(JSON.stringify(defaultAppConfig)) as AppShortenerConfig;
let lastFetchedAt = 0;

export async function loadAppShortenerConfig(force = false): Promise<AppShortenerConfig> {
  const now = Date.now();
  if (!force && lastFetchedAt > 0 && now - lastFetchedAt < CACHE_TTL_MS) {
    return runtimeAppConfig;
  }

  // 1. Fetch from cloud storage bin (if available)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${CLOUD_APP_CONFIG_URL}?t=${now}`, {
      signal: controller.signal,
      next: { revalidate: 60, tags: ['app-shortener-config'] },
      headers: { 'Cache-Control': 'no-cache' },
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const cloudData = await res.json();
      if (cloudData && typeof cloudData === 'object' && Array.isArray(cloudData.shorteners)) {
        runtimeAppConfig = cloudData as AppShortenerConfig;
        lastFetchedAt = now;
        return runtimeAppConfig;
      }
    }
  } catch (err) {
    // Non-fatal, fallback to local disk
  }

  // 2. Fallback to local disk
  if (typeof window === 'undefined') {
    try {
      const req = eval('require');
      const fsModule = req('fs');
      const pathModule = req('path');
      const configPath = pathModule.join(process.cwd(), 'src', 'data', 'app-shortener-config.json');
      if (fsModule.existsSync(configPath)) {
        const raw = fsModule.readFileSync(configPath, 'utf8');
        runtimeAppConfig = JSON.parse(raw);
        lastFetchedAt = now;
      }
    } catch {
      // Fallback to in-memory runtimeAppConfig
    }
  }

  return runtimeAppConfig;
}

export function getAppShortenerConfig(): AppShortenerConfig {
  return runtimeAppConfig;
}

export async function updateAppShortenerConfig(
  newConfig: Partial<AppShortenerConfig>
): Promise<AppShortenerConfig> {
  const current = await loadAppShortenerConfig(true);
  runtimeAppConfig = {
    ...current,
    ...newConfig,
    shorteners: newConfig.shorteners ? newConfig.shorteners : current.shorteners,
  };
  lastFetchedAt = Date.now();

  // 1. Persist to Cloud Storage
  try {
    await fetch(CLOUD_APP_CONFIG_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(runtimeAppConfig),
    });
  } catch (err) {
    console.warn('[AppShortenerConfig] Cloud storage write exception:', err);
  }

  // 2. Persist to local disk
  if (typeof window === 'undefined') {
    try {
      const req = eval('require');
      const fsModule = req('fs');
      const pathModule = req('path');
      const configPath = pathModule.join(process.cwd(), 'src', 'data', 'app-shortener-config.json');
      fsModule.writeFileSync(configPath, JSON.stringify(runtimeAppConfig, null, 2), 'utf8');
    } catch {
      // Serverless container fallback
    }
  }

  return runtimeAppConfig;
}

export function getActiveShorteners(config: AppShortenerConfig): AppShortener[] {
  return config.shorteners
    .filter((s) => s.enabled)
    .sort((a, b) => a.priority - b.priority);
}

export function buildShortenerUrl(shortener: AppShortener, destinationUrl: string): string {
  const template = shortener.urlTemplate || '';
  const encodedDest = encodeURIComponent(destinationUrl);
  if (template.includes('{destination}')) {
    return template.replace('{destination}', encodedDest);
  }
  if (template.includes('yourdestinationlink.com')) {
    return template.replace('yourdestinationlink.com', encodedDest);
  }
  if (template.includes('url=')) {
    return template.replace(/url=[^&]*/, `url=${encodedDest}`);
  }
  return `${template}${template.includes('?') ? '&' : '?'}url=${encodedDest}`;
}

// 4-Digit Dynamic Code Generator matching Anime Drive App CodeService algorithm
const SECRET_SEED = 'AnimeDrive#Farhan@7ug2Kx9pLm';
const BUCKET_MS = 10 * 60 * 1000;

export function getTodayAppCode(): string {
  const bucket = Math.floor(Date.now() / BUCKET_MS);
  const seed = `${SECRET_SEED}${bucket}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) % 1000000007;
  }
  return (1000 + (h % 9000)).toString();
}
