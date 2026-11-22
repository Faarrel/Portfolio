'use client';

import { useState, useEffect } from 'react';
import { OpenInNewIcon, GraphicEqIcon } from '@/components/ui/material-symbols';
import { PERSONAL_INFO } from '@/data/portfolioData';

interface LanyardActivity {
  id: string;
  name: string;
  type: number;
  application_id?: string;
  state?: string;
  details?: string;
  timestamps?: { start?: number; end?: number };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  emoji?: {
    name: string;
    id?: string;
    animated?: boolean;
  };
}

interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
    global_name?: string | null;
    display_name?: string | null;
    avatar_decoration_data?: {
      asset: string;
      sku_id: string;
    } | null;
  };
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: LanyardActivity[];
  spotify: {
    track_id: string;
    song: string;
    artist: string;
    album: string;
    album_art_url: string;
    timestamps: { start: number; end: number };
  } | null;
  listening_to_spotify: boolean;
}

const DISCORD_USER_ID = '938045579215380510';

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function formatElapsed(startTimestamp: number) {
  const elapsedMs = Math.max(0, Date.now() - startTimestamp);
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function getAssetUrl(appId?: string, largeAsset?: string, smallAsset?: string) {
  const asset = largeAsset || smallAsset;
  if (!asset) return null;
  if (asset.startsWith('mp:external/')) {
    const raw = asset.replace('mp:external/', '');
    const cleanUrl = raw.replace(/^https?\//, 'https://');
    return cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;
  }
  if (appId && !asset.startsWith('http')) {
    return `https://cdn.discordapp.com/app-assets/${appId}/${asset}.png`;
  }
  return asset;
}

export default function DiscordPresenceCard() {
  const [lanyard, setLanyard] = useState<LanyardData | null>(null);
  const [copied, setCopied] = useState(false);
  const [spotifyCurrentMs, setSpotifyCurrentMs] = useState(0);
  const [activityElapsed, setActivityElapsed] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchLanyard() {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
        if (!res.ok) throw new Error('Not monitored');
        const json = await res.json();
        if (json.success && isMounted) {
          setLanyard(json.data);
        }
      } catch {
        // Fallback state retained gracefully
      }
    }

    fetchLanyard();
    const interval = setInterval(fetchLanyard, 8000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Spotify real-time ticker
  useEffect(() => {
    if (!lanyard?.spotify) return;
    const { start, end } = lanyard.spotify.timestamps;
    const total = end - start;

    const updateTicker = () => {
      const now = Date.now();
      const current = Math.min(Math.max(now - start, 0), total);
      setSpotifyCurrentMs(current);
    };

    updateTicker();
    const timer = setInterval(updateTicker, 1000);

    return () => clearInterval(timer);
  }, [lanyard?.spotify]);

  // Extract non-Spotify game/app activity (Orca, games, VS Code, etc.)
  const gameOrAppActivities = lanyard?.activities?.filter((a) => {
    if (a.type === 4) return false; // custom status
    if (a.type === 2) return false; // listening
    if (a.name.toLowerCase() === 'spotify') return false;
    if (a.id && a.id.startsWith('spotify:')) return false;
    return true;
  }) || [];

  const primaryActivity = gameOrAppActivities[0];

  useEffect(() => {
    if (!primaryActivity?.timestamps?.start) {
      setActivityElapsed('');
      return;
    }
    const start = primaryActivity.timestamps.start;
    setActivityElapsed(formatElapsed(start));

    const timer = setInterval(() => {
      setActivityElapsed(formatElapsed(start));
    }, 1000);

    return () => clearInterval(timer);
  }, [primaryActivity?.timestamps?.start]);

  const status = lanyard?.discord_status || 'offline';

  const statusConfig = {
    online: { label: 'Online', color: 'bg-emerald-500', glow: 'shadow-[0_0_10px_rgba(16,185,129,0.7)]' },
    idle: { label: 'Idle / Away', color: 'bg-amber-400', glow: 'shadow-[0_0_10px_rgba(251,191,36,0.7)]' },
    dnd: { label: 'Do Not Disturb', color: 'bg-rose-500', glow: 'shadow-[0_0_10px_rgba(244,63,94,0.7)]' },
    offline: { label: 'Offline', color: 'bg-zinc-500', glow: '' },
  }[status];

  const spotify = lanyard?.spotify;
  const customActivity = lanyard?.activities?.find((a) => a.type === 4);
  const customStatusText = customActivity?.state;
  const customEmoji = customActivity?.emoji;

  const avatarUrl = lanyard?.discord_user?.avatar
    ? `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${lanyard.discord_user.avatar}.png?size=128`
    : 'https://cdn.discordapp.com/avatars/938045579215380510/7395402e2522fb277f4577f23d0bffc0.webp?size=160';

  const decorationAsset = lanyard?.discord_user?.avatar_decoration_data?.asset || 'a_838e8568d3798c688a05c696ec6bed5f';
  const avatarDecorationUrl = decorationAsset
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${decorationAsset}.png?size=160&passthrough=true`
    : null;

  const activityImageUrl = primaryActivity
    ? getAssetUrl(primaryActivity.application_id, primaryActivity.assets?.large_image, primaryActivity.assets?.small_image)
    : null;

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.discordHandle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const spotifyTotalMs = spotify ? spotify.timestamps.end - spotify.timestamps.start : 0;
  const spotifyProgressPercent = spotifyTotalMs > 0 ? (spotifyCurrentMs / spotifyTotalMs) * 100 : 0;

  return (
    <div className="rounded-2xl overflow-hidden bg-[#202024] border border-[#27272a] p-4 sm:p-5 flex flex-col justify-between gap-4">
      {/* Header: Avatar, Name, Handle, Badges, Status */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative shrink-0 size-12 sm:size-14 flex items-center justify-center">
          <img
            src={avatarUrl}
            alt="Discord Avatar"
            className="size-full rounded-full object-cover bg-[#2a2a30] border border-white/10"
            onError={(e) => {
              (e.target as HTMLElement).setAttribute('src', '/logo.png');
            }}
          />
          {avatarDecorationUrl && (
            <img
              src={avatarDecorationUrl}
              alt="Avatar Decoration"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-none pointer-events-none select-none z-10 object-contain aspect-square"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('collectibles-shop')) {
                  target.src = 'https://cdn.discordapp.com/media/v1/collectibles-shop/1555329586768642148/static';
                } else {
                  target.style.display = 'none';
                }
              }}
            />
          )}
          {/* Status dot */}
          <span
            className={`absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-[#202024] ${statusConfig.color} ${statusConfig.glow} z-20`}
            title={statusConfig.label}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-white truncate">
              {lanyard?.discord_user?.global_name || lanyard?.discord_user?.display_name || PERSONAL_INFO.name}
            </span>
            <button
              onClick={handleCopyUsername}
              title="Click to copy handle"
              className="text-[11px] font-semibold text-zinc-400 hover:text-white font-mono cursor-pointer transition-colors shrink-0"
            >
              @{PERSONAL_INFO.discordHandle} {copied && <span className="text-emerald-400 font-sans text-[10px]">(copied!)</span>}
            </button>

            {/* Official Discord Profile Badges */}
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#18181b] border border-white/5 shrink-0">
              <img
                src="/badges/nitro.png"
                alt="Discord Nitro"
                title="Discord Nitro Subscriber"
                className="size-4 object-contain"
              />
              <img
                src="/badges/boost_2_months.png"
                alt="Server Booster"
                title="Server Booster"
                className="size-4 object-contain"
              />
              <img
                src="/badges/active_developer.png"
                alt="Active Developer"
                title="Active Developer"
                className="size-4 object-contain"
              />
              <img
                src="/badges/complete_a_quest.png"
                alt="Completed a Quest"
                title="Completed a Quest"
                className="size-4 object-contain"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-0.5 text-[11px] sm:text-xs">
            <span className={`size-1.5 rounded-full ${statusConfig.color} shrink-0`} />
            <span className="font-medium text-zinc-300 shrink-0">
              {statusConfig.label}
            </span>

            {/* Custom Status */}
            {(customStatusText || customEmoji) && (
              <span className="text-zinc-400 truncate flex items-center gap-1 min-w-0">
                ·
                {customEmoji?.id && (
                  <img
                    src={`https://cdn.discordapp.com/emojis/${customEmoji.id}.${customEmoji.animated ? 'gif' : 'png'}`}
                    alt={customEmoji.name}
                    className="size-3.5 inline-block shrink-0 object-contain"
                  />
                )}
                {customEmoji?.name && !customEmoji.id && <span>{customEmoji.name}</span>}
                {customStatusText && <span className="truncate">&ldquo;{customStatusText}&rdquo;</span>}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Activities Container */}
      <div className="flex flex-col gap-2.5">
        {/* 1. Playing / Working in App (Orca / VS Code / Games) */}
        {primaryActivity && (
          <div className="bg-[#18181b] border border-[#2e2e36] rounded-xl p-3 flex items-center gap-3">
            {activityImageUrl ? (
              <img
                src={activityImageUrl}
                alt={primaryActivity.name}
                className="size-11 sm:size-12 rounded-lg object-cover bg-[#2a2a30] shrink-0 border border-white/5"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="size-11 sm:size-12 rounded-lg bg-[#2a2a30] border border-white/5 flex items-center justify-center shrink-0 text-xs font-bold text-zinc-300">
                APP
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider truncate">
                  Playing {primaryActivity.name}
                </span>
                {activityElapsed && (
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold shrink-0">
                    ⏱ {activityElapsed}
                  </span>
                )}
              </div>

              {primaryActivity.details && (
                <p className="text-xs sm:text-sm font-semibold text-zinc-100 truncate mt-0.5">
                  {primaryActivity.details}
                </p>
              )}
              {primaryActivity.state && (
                <p className="text-[11px] text-zinc-400 truncate">
                  {primaryActivity.state}
                </p>
              )}
              {!primaryActivity.details && !primaryActivity.state && (
                <p className="text-xs font-semibold text-zinc-200 truncate mt-0.5">
                  Active in {primaryActivity.name}
                </p>
              )}
            </div>
          </div>
        )}

        {/* 2. Single Dedicated Spotify Player */}
        {spotify && (
          <a
            href={`https://open.spotify.com/track/${spotify.track_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#18181b] hover:bg-[#1e1e24] border border-emerald-500/25 rounded-xl p-3 flex flex-col gap-2.5 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <img
                src={spotify.album_art_url}
                alt={spotify.album}
                className="size-11 sm:size-12 rounded-md object-cover shrink-0 shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  <span className="animate-pulse">Listening to Spotify</span>
                  <OpenInNewIcon className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-zinc-100 truncate mt-0.5">
                  {spotify.song}
                </p>
                <p className="text-[11px] text-zinc-400 truncate">
                  {spotify.artist}
                </p>
              </div>
              <GraphicEqIcon className="size-4 text-emerald-400 shrink-0 animate-pulse" />
            </div>

            {/* Real-time Track Progress Bar + Timer Counter */}
            <div className="flex flex-col gap-1 pt-0.5">
              <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${spotifyProgressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                <span>{formatTime(spotifyCurrentMs)}</span>
                <span>{formatTime(spotifyTotalMs)}</span>
              </div>
            </div>
          </a>
        )}

        {/* 3. Fallback when neither game/app nor spotify is active */}
        {!primaryActivity && !spotify && (
          <div className="bg-[#18181b] border border-[#27272a]/60 rounded-xl p-3 flex items-center justify-between text-xs text-zinc-400">
            <span className="font-medium text-zinc-300">
              {customStatusText || 'Currently idle & creating'}
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">
              ID: {DISCORD_USER_ID.slice(0, 6)}...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
