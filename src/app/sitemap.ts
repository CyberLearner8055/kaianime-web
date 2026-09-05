import { MetadataRoute } from "next";
import { fetchAllAnime } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://kaianime.site";
  const animeList = await fetchAllAnime();

  // Base routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // Anime detail routes
  const animeRoutes: MetadataRoute.Sitemap = animeList.map((anime) => ({
    url: `${baseUrl}/anime/${anime.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Episode watch routes (first 3 episodes per anime to keep sitemap clean and high-priority)
  const watchRoutes: MetadataRoute.Sitemap = animeList.flatMap((anime) =>
    anime.episodes.slice(0, 3).map((ep) => ({
      url: `${baseUrl}/watch/${anime.id}/${ep.number}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }))
  );

  return [...staticRoutes, ...animeRoutes, ...watchRoutes];
}
