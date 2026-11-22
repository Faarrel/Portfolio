'use client';

import { useState, useEffect } from 'react';
import { DiscordIcon, OpenInNewIcon, GraphicEqIcon } from '@/components/ui/material-symbols';
import { PERSONAL_INFO } from '@/data/portfolioData';

interface LanyardActivity {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  timestamps?: { start?: number; end?: number };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
}

interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
    global_name?: string;
    avatar_decoration_data?: {
      asset: string;
      sku_id: string;
    } | null;
  };
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  active_on_discord_web?: boolean;
  active_on_discord_desktop?: boolean;
  active_on_discord_mobile?: boolean;
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

export default function DiscordPresenceCard() {
  const [lanyard, setLanyard] = useState<LanyardData | null>(null);
  const [copied, setCopied] = useState(false);
  const [spotifyProgress, setSpotifyProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchLanyard() {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
        if (!res.ok) throw new Error('Not monitored or error');
        const json = await res.json();
        if (json.success && isMounted) {
          setLanyard(json.data);
        }
      } catch {
        // Fallback state retained gracefully
      }
    }

    fetchLanyard();
    const interval = setInterval(fetchLanyard, 12000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Real-time Spotify progress tracker
  useEffect(() => {
    if (!lanyard?.spotify) return;
    const { start, end } = lanyard.spotify.timestamps;
    const total = end - start;

    const timer = setInterval(() => {
      const now = Date.now();
      const current = Math.min(Math.max(now - start, 0), total);
      setSpotifyProgress((current / total) * 100);
    }, 1000);

    return () => clearInterval(timer);
  }, [lanyard?.spotify]);

  const status = lanyard?.discord_status || 'offline';
  const isOnline = status !== 'offline';

  const statusConfig = {
    online: { label: 'Online', color: 'bg-emerald-500', glow: 'shadow-[0_0_10px_rgba(16,185,129,0.7)]' },
    idle: { label: 'Idle / Away', color: 'bg-amber-400', glow: 'shadow-[0_0_10px_rgba(251,191,36,0.7)]' },
    dnd: { label: 'Do Not Disturb', color: 'bg-rose-500', glow: 'shadow-[0_0_10px_rgba(244,63,94,0.7)]' },
    offline: { label: 'Offline', color: 'bg-zinc-500', glow: '' },
  }[status];

  const spotify = lanyard?.spotify;
  const nonCustomActivity = lanyard?.activities?.find((a) => a.type !== 4);
  const customStatus = lanyard?.activities?.find((a) => a.type === 4)?.state;

  const avatarUrl = lanyard?.discord_user?.avatar
    ? `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${lanyard.discord_user.avatar}.png?size=128`
    : '/logo.png';

  const avatarDecorationUrl = lanyard?.discord_user?.avatar_decoration_data?.asset
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${lanyard.discord_user.avatar_decoration_data.asset}.png`
    : null;

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.discordHandle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-[#202024] border border-[#27272a] p-4 sm:p-5 flex flex-col justify-between gap-4">
      {/* Top Header: Avatar, Name, Status, Device Badges */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={avatarUrl}
              alt="Discord Avatar"
              className="size-11 sm:size-12 rounded-full object-cover bg-[#2a2a30] border border-white/10"
              onError={(e) => {
                (e.target as HTMLElement).setAttribute('src', '/logo.png');
              }}
            />
            {avatarDecorationUrl && (
              <img
                src={avatarDecorationUrl}
                alt="Avatar Decoration"
                className="absolute -top-1.5 -left-1.5 size-14 sm:size-15 pointer-events-none select-none"
              />
            )}
            {/* Live status dot */}
            <span
              className={`absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-[#202024] ${statusConfig.color} ${statusConfig.glow}`}
              title={statusConfig.label}
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-white truncate">
                {lanyard?.discord_user?.global_name || PERSONAL_INFO.name}
              </span>
              <button
                onClick={handleCopyUsername}
                title="Click to copy Discord handle"
                className="text-[11px] font-semibold text-zinc-400 hover:text-white font-mono cursor-pointer transition-colors"
              >
                @{PERSONAL_INFO.discordHandle} {copied && <span className="text-emerald-400 font-sans text-[10px]">(copied!)</span>}
              </button>
            </div>
            
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className={`size-1.5 rounded-full ${statusConfig.color}`} />
                <span className="text-[11px] sm:text-xs font-medium text-zinc-300">
                  {statusConfig.label}
                </span>
              </div>

              {/* Active device icons */}
              {isOnline && (
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 bg-[#2a2a30] px-1.5 py-0.5 rounded">
                  {lanyard?.active_on_discord_desktop && <span title="Active on Desktop">💻</span>}
                  {lanyard?.active_on_discord_mobile && <span title="Active on Mobile">📱</span>}
                  {lanyard?.active_on_discord_web && <span title="Active on Web">🌐</span>}
                </div>
              )}

              {customStatus && (
                <span className="text-[11px] sm:text-xs text-zinc-400 truncate max-w-[140px] sm:max-w-[170px]">
                  · &ldquo;{customStatus}&rdquo;
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Discord Logo Badge */}
        <div className="size-8 rounded-lg bg-[#2a2a30] flex items-center justify-center shrink-0">
          <DiscordIcon className="size-4 text-[#5865F2]" />
        </div>
      </div>

      {/* Middle: Live Activity or Spotify or Fallback */}
      {spotify ? (
        <a
          href={`https://open.spotify.com/track/${spotify.track_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#18181b] hover:bg-[#1e1e24] border border-emerald-500/25 rounded-xl p-3 flex flex-col gap-2 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <img
              src={spotify.album_art_url}
              alt={spotify.album}
              className="size-11 rounded-md object-cover shrink-0 shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                <span className="animate-pulse">Listening to Spotify</span>
                <OpenInNewIcon className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs font-semibold text-zinc-100 truncate mt-0.5">{spotify.song}</p>
              <p className="text-[11px] text-zinc-400 truncate">{spotify.artist}</p>
            </div>
            <GraphicEqIcon className="size-4 text-emerald-400 shrink-0 animate-pulse" />
          </div>

          {/* Real-time Track Progress Bar */}
          <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${spotifyProgress}%` }}
            />
          </div>
        </a>
      ) : nonCustomActivity ? (
        <div className="bg-[#18181b] border border-[#2e2e36] rounded-xl p-3 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-[#2a2a30] flex items-center justify-center shrink-0 text-xs font-bold text-zinc-200">
            {nonCustomActivity.name.toLowerCase().includes('visual studio code') ? '💻' : '🎮'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              {nonCustomActivity.name.toLowerCase().includes('visual studio code') ? 'Coding Now' : 'Playing Game'}
            </div>
            <p className="text-xs font-semibold text-zinc-100 truncate mt-0.5">
              {nonCustomActivity.name}
            </p>
            {nonCustomActivity.details && (
              <p className="text-[11px] text-zinc-400 truncate">{nonCustomActivity.details}</p>
            )}
            {nonCustomActivity.state && !nonCustomActivity.details && (
              <p className="text-[11px] text-zinc-400 truncate">{nonCustomActivity.state}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#18181b] border border-[#27272a]/60 rounded-xl p-3 flex items-center justify-between text-xs text-zinc-400">
          <span className="font-medium">
            {isOnline ? 'Active on Discord' : 'Available for commissions & projects'}
          </span>
          <span className="text-[11px] text-zinc-500 font-mono">ID: {DISCORD_USER_ID.slice(0, 6)}...</span>
        </div>
      )}

      {/* Action Footer */}
      <a
        href={PERSONAL_INFO.socials.discord}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-[#2a2a30] hover:bg-[#32323a] text-zinc-100 hover:text-white py-2 px-3.5 rounded-lg flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer"
      >
        <span>Message on Discord</span>
        <OpenInNewIcon className="size-3.5 text-zinc-400" />
      </a>
    </div>
  );
}
