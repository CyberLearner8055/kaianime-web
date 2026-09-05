"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  RefreshCw,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  Link2,
  Database,
  Megaphone,
  Wrench,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Download,
  Upload,
  RotateCcw,
  Loader2,
  Clock,
  Tv,
  HelpCircle,
} from "lucide-react";
import { SiteConfig, HomeSectionConfig } from "@/lib/config";

interface AdminClientProps {
  initialConfig: SiteConfig;
  allAnime: Array<{
    id: string;
    originalId?: string;
    title: string;
    poster: string;
    status: string;
    rating: number;
    genres: string[];
  }>;
}

export default function AdminClient({ initialConfig, allAnime }: AdminClientProps) {
  const router = useRouter();
  const [config, setConfig] = useState<SiteConfig>(initialConfig);

  useEffect(() => {
    fetch("/api/admin/config")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.config) {
          setConfig(data.config);
        }
      })
      .catch(() => {});
  }, []);

  const [activeTab, setActiveTab] = useState<
    "sections" | "spotlight" | "links" | "github" | "announcement" | "overrides" | "settings"
  >("sections");

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [purging, setPurging] = useState(false);
  const [purgeResult, setPurgeResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
  } | null>(null);

  const [spotlightSearch, setSpotlightSearch] = useState("");
  const [trendingSearch, setTrendingSearch] = useState("");

  const [overrideSearch, setOverrideSearch] = useState("");
  const [selectedOverrideAnimeId, setSelectedOverrideAnimeId] = useState<string | null>(null);

  const handleSave = async (overrideCfg?: SiteConfig | unknown) => {
    const configToSave =
      overrideCfg && typeof overrideCfg === "object" && "siteName" in overrideCfg
        ? (overrideCfg as SiteConfig)
        : config;
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configToSave),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save configuration");
      }
      setConfig(data.config);
      setSaveMessage("Saved & Live on Site!");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      alert("Error saving: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePurgeCache = async () => {
    setPurging(true);
    setPurgeResult(null);
    try {
      const res = await fetch("/api/admin/purge-cache", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to purge cache");
      }
      setPurgeResult({
        success: true,
        message: data.message,
        count: data.count,
      });
    } catch (err: any) {
      setPurgeResult({
        success: false,
        message: err.message || "Cache sync failed",
      });
    } finally {
      setPurging(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to log out of Admin Dashboard?")) return;
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newSections = [...config.sectionsOrder];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    newSections.forEach((s, idx) => {
      s.order = idx + 1;
    });

    const updated = { ...config, sectionsOrder: newSections };
    setConfig(updated);
    handleSave(updated);
  };

  const toggleSection = (id: string) => {
    const newSections = config.sectionsOrder.map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    const updated = { ...config, sectionsOrder: newSections };
    setConfig(updated);
    handleSave(updated);
  };

  const updateSectionField = (
    id: string,
    field: keyof HomeSectionConfig,
    value: any
  ) => {
    const newSections = config.sectionsOrder.map((s) =>
      s.id === id ? { ...s, [field]: value } : s
    );
    setConfig({ ...config, sectionsOrder: newSections });
  };

  const filteredSpotlightCandidates = useMemo(() => {
    if (!spotlightSearch.trim()) return [];
    const q = spotlightSearch.toLowerCase().trim();
    return allAnime
      .filter((a) => a.title.toLowerCase().includes(q) || a.id.toLowerCase().includes(q))
      .slice(0, 6);
  }, [allAnime, spotlightSearch]);

  const filteredTrendingCandidates = useMemo(() => {
    if (!trendingSearch.trim()) return [];
    const q = trendingSearch.toLowerCase().trim();
    return allAnime
      .filter((a) => a.title.toLowerCase().includes(q) || a.id.toLowerCase().includes(q))
      .slice(0, 6);
  }, [allAnime, trendingSearch]);

  const filteredOverrideCandidates = useMemo(() => {
    if (!overrideSearch.trim()) return [];
    const q = overrideSearch.toLowerCase().trim();
    return allAnime
      .filter((a) => a.title.toLowerCase().includes(q) || a.id.toLowerCase().includes(q))
      .slice(0, 8);
  }, [allAnime, overrideSearch]);

  const activeOverrideAnime = useMemo(() => {
    if (!selectedOverrideAnimeId) return null;
    return allAnime.find((a) => a.id === selectedOverrideAnimeId) || null;
  }, [allAnime, selectedOverrideAnimeId]);

  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `kaianime-config-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === "object") {
          setConfig({ ...config, ...parsed });
          alert("Backup loaded into dashboard preview. Click 'Save Changes' to apply permanently!");
        }
      } catch (err: any) {
        alert("Invalid JSON backup file: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#04060a] text-slate-200 font-sans pb-20">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#06080e]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/home" target="_blank" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="KaiAnime" className="h-7 w-auto object-contain" />
            <span className="px-2 py-0.5 rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-extrabold tracking-wider uppercase">
              Admin
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-white/10 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>GitHub Raw Connected</span>
            <span className="text-slate-600">|</span>
            <span className="font-semibold text-white">{allAnime.length} Animes Loaded</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {saveMessage && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{saveMessage}</span>
            </div>
          )}

          <Link
            href="/home"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Site</span>
          </Link>

          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save All Changes</span>
          </button>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-lg bg-white/[0.04] hover:bg-rose-500/15 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Module Tab Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar border-b border-white/10">
          <button
            onClick={() => setActiveTab("sections")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "sections"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 border border-blue-500/40"
                : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/5"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. Sections & Reordering</span>
          </button>

          <button
            onClick={() => setActiveTab("spotlight")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "spotlight"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 border border-blue-500/40"
                : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/5"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>2. Spotlight & Trending</span>
          </button>

          <button
            onClick={() => setActiveTab("links")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "links"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 border border-blue-500/40"
                : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/5"
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>3. AnimeDrive & Links</span>
          </button>

          <button
            onClick={() => setActiveTab("github")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "github"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 border border-blue-500/40"
                : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/5"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>4. GitHub Raw & Purge Cache</span>
          </button>

          <button
            onClick={() => setActiveTab("announcement")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "announcement"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 border border-blue-500/40"
                : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/5"
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>5. Notice Banner</span>
          </button>

          <button
            onClick={() => setActiveTab("overrides")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "overrides"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 border border-blue-500/40"
                : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/5"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>6. Anime Overrides</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "settings"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 border border-blue-500/40"
                : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/5"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>7. Settings & Backups</span>
          </button>
        </div>

        {/* TAB 1: SECTIONS REORDER & TOGGLE */}
        {activeTab === "sections" && (
          <div className="space-y-6">
            <div className="bg-[#090d16] rounded-2xl border border-white/10 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
                <div>
                  <h2 className="text-lg font-black text-white">Homepage Sections Manager</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Move sections Up or Down (Isekai, Action, Romance, Running, etc.) and toggle their visibility.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm("Reset sections to default order?")) {
                      setConfig({ ...config, sectionsOrder: initialConfig.sectionsOrder });
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold border border-white/5 transition-colors self-start sm:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default Order</span>
                </button>
              </div>

              <div className="space-y-3">
                {config.sectionsOrder.map((section, idx) => (
                  <div
                    key={section.id}
                    className={`rounded-xl border p-4 transition-all ${
                      section.enabled
                        ? "bg-[#0b101c] border-white/10 hover:border-blue-500/30"
                        : "bg-black/40 border-white/5 opacity-60"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => moveSection(idx, "up")}
                            disabled={idx === 0}
                            title="Move Up"
                            className="p-1.5 rounded-md bg-white/[0.04] hover:bg-white/10 disabled:opacity-20 text-slate-300 hover:text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveSection(idx, "down")}
                            disabled={idx === config.sectionsOrder.length - 1}
                            title="Move Down"
                            className="p-1.5 rounded-md bg-white/[0.04] hover:bg-white/10 disabled:opacity-20 text-slate-300 hover:text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xs shrink-0">
                          #{idx + 1}
                        </div>

                        <div className="flex-1 min-w-[200px]">
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateSectionField(section.id, "title", e.target.value)}
                            className="font-bold text-sm text-white bg-transparent border-b border-white/10 hover:border-blue-400 focus:border-blue-500 focus:outline-none w-full py-0.5"
                          />
                          {section.subtitle !== undefined && (
                            <input
                              type="text"
                              value={section.subtitle}
                              onChange={(e) => updateSectionField(section.id, "subtitle", e.target.value)}
                              placeholder="Subtitle..."
                              className="text-xs text-slate-400 bg-transparent border-b border-transparent hover:border-white/10 focus:border-white/20 focus:outline-none w-full py-0.5 mt-0.5"
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-11 md:ml-0">
                        <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-[11px] font-mono text-slate-400">
                          id: {section.id}
                        </span>

                        <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/10 rounded-lg px-2.5 py-1 text-xs">
                          <span className="text-slate-400">Limit:</span>
                          <input
                            type="number"
                            min={1}
                            max={50}
                            value={section.limit}
                            onChange={(e) =>
                              updateSectionField(section.id, "limit", parseInt(e.target.value) || 12)
                            }
                            className="w-12 bg-transparent text-white font-bold text-center focus:outline-none"
                          />
                        </div>

                        <button
                          onClick={() => toggleSection(section.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            section.enabled
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                              : "bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25"
                          }`}
                        >
                          {section.enabled ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Visible</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SPOTLIGHT & TRENDING MANAGER */}
        {activeTab === "spotlight" && (
          <div className="space-y-8">
            <div className="bg-[#090d16] rounded-2xl border border-white/10 p-5 sm:p-6">
              <div className="pb-4 border-b border-white/10 mb-6">
                <h2 className="text-lg font-black text-white">Hero Spotlight Slider Curation</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pin your favorite anime to appear on the main homepage banner slider.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Currently Pinned Slides ({config.spotlightAnimeSlugs.length})
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {config.spotlightAnimeSlugs.map((slug, idx) => {
                    const anime = allAnime.find(
                      (a) => a.id.toLowerCase() === slug.toLowerCase()
                    );
                    return (
                      <div
                        key={slug}
                        className="relative group rounded-xl overflow-hidden bg-[#0c1220] border border-white/10 p-2 flex flex-col"
                      >
                        <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden mb-2 bg-black/50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={anime?.poster || "/logo.png"}
                            alt={anime?.title || slug}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-blue-600 text-[10px] font-black text-white">
                            #{idx + 1}
                          </div>
                        </div>

                        <div className="flex-1">
                          <p className="text-xs font-bold text-white line-clamp-1">
                            {anime?.title || slug}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">{slug}</p>
                        </div>

                        <div className="flex items-center justify-between gap-1 mt-2 pt-2 border-t border-white/5">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                if (idx === 0) return;
                                const list = [...config.spotlightAnimeSlugs];
                                const temp = list[idx];
                                list[idx] = list[idx - 1];
                                list[idx - 1] = temp;
                                const updated = { ...config, spotlightAnimeSlugs: list };
                                setConfig(updated);
                                handleSave(updated);
                              }}
                              disabled={idx === 0}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-slate-300"
                              title="Move Left"
                            >
                              <ArrowUp className="w-3 h-3 -rotate-90" />
                            </button>
                            <button
                              onClick={() => {
                                if (idx === config.spotlightAnimeSlugs.length - 1) return;
                                const list = [...config.spotlightAnimeSlugs];
                                const temp = list[idx];
                                list[idx] = list[idx + 1];
                                list[idx + 1] = temp;
                                const updated = { ...config, spotlightAnimeSlugs: list };
                                setConfig(updated);
                                handleSave(updated);
                              }}
                              disabled={idx === config.spotlightAnimeSlugs.length - 1}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-slate-300"
                              title="Move Right"
                            >
                              <ArrowDown className="w-3 h-3 -rotate-90" />
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              const list = config.spotlightAnimeSlugs.filter((s) => s !== slug);
                              const updated = { ...config, spotlightAnimeSlugs: list };
                              setConfig(updated);
                              handleSave(updated);
                            }}
                            className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                            title="Remove"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Search & Add Anime to Spotlight
                </label>
                <div className="relative max-w-md mb-3">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={spotlightSearch}
                    onChange={(e) => setSpotlightSearch(e.target.value)}
                    placeholder="Search by title (e.g. Solo Leveling, Naruto, Bleach)..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {filteredSpotlightCandidates.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {filteredSpotlightCandidates.map((anime) => (
                      <div
                        key={anime.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={anime.poster}
                            alt={anime.title}
                            className="w-9 h-12 rounded object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{anime.title}</p>
                            <p className="text-[10px] text-slate-400">Rating: ⭐ {anime.rating}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (!config.spotlightAnimeSlugs.includes(anime.id)) {
                              const updated = {
                                ...config,
                                spotlightAnimeSlugs: [...config.spotlightAnimeSlugs, anime.id],
                              };
                              setConfig(updated);
                              handleSave(updated);
                            }
                            setSpotlightSearch("");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 shrink-0 ml-2"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#090d16] rounded-2xl border border-white/10 p-5 sm:p-6">
              <div className="pb-4 border-b border-white/10 mb-6">
                <h2 className="text-lg font-black text-white">Trending in India Rail Curation</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pin specific titles to top of the Trending rail (or leave empty to use automatic live app analytics).
                </p>
              </div>

              <div className="mb-4">
                <div className="relative max-w-md mb-3">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={trendingSearch}
                    onChange={(e) => setTrendingSearch(e.target.value)}
                    placeholder="Search anime to pin to Trending in India..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {filteredTrendingCandidates.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {filteredTrendingCandidates.map((anime) => (
                      <div
                        key={anime.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={anime.poster}
                            alt={anime.title}
                            className="w-9 h-12 rounded object-cover shrink-0"
                          />
                          <p className="text-xs font-bold text-white truncate">{anime.title}</p>
                        </div>
                        <button
                          onClick={() => {
                            if (!config.trendingAnimeSlugs.includes(anime.id)) {
                              setConfig({
                                ...config,
                                trendingAnimeSlugs: [...config.trendingAnimeSlugs, anime.id],
                              });
                            }
                            setTrendingSearch("");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 shrink-0 ml-2"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Pin</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {config.trendingAnimeSlugs.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-2">
                  {config.trendingAnimeSlugs.map((slug) => (
                    <span
                      key={slug}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold"
                    >
                      <span>{slug}</span>
                      <button
                        onClick={() =>
                          setConfig({
                            ...config,
                            trendingAnimeSlugs: config.trendingAnimeSlugs.filter((s) => s !== slug),
                          })
                        }
                        className="hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No manual trending pins active. System is using live Anime Drive App trending data automatically.
                </p>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ANIMEDRIVE & SOCIAL LINKS */}
        {activeTab === "links" && (
          <div className="bg-[#090d16] rounded-2xl border border-white/10 p-5 sm:p-6 space-y-6">
            <div className="pb-4 border-b border-white/10">
              <h2 className="text-lg font-black text-white">AnimeDrive & External URLs Manager</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Centralized link management. Updating these URLs updates all download buttons, headers, and footer branding instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Official AnimeDrive Site URL
                </label>
                <input
                  type="url"
                  value={config.links.animedriveUrl}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      links: { ...config.links, animedriveUrl: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Used in footer branding, network links, and watch page download redirections.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Android APK Direct Download URL
                </label>
                <input
                  type="url"
                  value={config.links.apkDownloadUrl}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      links: { ...config.links, apkDownloadUrl: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Target destination for the "Download App" banners and `/app` route.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Fallback Stream Server URL
                </label>
                <input
                  type="url"
                  value={config.links.fallbackStreamUrl}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      links: { ...config.links, fallbackStreamUrl: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Default third-party streaming provider fallback if direct M3U8 extraction is slow.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Official Telegram Channel URL
                </label>
                <input
                  type="url"
                  value={config.links.telegramUrl}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      links: { ...config.links, telegramUrl: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Used for community banners and 1-tap "Share on Telegram" buttons.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Official WhatsApp Channel URL
                </label>
                <input
                  type="url"
                  value={config.links.whatsappUrl}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      links: { ...config.links, whatsappUrl: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Used for WhatsApp community buttons and episode broadcast notifications.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Discord Community Server URL
                </label>
                <input
                  type="url"
                  value={config.links.discordUrl}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      links: { ...config.links, discordUrl: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GITHUB RAW DATA & CACHE PURGE */}
        {activeTab === "github" && (
          <div className="space-y-6">
            <div className="bg-[#090d16] rounded-2xl border border-white/10 p-5 sm:p-6 space-y-6">
              <div className="pb-4 border-b border-white/10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
                  <Database className="w-3.5 h-3.5" />
                  <span>100% Primary Data Engine</span>
                </div>
                <h2 className="text-lg font-black text-white">GitHub Raw Data Source & 1-Click Sync</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  KaiAnime reads all 700+ anime titles, episodes, streaming servers, and posters directly from your GitHub raw JSON file.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Live GitHub Raw Data Source URL
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={config.dataUrl}
                    onChange={(e) => setConfig({ ...config, dataUrl: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => {
                      setConfig({
                        ...config,
                        dataUrl:
                          "https://raw.githubusercontent.com/CyberLearner8055/appdata/refs/heads/main/anime-data.json",
                      });
                    }}
                    className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/5 whitespace-nowrap cursor-pointer"
                  >
                    Reset Default URL
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Default: <code className="text-slate-400">CyberLearner8055/appdata/main/anime-data.json</code>
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/30 to-indigo-950/30 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-blue-400" />
                    <span>Instant Catalog Re-Sync</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Added new anime or episodes to your GitHub repo? Click below to immediately flush server memory cache and sync live catalog data in seconds!
                  </p>
                </div>

                <button
                  onClick={handlePurgeCache}
                  disabled={purging}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 transition-all disabled:opacity-50 shrink-0 cursor-pointer"
                >
                  {purging ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Syncing from GitHub...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Purge Cache & Sync Now</span>
                    </>
                  )}
                </button>
              </div>

              {purgeResult && (
                <div
                  className={`p-4 rounded-xl border text-xs font-medium ${
                    purgeResult.success
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                  }`}
                >
                  <p className="font-bold mb-1">
                    {purgeResult.success ? "Sync Completed!" : "Sync Error"}
                  </p>
                  <p>{purgeResult.message}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">
                    Data Engine Status
                  </span>
                  <span className="text-sm font-bold text-emerald-400 mt-1 inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Online & Active
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">
                    Catalog Size
                  </span>
                  <span className="text-sm font-bold text-white mt-1 block">
                    {allAnime.length} Titles Loaded
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">
                    Cache Memory Layer
                  </span>
                  <span className="text-sm font-bold text-blue-400 mt-1 block">
                    5-Minute Fast RAM Cache
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: NOTICE BANNER */}
        {activeTab === "announcement" && (
          <div className="bg-[#090d16] rounded-2xl border border-white/10 p-5 sm:p-6 space-y-6">
            <div className="pb-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white">Global Announcement Banner</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Broadcast breaking anime releases, dub drops, or network updates at the top of every page.
                </p>
              </div>

              <button
                onClick={() =>
                  setConfig({
                    ...config,
                    announcement: {
                      ...config.announcement,
                      enabled: !config.announcement.enabled,
                    },
                  })
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  config.announcement.enabled
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                }`}
              >
                {config.announcement.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{config.announcement.enabled ? "Active on Site" : "Disabled"}</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Live Banner Preview
              </label>
              <div
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                  config.announcement.theme === "emerald"
                    ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
                    : config.announcement.theme === "amber"
                    ? "bg-amber-950/40 border-amber-500/30 text-amber-200"
                    : config.announcement.theme === "rose"
                    ? "bg-rose-950/40 border-rose-500/30 text-rose-200"
                    : "bg-blue-950/40 border-blue-500/30 text-blue-200"
                }`}
              >
                <div className="flex items-center gap-2 font-medium">
                  <span className="px-2 py-0.5 rounded-md bg-white/10 font-bold uppercase text-[10px]">
                    {config.announcement.badge || "NOTICE"}
                  </span>
                  <span>{config.announcement.text || "Announcement text here..."}</span>
                </div>

                {config.announcement.link && (
                  <span className="text-xs font-bold underline underline-offset-2 shrink-0">
                    Check Now →
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Announcement Message
                </label>
                <input
                  type="text"
                  value={config.announcement.text}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      announcement: { ...config.announcement, text: e.target.value },
                    })
                  }
                  placeholder="e.g. Solo Leveling Season 2 Episode 8 Hindi Dub Out Now!"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={config.announcement.badge}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      announcement: { ...config.announcement, badge: e.target.value },
                    })
                  }
                  placeholder="e.g. NEW, ALERT, UPDATE"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Destination Link URL (Optional)
                </label>
                <input
                  type="text"
                  value={config.announcement.link}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      announcement: { ...config.announcement, link: e.target.value },
                    })
                  }
                  placeholder="e.g. /search?filter=running or https://t.me/animedrive"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Color Theme
                </label>
                <select
                  value={config.announcement.theme}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      announcement: {
                        ...config.announcement,
                        theme: e.target.value as any,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d121c] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="blue">Blue (Standard)</option>
                  <option value="emerald">Emerald (Success / New Release)</option>
                  <option value="amber">Amber (Warning / Alert)</option>
                  <option value="rose">Rose (Urgent)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ANIME OVERRIDES */}
        {activeTab === "overrides" && (
          <div className="space-y-6">
            <div className="bg-[#090d16] rounded-2xl border border-white/10 p-5 sm:p-6 space-y-6">
              <div className="pb-4 border-b border-white/10">
                <h2 className="text-lg font-black text-white">Anime Status & Stream Overrides</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Change any anime status between Ongoing and Completed, pin to homepage, or override broken stream links.
                </p>
              </div>

              <div className="relative max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={overrideSearch}
                  onChange={(e) => setOverrideSearch(e.target.value)}
                  placeholder="Search anime to modify status..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {filteredOverrideCandidates.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                  {filteredOverrideCandidates.map((anime) => (
                    <button
                      key={anime.id}
                      onClick={() => {
                        setSelectedOverrideAnimeId(anime.id);
                        setOverrideSearch("");
                      }}
                      className="p-2 rounded-xl bg-white/[0.03] hover:bg-blue-600/15 border border-white/5 hover:border-blue-500/30 flex items-center gap-2.5 text-left transition-all cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={anime.poster}
                        alt={anime.title}
                        className="w-8 h-11 rounded object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{anime.title}</p>
                        <p className="text-[10px] text-slate-400">
                          Status: {config.animeOverrides[anime.id]?.status || anime.status}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {activeOverrideAnime && (
                <div className="p-4 rounded-xl bg-[#0e1424] border border-blue-500/30 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeOverrideAnime.poster}
                        alt={activeOverrideAnime.title}
                        className="w-10 h-14 rounded object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-black text-white">{activeOverrideAnime.title}</h4>
                        <p className="text-xs text-slate-400">ID: {activeOverrideAnime.id}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedOverrideAnimeId(null)}
                      className="text-xs text-slate-400 hover:text-white cursor-pointer"
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Override Status
                      </label>
                      <select
                        value={config.animeOverrides[activeOverrideAnime.id]?.status || activeOverrideAnime.status}
                        onChange={(e) => {
                          const currentOverride = config.animeOverrides[activeOverrideAnime.id] || {};
                          setConfig({
                            ...config,
                            animeOverrides: {
                              ...config.animeOverrides,
                              [activeOverrideAnime.id]: {
                                ...currentOverride,
                                status: e.target.value as any,
                              },
                            },
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#0a0d14] border border-white/10 text-white text-xs"
                      >
                        <option value="Ongoing">Ongoing (Airing Now)</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Pin to Popular / Home
                      </label>
                      <button
                        onClick={() => {
                          const currentOverride = config.animeOverrides[activeOverrideAnime.id] || {};
                          setConfig({
                            ...config,
                            animeOverrides: {
                              ...config.animeOverrides,
                              [activeOverrideAnime.id]: {
                                ...currentOverride,
                                isPinned: !currentOverride.isPinned,
                              },
                            },
                          });
                        }}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          config.animeOverrides[activeOverrideAnime.id]?.isPinned
                            ? "bg-blue-600 text-white border-blue-400"
                            : "bg-white/5 text-slate-400 border-white/10 hover:text-white"
                        }`}
                      >
                        {config.animeOverrides[activeOverrideAnime.id]?.isPinned
                          ? "★ Pinned to Top"
                          : "Not Pinned"}
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Custom Stream / M3U8 URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://...m3u8 (Optional)"
                        value={config.animeOverrides[activeOverrideAnime.id]?.customStreamUrl || ""}
                        onChange={(e) => {
                          const currentOverride = config.animeOverrides[activeOverrideAnime.id] || {};
                          setConfig({
                            ...config,
                            animeOverrides: {
                              ...config.animeOverrides,
                              [activeOverrideAnime.id]: {
                                ...currentOverride,
                                customStreamUrl: e.target.value,
                              },
                            },
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#0a0d14] border border-white/10 text-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Active Overrides ({Object.keys(config.animeOverrides).length})
                </label>
                {Object.keys(config.animeOverrides).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(config.animeOverrides).map(([slug, override]) => (
                      <div
                        key={slug}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs"
                      >
                        <div>
                          <span className="font-bold text-white">{slug}</span>
                          <span className="text-slate-400 ml-3">
                            Status: <strong className="text-blue-400">{override.status || "Default"}</strong>
                          </span>
                          {override.isPinned && (
                            <span className="ml-2 px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px]">
                              Pinned
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            const newOverrides = { ...config.animeOverrides };
                            delete newOverrides[slug];
                            setConfig({ ...config, animeOverrides: newOverrides });
                          }}
                          className="text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No manual overrides active.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SETTINGS & BACKUPS */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="bg-[#090d16] rounded-2xl border border-white/10 p-5 sm:p-6 space-y-6">
              <div className="pb-4 border-b border-white/10">
                <h2 className="text-lg font-black text-white">Platform Configuration & Backups</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Metadata settings, GitHub auto-sync token, and 1-click JSON backup & restore.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Site Platform Name
                  </label>
                  <input
                    type="text"
                    value={config.siteName}
                    onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    GitHub Personal Access Token (Optional)
                  </label>
                  <input
                    type="password"
                    value={config.githubToken || ""}
                    onChange={(e) => setConfig({ ...config, githubToken: e.target.value })}
                    placeholder="ghp_••••••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    If provided, saving automatically commits `site-config.json` directly to your GitHub repository!
                  </span>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Default Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={config.siteDescription}
                    onChange={(e) => setConfig({ ...config, siteDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleExportBackup}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-blue-400" />
                  <span>📥 Export Backup JSON</span>
                </button>

                <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>📤 Import Backup JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/20 transition-colors ml-auto cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out Admin</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
