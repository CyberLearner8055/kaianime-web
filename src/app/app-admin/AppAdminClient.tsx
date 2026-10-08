'use client';

import React, { useState } from 'react';
import {
  Shield,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Power,
  Link as LinkIcon,
  Sparkles,
  ExternalLink,
  Crown,
  Play,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Layers,
  KeyRound,
} from 'lucide-react';
import { AppShortener, AppShortenerConfig, getTodayAppCode } from '@/lib/app-config';

interface Props {
  initialConfig: AppShortenerConfig;
}

export default function AppAdminClient({ initialConfig }: Props) {
  const [config, setConfig] = useState<AppShortenerConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newShortener, setNewShortener] = useState({
    name: '',
    urlTemplate: '',
  });

  const todayCode = getTodayAppCode();

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/app-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Settings saved successfully! Mobile app updated in real-time.', 'success');
      } else {
        showToast(data.message || 'Failed to save settings', 'error');
      }
    } catch {
      showToast('Network error while saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  const toggleShortener = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      shorteners: prev.shorteners.map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
      ),
    }));
  };

  const updateShortener = (id: string, field: keyof AppShortener, value: any) => {
    setConfig((prev) => ({
      ...prev,
      shorteners: prev.shorteners.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));
  };

  const moveShortener = (index: number, direction: 'up' | 'down') => {
    const newItems = [...config.shorteners];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Reassign priority 1, 2, 3...
    newItems.forEach((s, i) => {
      s.priority = i + 1;
    });

    setConfig((prev) => ({ ...prev, shorteners: newItems }));
  };

  const removeShortener = (id: string) => {
    if (!confirm('Are you sure you want to remove this shortener?')) return;
    const remaining = config.shorteners
      .filter((s) => s.id !== id)
      .map((s, i) => ({ ...s, priority: i + 1 }));
    setConfig((prev) => ({ ...prev, shorteners: remaining }));
  };

  const addShortener = () => {
    if (!newShortener.name.trim() || !newShortener.urlTemplate.trim()) {
      showToast('Name and Quicklink URL are required', 'error');
      return;
    }

    const id = newShortener.name.toLowerCase().replace(/[^a-z0-9]/g, '') || `s_${Date.now()}`;
    const nextPriority = config.shorteners.length + 1;

    const item: AppShortener = {
      id,
      name: newShortener.name.trim(),
      urlTemplate: newShortener.urlTemplate.trim(),
      enabled: true,
      priority: nextPriority,
    };

    setConfig((prev) => ({
      ...prev,
      shorteners: [...prev.shorteners, item],
    }));

    setNewShortener({ name: '', urlTemplate: '' });
    setShowAddModal(false);
    showToast(`Added shortener "${item.name}"!`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`px-5 py-3.5 rounded-2xl backdrop-blur-xl border flex items-center gap-3 shadow-2xl ${
              toast.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0d1017]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">Anime Drive • App Admin</h1>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                  v2.2 Monetization
                </span>
              </div>
              <p className="text-xs text-gray-400">Manage 24h Shorteners, Stream & VVIP Access</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/ad-admin"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" /> Web Admin
            </a>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 hover:from-blue-500 to-indigo-600 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Global Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Master Switch */}
          <div className="bg-[#0f131d] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                System Status
              </span>
              <div
                className={`w-3 h-3 rounded-full animate-pulse ${
                  config.enabled ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-rose-500'
                }`}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Shortener System</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {config.enabled ? 'Active • Shorteners Required' : 'Disabled • 100% Free App'}
                </p>
              </div>
              <button
                onClick={() => setConfig((p) => ({ ...p, enabled: !p.enabled }))}
                className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
                  config.enabled ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white transition-transform ${
                    config.enabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Stream Access Quota */}
          <div className="bg-[#0f131d] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-blue-400" /> Stream Access
              </span>
              <span className="text-xs text-blue-400 font-mono">24h Pass</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Shorteners Required</h3>
                <p className="text-xs text-gray-400 mt-0.5">Set to 0 for unlimited free streaming</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={config.streamShortenersRequired}
                  onChange={(e) =>
                    setConfig((p) => ({
                      ...p,
                      streamShortenersRequired: Math.max(0, parseInt(e.target.value) || 0),
                    }))
                  }
                  className="w-16 px-3 py-2 bg-[#151a27] border border-white/10 rounded-xl text-center text-white font-bold text-base focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* VVIP Download Quota */}
          <div className="bg-[#0f131d] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" /> VVIP Downloads
              </span>
              <span className="text-xs text-amber-400 font-mono">24h Unlimited</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Total Shorteners</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Stream users complete {Math.max(0, config.vvipShortenersRequired - config.streamShortenersRequired)} more
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={config.vvipShortenersRequired}
                  onChange={(e) =>
                    setConfig((p) => ({
                      ...p,
                      vvipShortenersRequired: Math.max(0, parseInt(e.target.value) || 0),
                    }))
                  }
                  className="w-16 px-3 py-2 bg-[#151a27] border border-amber-500/30 rounded-xl text-center text-amber-300 font-bold text-base focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shorteners Management Table */}
        <div className="bg-[#0f131d] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-blue-400" /> Shorteners Sequence & Links
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Organize shorteners in execution priority. Toggle active (chalu) or inactive (band).
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Shortener
            </button>
          </div>

          <div className="space-y-3">
            {config.shorteners.map((shortener, index) => (
              <div
                key={shortener.id}
                className={`p-4 rounded-xl border transition-all ${
                  shortener.enabled
                    ? 'bg-[#131722]/80 border-white/10 hover:border-white/20'
                    : 'bg-[#10131a]/50 border-white/5 opacity-60'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Priority Badge & Name */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => moveShortener(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveShortener(index, 'down')}
                        disabled={index === config.shorteners.length - 1}
                        className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                      #{index + 1}
                    </div>

                    <div>
                      <input
                        type="text"
                        value={shortener.name}
                        onChange={(e) => updateShortener(shortener.id, 'name', e.target.value)}
                        className="bg-transparent font-bold text-white text-sm focus:outline-none focus:bg-white/5 rounded px-1.5 py-0.5 border border-transparent focus:border-white/20"
                      />
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400">
                        <span>ID: {shortener.id}</span>
                        <span>•</span>
                        <span className={shortener.enabled ? 'text-emerald-400' : 'text-gray-500'}>
                          {shortener.enabled ? 'Active (Chalu)' : 'Inactive (Band)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: URL Template input */}
                  <div className="flex-1 md:mx-4">
                    <input
                      type="text"
                      value={shortener.urlTemplate}
                      onChange={(e) => updateShortener(shortener.id, 'urlTemplate', e.target.value)}
                      placeholder="https://shortener.com/st?api=KEY&url={destination}"
                      className="w-full px-3 py-2 bg-[#0c0f16] border border-white/10 rounded-xl text-xs text-gray-300 font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => toggleShortener(shortener.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                        shortener.enabled
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                          : 'bg-gray-700/30 border-gray-600/30 text-gray-400'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {shortener.enabled ? 'Band Karein' : 'Chalu Karein'}
                    </button>

                    <button
                      onClick={() => removeShortener(shortener.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {config.shorteners.length === 0 && (
              <div className="text-center py-12 text-gray-500 text-sm">
                No shorteners added. Click &quot;Add Shortener&quot; above.
              </div>
            )}
          </div>
        </div>

        {/* Live Test & Preview Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Live Unlock Test Links */}
          <div className="bg-[#0f131d] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Live Web Flow Test Links
            </h3>
            <p className="text-xs text-gray-400">
              Test how users experience the unlock sequence from inside the mobile app:
            </p>

            <div className="space-y-2">
              <a
                href="/unlock?tier=stream&step=1"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-xs text-gray-300 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-blue-400" />
                  <span>Test Stream Flow (Step 1)</span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400" />
              </a>

              <a
                href="/unlock?tier=vvip&step=1"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-xs text-gray-300 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Test Full VVIP Flow (Steps 1 → 2 → 3)</span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-amber-400" />
              </a>

              <a
                href="/unlock?tier=vvip&fromStep=2"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-xs text-gray-300 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-purple-400" />
                  <span>Test Smart Subtraction (From Step 2)</span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-purple-400" />
              </a>
            </div>
          </div>

          {/* Current Dynamic App Code */}
          <div className="bg-[#0f131d] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400" /> Current 10-Minute Dynamic Code
            </h3>
            <p className="text-xs text-gray-400">
              Users can also type this 4-digit code directly in the app if deep linking fails:
            </p>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-400 font-semibold uppercase">Active Code</span>
                <div className="text-3xl font-extrabold text-emerald-300 font-mono tracking-widest mt-0.5">
                  {todayCode}
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(todayCode);
                  showToast('Code copied to clipboard!', 'success');
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold"
              >
                Copy Code
              </button>
            </div>
            <p className="text-[11px] text-gray-500">
              Rotates every 10 minutes automatically. Fully synchronized with Anime Drive App.
            </p>
          </div>
        </div>
      </main>

      {/* Add Shortener Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0f131d] border border-white/10 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Add New Shortener</h3>
            <p className="text-xs text-gray-400">
              Enter the shortener service name and quicklink API URL with &#123;destination&#125; placeholder.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Shortener Name</label>
                <input
                  type="text"
                  placeholder="e.g. AdMaven, Clicksfly"
                  value={newShortener.name}
                  onChange={(e) => setNewShortener((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-[#151a27] border border-white/10 rounded-xl text-white text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Quicklink URL Template
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/st?api=KEY&url={destination}"
                  value={newShortener.urlTemplate}
                  onChange={(e) => setNewShortener((p) => ({ ...p, urlTemplate: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-[#151a27] border border-white/10 rounded-xl text-white text-xs font-mono focus:border-blue-500 focus:outline-none"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Use &#123;destination&#125; where the destination link should be inserted.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-400 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={addShortener}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30"
              >
                Add Shortener
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
