import defaultConfig from '@/data/site-config.json';

export interface HomeSectionConfig {
  id: string;
  type: 'spotlight' | 'rail' | 'continue_watching' | 'latest_episodes' | 'top_10' | 'app_promo';
  title: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
  limit: number;
}

export interface SiteLinksConfig {
  animedriveUrl: string;
  apkDownloadUrl: string;
  fallbackStreamUrl: string;
  telegramUrl: string;
  whatsappUrl: string;
  discordUrl: string;
}

export interface AnnouncementConfig {
  enabled: boolean;
  text: string;
  badge: string;
  link: string;
  theme: 'blue' | 'emerald' | 'amber' | 'rose';
}

export interface AnimeOverrideItem {
  status?: 'Ongoing' | 'Completed';
  isPinned?: boolean;
  customStreamUrl?: string;
}

export interface SiteConfig {
  siteName: string;
  siteDescription: string;
  dataUrl: string;
  links: SiteLinksConfig;
  sectionsOrder: HomeSectionConfig[];
  spotlightAnimeSlugs: string[];
  trendingAnimeSlugs: string[];
  announcement: AnnouncementConfig;
  animeOverrides: Record<string, AnimeOverrideItem>;
  githubToken?: string;
}

// Dedicated cloud storage endpoint for serverless (Vercel) persistence across all lambdas & users
const CLOUD_STORAGE_URL = process.env.CLOUD_CONFIG_URL || "https://extendsclass.com/api/json-storage/bin/eccfada";
const CACHE_TTL_MS = 3000; // 3-second cache TTL for high throughput & instant live propagation

// In-memory runtime cache
let runtimeConfig: SiteConfig = JSON.parse(JSON.stringify(defaultConfig)) as SiteConfig;
let lastFetchedAt = 0;

/**
 * Loads site configuration from Cloud Storage, local disk, or fallback memory.
 * Guarantees cross-instance persistence on Vercel serverless functions.
 */
export async function loadSiteConfig(force = false): Promise<SiteConfig> {
  const now = Date.now();
  if (!force && lastFetchedAt > 0 && now - lastFetchedAt < CACHE_TTL_MS) {
    return runtimeConfig;
  }

  // 1. Fetch latest config from persistent Cloud Storage
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`${CLOUD_STORAGE_URL}?t=${now}`, {
      signal: controller.signal,
      headers: { "Cache-Control": "no-cache" },
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const cloudData = await res.json();
      if (cloudData && typeof cloudData === "object" && Array.isArray(cloudData.sectionsOrder)) {
        runtimeConfig = cloudData as SiteConfig;
        lastFetchedAt = now;
        return runtimeConfig;
      }
    }
  } catch (err) {
    // Non-fatal, proceed to local disk / in-memory fallback
  }

  // 2. Fallback to local disk (useful in local dev)
  if (typeof window === "undefined") {
    try {
      const req = eval("require");
      const fsModule = req("fs");
      const pathModule = req("path");
      const configPath = pathModule.join(process.cwd(), "src", "data", "site-config.json");
      if (fsModule.existsSync(configPath)) {
        const raw = fsModule.readFileSync(configPath, "utf8");
        runtimeConfig = JSON.parse(raw);
        lastFetchedAt = now;
      }
    } catch {
      // Fallback to in-memory runtimeConfig
    }
  }

  return runtimeConfig;
}

/**
 * Synchronous getter returning latest cached configuration.
 */
export function getSiteConfig(): SiteConfig {
  return runtimeConfig;
}

/**
 * Updates site configuration and persists it across Cloud Storage, local disk, and GitHub.
 */
export async function updateSiteConfig(newConfig: Partial<SiteConfig>): Promise<SiteConfig> {
  const current = await loadSiteConfig(true);
  runtimeConfig = {
    ...current,
    ...newConfig,
    links: {
      ...current.links,
      ...(newConfig.links || {}),
    },
    announcement: {
      ...current.announcement,
      ...(newConfig.announcement || {}),
    },
    sectionsOrder: newConfig.sectionsOrder ? newConfig.sectionsOrder : current.sectionsOrder,
    spotlightAnimeSlugs: newConfig.spotlightAnimeSlugs ? newConfig.spotlightAnimeSlugs : current.spotlightAnimeSlugs,
    trendingAnimeSlugs: newConfig.trendingAnimeSlugs ? newConfig.trendingAnimeSlugs : current.trendingAnimeSlugs,
    animeOverrides: newConfig.animeOverrides ? newConfig.animeOverrides : current.animeOverrides,
    githubToken: newConfig.githubToken !== undefined ? newConfig.githubToken : current.githubToken,
  };
  lastFetchedAt = Date.now();

  // 1. Persist to Cloud Storage (ensures immediate synchronization across Vercel Lambdas)
  try {
    await fetch(CLOUD_STORAGE_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(runtimeConfig),
    });
  } catch (err) {
    console.warn("[SiteConfig] Cloud storage write exception:", err);
  }

  // 2. Persist to local disk on dev server runtime
  if (typeof window === "undefined") {
    try {
      const req = eval("require");
      const fsModule = req("fs");
      const pathModule = req("path");
      const configPath = pathModule.join(process.cwd(), "src", "data", "site-config.json");
      fsModule.writeFileSync(configPath, JSON.stringify(runtimeConfig, null, 2), "utf8");
    } catch {
      // Ephemeral serverless container (expected on Vercel)
    }
  }

  // 3. Optional: Auto-sync to GitHub repo if GitHub Token is configured
  const token = runtimeConfig.githubToken || process.env.GITHUB_TOKEN;
  if (token) {
    syncToGitHub(runtimeConfig, token).catch((e) =>
      console.warn("[SiteConfig] GitHub auto-sync warning:", e)
    );
  }

  return runtimeConfig;
}

async function syncToGitHub(configToSave: SiteConfig, token: string) {
  const owner = 'CyberLearner8055';
  const repo = 'kaianime-web';
  const path = 'src/data/site-config.json';
  const branch = 'main';

  try {
    // 1. Get current file sha
    const getRes = await fetch(
      "https://api.github.com/repos/" + owner + "/" + repo + "/contents/" + path + "?ref=" + branch,
      {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "KaiAnime-Admin",
        },
      }
    );

    let sha = undefined;
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    // 2. Commit updated file
    const contentBase64 = Buffer.from(JSON.stringify(configToSave, null, 2), "utf8").toString("base64");
    const putRes = await fetch(
      "https://api.github.com/repos/" + owner + "/" + repo + "/contents/" + path,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "KaiAnime-Admin",
        },
        body: JSON.stringify({
          message: "chore(config): update site configuration from KaiAnime Admin Dashboard",
          content: contentBase64,
          sha,
          branch,
        }),
      }
    );

    if (!putRes.ok) {
      const errBody = await putRes.text();
      console.error('[SiteConfig] GitHub commit failed:', putRes.status, errBody);
    } else {
      console.log('[SiteConfig] Successfully committed site-config.json to GitHub repository!');
    }
  } catch (err) {
    console.error('[SiteConfig] GitHub sync exception:', err);
  }
}
