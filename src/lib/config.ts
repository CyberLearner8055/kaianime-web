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

// In-memory runtime cache for instantaneous updates across server components
let runtimeConfig: SiteConfig = JSON.parse(JSON.stringify(defaultConfig)) as SiteConfig;

export function getSiteConfig(): SiteConfig {
  return runtimeConfig;
}

export async function updateSiteConfig(newConfig: Partial<SiteConfig>): Promise<SiteConfig> {
  runtimeConfig = {
    ...runtimeConfig,
    ...newConfig,
    links: {
      ...runtimeConfig.links,
      ...(newConfig.links || {}),
    },
    announcement: {
      ...runtimeConfig.announcement,
      ...(newConfig.announcement || {}),
    },
    sectionsOrder: newConfig.sectionsOrder ? newConfig.sectionsOrder : runtimeConfig.sectionsOrder,
    spotlightAnimeSlugs: newConfig.spotlightAnimeSlugs ? newConfig.spotlightAnimeSlugs : runtimeConfig.spotlightAnimeSlugs,
    trendingAnimeSlugs: newConfig.trendingAnimeSlugs ? newConfig.trendingAnimeSlugs : runtimeConfig.trendingAnimeSlugs,
    animeOverrides: newConfig.animeOverrides ? newConfig.animeOverrides : runtimeConfig.animeOverrides,
  };

  // Try persisting to local disk on server runtime
  if (typeof window === "undefined") {
    try {
      const req = eval("require");
      const fsModule = req("fs");
      const pathModule = req("path");
      const configPath = pathModule.join(process.cwd(), "src", "data", "site-config.json");
      if (fsModule.existsSync(configPath)) {
        fsModule.writeFileSync(configPath, JSON.stringify(runtimeConfig, null, 2), "utf8");
      }
    } catch {
      // Ephemeral serverless container
    }
  }

  // Optional: Auto-sync to GitHub repo CyberLearner8055/kaianime-web if GitHub Token is configured
  const token = newConfig.githubToken || process.env.GITHUB_TOKEN;
  if (token) {
    syncToGitHub(runtimeConfig, token).catch((e) =>
      console.warn('[SiteConfig] GitHub auto-sync warning:', e)
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
