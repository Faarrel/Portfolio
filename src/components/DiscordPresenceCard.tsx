'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

export default function DiscordPresenceCard() {
  const [lanyard, setLanyard] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchLanyard();
    const interval = setInterval(fetchLanyard, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

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

  return (
    <div className="rounded-2xl overflow-hidden bg-[#202024] border border-[#27272a] p-4 sm:p-5 flex flex-col justify-between gap-4">
      {/* Top Header: Avatar, Name, Status indicator */}
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
            {/* Status dot indicator */}
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
              <span className="text-[11px] font-semibold text-zinc-400 font-mono">
                @{PERSONAL_INFO.discordHandle}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`size-1.5 rounded-full ${statusConfig.color}`} />
              <span className="text-[11px] sm:text-xs font-medium text-zinc-300">
                {statusConfig.label}
              </span>
              {customStatus && (
                <span className="text-[11px] sm:text-xs text-zinc-400 truncate max-w-[150px] sm:max-w-[180px]">
                  · &ldquo;{customStatus}&rdquo;
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Discord Tag Icon */}
        <div className="size-8 rounded-lg bg-[#2a2a30] flex items-center justify-center shrink-0">
          <DiscordIcon className="size-4 text-[#5865F2]" />
        </div>
      </div>

      {/* Middle: Live Activity or Spotify or Fallback */}
      {spotify ? (
        <div className="bg-[#18181b] border border-emerald-500/20 rounded-xl p-3 flex items-center gap-3">
          <img
            src={spotify.album_art_url}
            alt={spotify.album}
            className="size-10 rounded-md object-cover shrink-0 shadow-sm"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              <span className="animate-pulse">Listening to Spotify</span>
            </div>
            <p className="text-xs font-semibold text-zinc-100 truncate mt-0.5">{spotify.song}</p>
            <p className="text-[11px] text-zinc-400 truncate">{spotify.artist}</p>
          </div>
          <GraphicEqIcon className="size-4 text-emerald-400 shrink-0 animate-pulse" />
        </div>
      ) : nonCustomActivity ? (
        <div className="bg-[#18181b] border border-[#2e2e36] rounded-xl p-3 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-[#2a2a30] flex items-center justify-center shrink-0 text-xs font-bold text-zinc-200">
            🎮
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Active Now
            </div>
            <p className="text-xs font-semibold text-zinc-100 truncate mt-0.5">
              {nonCustomActivity.name}
            </p>
            {nonCustomActivity.details && (
              <p className="text-[11px] text-zinc-400 truncate">{nonCustomActivity.details}</p>
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
