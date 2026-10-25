'use client';

import React, { useState } from 'react';
import { soundEngine } from '@/lib/audio';
import { LeaderboardEntry, getTopLeaderboardPlayers } from '@/lib/game-rules';
import { ProfileData } from './ProfileModal';

interface LeaderboardProps {
  currentUserProfile: ProfileData;
  onOpenProfile?: () => void;
  className?: string;
}

export default function Leaderboard({
  currentUserProfile,
  onOpenProfile,
  className = '',
}: LeaderboardProps) {
  const [timeframe, setTimeframe] = useState<'season' | 'weekly' | 'alltime'>('season');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  // Pool of players including current user and friends
  const basePool: LeaderboardEntry[] = [
    {
      id: 'player-priya',
      name: 'Priya_Logic',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDiJi0uMDriPNuRTru9PkE3ObF-dIPL66f_clQRqRia2ycaY18uHQvEnmyKciG-dzHEkhIqlMk9_zLI8cvTsSOT9FDk8w-HunjjA4J73mrSE5DQZw3GVk4671HZ6y6FuqnUQZ7zsLG3PHPhZkWFS74Pt6q3YeOmzyt_kJmDP4CmDp9gqD5t4HOF3wRtgFsMAC4ga8j6t_cq8oZRBHN6c3Wkvv6Xt77gCjF_A08pMoqH',
      points: 1510,
      streak: 5,
      badge: '👑 Master',
    },
    {
      id: 'player-you',
      name: currentUserProfile.name,
      avatar: currentUserProfile.avatar,
      points: currentUserProfile.points,
      streak: currentUserProfile.streak,
      badge: '★ Host',
      isCurrentUser: true,
    },
    {
      id: 'player-aarav',
      name: 'Aarav_Pro',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCsBex66NWcz17UR8hUOdlV2dNEO4NjNRV5MXETMXAVa2yFlSauk-uY6kA0XUVicN85OKfNdKyE03FLz8Y6asLKq8RtpRADNToOLf0IFZ_JXcPbfTQc_RMulyuPcFKkghVy8gfDpCYFXRPm_rKLXiELJTS_km1EoW86GGs7hSCuzN8wPJ-gE272dWevjGDlPOhuh_S8vK2xZBaeIVpU92sZQHcoec6ccrCU7ob_uMKq',
      points: 1380,
      streak: 3,
      badge: '⚡ Blitz Wiz',
    },
    {
      id: 'player-kabir',
      name: 'Kabir_Quant',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDAM8EaxfG5HXqtBAbpETF28wp4Rt9H3iQBqZL5bOXYTLJyF-yvRd7lG8Tj41rmpmOfx0-AZaGRNDfUKDoEdJm40sryYQpyXZSY9WsfzbzH5mRq17r7AcYPmshYBCOyHhQaz56FmblSBdEOx1kTPAw4vnRmtZyKzs3hgNKyoP6vG7nAm-iAVgrfvWKncHchN0se4N0DLWN8NfhQKRmxxT4jj8VEXYMOGHtloDlZWEyY',
      points: 1290,
      streak: 2,
      badge: '📐 Quant Wiz',
    },
    {
      id: 'player-rohan',
      name: 'Rohan_Matrix',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAqb2BeJFiO1Xzk0h3Ao2wv1Ohe0ZFq5OJn_CghONsX0Os7Okb-d3M6UnSpc0V-_NGsXUwyjeG_H6JToSf4psfdPhxbAjbwSE8bqeWml-lDRqCDOoAWQ5gw7iQat6mY2zyQdbRCQZFeyg91tydTeFJ2GBMcTXP1RXer_9Vn32kPX0RYvhAjqj4Oq7tnx5Qz-4cHtF56VjcG2551hOfs8K16j9HTVxOxRaH5r3LuSjoq',
      points: 1140,
      streak: 1,
      badge: '🧩 Tactician',
    },
    {
      id: 'player-neha',
      name: 'Neha_Gamer',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDjn3Qmwn_P2SUki0FW5Po_xQjM0opXCZ4NI7cw38zNtGlq3YUPBGNrM2cQs85T_nb8_fvUPxWgGwhSaw4KghmnuhC8tPBEwad9rgTPoUzKJPx3J54HK5_UvmYOAof4aAglm3vJl_C-3Ik7BaJb4DXGgTXZNJAM-pM16oJAGxqd__V2vlQVezZBL-7avYh4V0iRI0dBHNVfOjNchkF0fD40umFpfUZ0odLoCo4XWPjU',
      points: 980,
      streak: 0,
      badge: '🎯 Challenger',
    },
  ];

  // Adjust scores slightly based on timeframe filter to make interaction realistic
  const adjustedPool = basePool.map((p) => {
    let multiplier = 1;
    if (timeframe === 'weekly') multiplier = 0.6;
    if (timeframe === 'alltime') multiplier = 2.4;
    return {
      ...p,
      points: Math.round(p.points * multiplier),
    };
  });

  const top5 = getTopLeaderboardPlayers(adjustedPool, 5);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-amber-950 shadow-[0_0_10px_rgba(245,158,11,0.6)]">
          <span className="material-symbols-outlined text-[15px] font-black">emoji_events</span>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 flex items-center justify-center text-slate-800 shadow">
          <span className="font-label-code text-[11px] font-black">2</span>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 flex items-center justify-center text-white shadow">
          <span className="font-label-code text-[11px] font-black">3</span>
        </div>
      );
    }
    return (
      <div className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center text-outline font-label-code text-[11px] font-bold">
        {rank}
      </div>
    );
  };

  return (
    <section
      className={`rounded-2xl bg-surface-container p-4 shadow-xl border border-surface-container-highest flex flex-col gap-3 relative overflow-hidden ${className}`}
    >
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-secondary/10 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-tertiary-container/30 flex items-center justify-center text-tertiary shadow-sm">
            <span className="material-symbols-outlined text-[19px]">military_tech</span>
          </div>
          <div>
            <h3 className="font-headline-md text-base font-bold text-on-surface leading-tight">
              Arena Leaderboard
            </h3>
            <span className="font-label-code text-[10px] text-tertiary uppercase tracking-wider font-semibold">
              Top 5 Champions
            </span>
          </div>
        </div>

        {/* Timeframe selector pills */}
        <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-xl border border-surface-container-highest text-[10px] font-label-code">
          {(
            [
              { id: 'season', label: 'Season 7' },
              { id: 'weekly', label: 'Weekly' },
              { id: 'alltime', label: 'All-Time' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => {
                soundEngine.playClick();
                setTimeframe(t.id);
              }}
              className={`px-2 py-0.5 rounded-lg transition-all active:scale-95 ${
                timeframe === t.id
                  ? 'bg-surface-container-high text-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 5 Players List */}
      <div className="flex flex-col gap-2">
        {top5.map((player) => {
          const isSelected = selectedPlayer === player.id;
          const isSelf = player.isCurrentUser;

          return (
            <div
              key={player.id}
              onClick={() => {
                soundEngine.playClick();
                setSelectedPlayer(isSelected ? null : player.id);
                if (isSelf && onOpenProfile) {
                  onOpenProfile();
                }
              }}
              className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer active:scale-[0.99] ${
                isSelf
                  ? 'bg-secondary/10 border-secondary/50 shadow-[0_0_12px_rgba(78,222,163,0.2)]'
                  : 'bg-surface-container-high/80 border-surface-container-highest hover:bg-surface-container-high'
              }`}
            >
              {/* Left: Rank, Avatar, Name & Badge */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0">{getRankBadge(player.rank || 0)}</div>

                <div className="relative shrink-0">
                  <img
                    alt={player.name}
                    src={player.avatar}
                    className={`w-10 h-10 rounded-xl object-cover ring-2 ${
                      player.rank === 1
                        ? 'ring-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                        : isSelf
                        ? 'ring-secondary'
                        : 'ring-surface-bright'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  {isSelf && (
                    <span className="absolute -bottom-1 -right-1 bg-secondary text-surface font-label-code text-[8px] font-black px-1 rounded shadow">
                      YOU
                    </span>
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-body-sm text-[13px] font-semibold truncate ${
                        isSelf ? 'text-secondary' : 'text-on-surface'
                      }`}
                    >
                      {player.name}
                    </span>
                    {player.badge && (
                      <span className="hidden xs:inline-block font-label-code text-[9px] px-1.5 py-0.2 rounded bg-surface-container-lowest text-tertiary">
                        {player.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-label-code text-on-surface-variant">
                    {player.streak !== undefined && player.streak > 0 && (
                      <span className="text-tertiary">🔥 {player.streak}x streak</span>
                    )}
                    <span>•</span>
                    <span className="text-outline">Rank #{player.rank}</span>
                  </div>
                </div>
              </div>

              {/* Right: Points */}
              <div className="flex flex-col items-end shrink-0 pl-2">
                <span
                  className={`font-label-numeric-md text-[14px] font-bold ${
                    player.rank === 1
                      ? 'text-tertiary drop-shadow-[0_0_8px_rgba(255,185,95,0.3)]'
                      : isSelf
                      ? 'text-secondary'
                      : 'text-on-surface'
                  }`}
                >
                  {player.points.toLocaleString()}
                </span>
                <span className="font-label-code text-[9px] text-on-surface-variant uppercase">
                  pts
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* User Standing & Reset Footnote */}
      <div className="flex items-center justify-between pt-1 px-1 text-[11px] font-label-code text-on-surface-variant border-t border-surface-container-highest">
        <div className="flex items-center gap-1 text-secondary">
          <span className="material-symbols-outlined text-[13px]">military_tech</span>
          <span>Your Rank: #2 in Arena-7</span>
        </div>
        <span className="text-outline">Resets in 2d 14h</span>
      </div>
    </section>
  );
}
