'use client';

import { useState, useEffect } from 'react';
import { GraphicEqIcon } from '@/components/ui/material-symbols';
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

interface DiscordBadge {
  id?: string;
  name: string;
  desc: string;
  src: string;
  link?: string;
}

const DISCORD_BADGES: DiscordBadge[] = [
  {
    name: 'Gifting Legend',
    desc: 'Gifting Legend. 100 gifts given',
    src: '/badges/gifting-legend.webp',
  },
  {
    name: 'Game Time Eternal',
    desc: 'Game Time Eternal. 5,881 hours of games played',
    src: '/badges/game-time-eternal.webp',
  },
  {
    name: 'Nitro Emerald',
    desc: 'Nitro Emerald. Subscriber since 5/17/23',
    src: '/badges/nitro-emerald.webp',
  },
  {
    name: 'Game Variety Universalist',
    desc: 'Game Variety Universalist. 197 games played',
    src: '/badges/game-variety-universalist.webp',
  },
  {
    name: 'Server Boosting',
    desc: 'Server Boosting. Boosting since 11/10/23',
    src: '/badges/server-booster-exact.webp',
  },
];

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

function getAssetUrl(appId?: string, asset?: string) {
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

function getActivityAssets(activity?: LanyardActivity) {
  if (!activity) return { largeUrl: null, smallUrl: null };
  const appId = activity.application_id;
  const largeAsset = activity.assets?.large_image;
  const smallAsset = activity.assets?.small_image;

  let largeUrl: string | null = null;
  if (largeAsset) {
    largeUrl = getAssetUrl(appId, largeAsset);
  } else if (appId === '1545653843239374848' || activity.name.toLowerCase() === 'orca') {
    // Official Orca Application Icon (Discord RPC)
    largeUrl = 'https://cdn.discordapp.com/app-icons/1545653843239374848/45fa5380de015ee75348b94328a56a61.png';
  } else if (appId === '363445589247131668' || activity.name.toLowerCase() === 'roblox') {
    // Official Roblox Application Icon (Discord Game Detection)
    largeUrl = 'https://cdn.discordapp.com/app-icons/363445589247131668/f2b60e350a2097289b3b0b877495e55f.png';
  } else if (appId) {
    largeUrl = smallAsset ? getAssetUrl(appId, smallAsset) : null;
  }

  let smallUrl: string | null = null;
  if (smallAsset && (largeAsset || appId === '1545653843239374848' || appId === '363445589247131668' || activity.name.toLowerCase() === 'roblox')) {
    smallUrl = getAssetUrl(appId, smallAsset);
  }

  return { largeUrl, smallUrl };
}

export default function DiscordPresenceCard() {
  const [lanyard, setLanyard] = useState<LanyardData | null>(null);
  const [badges, setBadges] = useState<DiscordBadge[]>(DISCORD_BADGES);
  const [copied, setCopied] = useState(false);
  const [spotifyCurrentMs, setSpotifyCurrentMs] = useState(0);
  const [activityElapsed, setActivityElapsed] = useState('');

  // Real-time Discord profile badges from dcdn.dstn.to
  useEffect(() => {
    let isMounted = true;

    async function fetchBadges() {
      try {
        const res = await fetch(`https://dcdn.dstn.to/profile/${DISCORD_USER_ID}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data && Array.isArray(data.badges) && data.badges.length > 0) {
          const liveBadges: DiscordBadge[] = data.badges.map(
            (b: { id: string; description: string; icon: string; link?: string }) => ({
              id: b.id,
              name: b.description,
              desc: b.description,
              src: `https://cdn.discordapp.com/badge-icons/${b.icon}.png`,
              link: b.link,
            })
          );
          if (isMounted) {
            setBadges(liveBadges);
          }
        }
      } catch {
        // Fallback state retained gracefully
      }
    }

    fetchBadges();
    const interval = setInterval(fetchBadges, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

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
  const activityStart = primaryActivity?.timestamps?.start;

  useEffect(() => {
    if (!activityStart) return;
    const timer = setInterval(() => {
      setActivityElapsed(formatElapsed(activityStart));
    }, 1000);

    return () => clearInterval(timer);
  }, [activityStart]);

  const displayElapsed = activityStart ? (activityElapsed || formatElapsed(activityStart)) : '';

  const status = lanyard?.discord_status || 'offline';

  const statusConfig = {
    online: { label: 'Online', color: 'bg-emerald-500' },
    idle: { label: 'Idle / Away', color: 'bg-amber-400' },
    dnd: { label: 'Do Not Disturb', color: 'bg-rose-500' },
    offline: { label: 'Offline', color: 'bg-zinc-500' },
  }[status];

  const spotify = lanyard?.spotify;
  const customActivity = lanyard?.activities?.find((a) => a.type === 4);
  const customStatusText = customActivity?.state;
  const customEmoji = customActivity?.emoji;

  const avatarUrl = lanyard?.discord_user?.avatar
    ? `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${lanyard.discord_user.avatar}.png?size=128`
    : 'https://cdn.discordapp.com/avatars/938045579215380510/7395402e2522fb277f4577f23d0bffc0.webp?size=160';

  const decorationAsset = lanyard?.discord_user?.avatar_decoration_data?.asset;
  const avatarDecorationUrl = decorationAsset
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${decorationAsset}.png?size=160&passthrough=true`
    : null;

  const { largeUrl: activityLargeUrl, smallUrl: activitySmallUrl } = getActivityAssets(primaryActivity);

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.discordHandle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const spotifyTotalMs = spotify ? spotify.timestamps.end - spotify.timestamps.start : 0;
  const spotifyProgressPercent = spotifyTotalMs > 0 ? (spotifyCurrentMs / spotifyTotalMs) * 100 : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Header: Avatar, Name, Handle, Badges, Status */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative shrink-0 size-12 sm:size-14 flex items-center justify-center">
          <img
            src={avatarUrl}
            alt="Discord Avatar"
            className="size-full object-contain"
            onError={(e) => {
              (e.target as HTMLElement).setAttribute('src', '/logo.webp');
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
            className={`absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-[#202024] ${statusConfig.color} z-20`}
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
              className="text-xs font-semibold text-zinc-400 hover:text-white font-mono cursor-pointer transition-colors shrink-0"
            >
              @{PERSONAL_INFO.discordHandle} {copied && <span className="text-zinc-300 font-sans text-xs">(copied!)</span>}
            </button>

            {/* Official Discord Profile Badges (Real-time from dcdn / fallback) */}
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#18181b] border border-white/5 shrink-0">
              {badges.map((b) => (
                <img
                  key={b.id || b.name}
                  src={b.src}
                  alt={b.name}
                  title={b.desc}
                  className="size-4 sm:size-4.5 object-contain hover:scale-110 transition-transform"
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-0.5 text-xs">
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

      {/* Integrated Activity Section (Monochrome & Official Dual-Icon) */}
      {(primaryActivity || spotify) && (
        <div className="pt-3.5 border-t border-white/[0.08] flex flex-col gap-3">
          {/* 1. Playing / Working in App (Orca / VS Code / Games) */}
          {primaryActivity && (
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                {activityLargeUrl ? (
                  <img
                    src={activityLargeUrl}
                    alt={primaryActivity.name}
                    className="size-11 sm:size-12 rounded-xl object-cover bg-white/5 border border-white/10 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="size-11 sm:size-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-xs font-bold text-zinc-300">
                    APP
                  </div>
                )}
                {activitySmallUrl && (
                  <img
                    src={activitySmallUrl}
                    alt={primaryActivity.assets?.small_text || 'status'}
                    title={primaryActivity.assets?.small_text}
                    className="absolute -bottom-1 -right-1 size-5 rounded-full border-2 border-[#202024] object-contain bg-[#18181b]"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider truncate">
                    Playing {primaryActivity.name}
                  </span>
                  {displayElapsed && (
                    <span className="text-xs font-mono text-zinc-400 font-medium shrink-0">
                      ⏱ {displayElapsed}
                    </span>
                  )}
                </div>

                {primaryActivity.details && (
                  <p className="text-xs sm:text-sm font-semibold text-zinc-100 truncate mt-0.5">
                    {primaryActivity.details}
                  </p>
                )}
                {primaryActivity.state && (
                  <p className="text-xs text-zinc-400 truncate mt-0.5">
                    {primaryActivity.state}
                  </p>
                )}
                {!primaryActivity.details && !primaryActivity.state && (
                  <p className="text-xs sm:text-sm font-semibold text-zinc-200 truncate mt-0.5">
                    Active in {primaryActivity.name}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 2. Single Dedicated Spotify Player (Monochrome Scheme) */}
          {spotify && (
            <a
              href={`https://open.spotify.com/track/${spotify.track_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-2"
            >
              <div className="flex items-center gap-3">
                <img
                  src={spotify.album_art_url}
                  alt={spotify.album}
                  className="size-11 sm:size-12 rounded-lg object-cover shrink-0 shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    <span>Listening to Spotify</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-zinc-100 truncate mt-0.5">
                    {spotify.song}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    {spotify.artist}
                  </p>
                </div>
                <GraphicEqIcon className="size-4 text-zinc-300 shrink-0" />
              </div>

              {/* Real-time Track Progress Bar + Timer Counter (Monochrome) */}
              <div className="flex flex-col gap-1 pt-0.5">
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-zinc-200 h-full transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${spotifyProgressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>{formatTime(spotifyCurrentMs)}</span>
                  <span>{formatTime(spotifyTotalMs)}</span>
                </div>
              </div>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
