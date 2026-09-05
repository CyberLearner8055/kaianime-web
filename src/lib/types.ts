export interface ServerStream {
  name: string;
  url: string;
}

export interface Episode {
  id: string;
  season?: number;
  number: number;
  title: string;
  servers: Record<string, string>;
}

export interface Anime {
  id: string; // Clean SEO slug e.g. "solo-leveling"
  originalId: string; // Raw database ID e.g. "anime_1788167253377"
  title: string;
  japaneseTitle?: string;
  synopsis: string;
  genres: string[];
  poster: string;
  banner?: string;
  type: string;
  status: string;
  rating: number;
  episodesCount: number;
  episodes: Episode[];
  seasons: number[];
  isHindiDubbed?: boolean;
  isTrending?: boolean;
  isPopular?: boolean;
  year?: string | number;
  quality?: string;
  langs?: string;
  dubbedBy?: string;
  studio?: string;
  season?: string;
  trailerId?: string;
}

export interface AnimeCharacter {
  name: string;
  role: string;
  image: string;
}

export interface EnrichedMetadata {
  romajiTitle: string;
  englishTitle: string;
  nativeTitle: string;
  studio: string;
  season: string;
  seasonYear: string;
  status: string;
  format: string;
  duration: number;
  averageScore: number;
  source: string;
  trailerId?: string;
  characters: AnimeCharacter[];
}

export interface SubtitleTrack {
  label: string;
  language: string;
  file: string;
  default?: boolean;
}

export interface ExtractedStream {
  url: string;
  referer: string;
  origin: string;
  isHls: boolean;
  subtitles: SubtitleTrack[];
}
