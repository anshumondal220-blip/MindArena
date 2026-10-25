'use client';

import React, { useState } from 'react';
import { soundEngine } from '@/lib/audio';
import { TabKey } from './BottomNav';
import { ProfileData } from './ProfileModal';
import Leaderboard from './Leaderboard';

interface LobbyViewProps {
  roomCode: string;
  onSetRoomCode: (code: string) => void;
  onSelectTab: (tab: TabKey) => void;
  onOpenVoiceDrawer: () => void;
  profile: ProfileData;
  onOpenProfile: () => void;
}

export default function LobbyView({
  roomCode,
  onSetRoomCode,
  onSelectTab,
  onOpenVoiceDrawer,
  profile,
  onOpenProfile,
}: LobbyViewProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [customRoomInput, setCustomRoomInput] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  // Reaction counters
  const [reactions, setReactions] = useState<{ [key: string]: number }>({
    '🔥': 12,
    '🧠': 8,
    '👏': 5,
    '⚡': 17,
    '🎯': 9,
  });

  const handleCopyCode = () => {
    soundEngine.playClick();
    navigator.clipboard?.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = () => {
    soundEngine.playClick();
    if (navigator.share) {
      navigator.share({
        title: 'MindArena Battle Room',
        text: `Hey! Join my MindArena match to play with friends! Room Code: ${roomCode}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 1500);
    }
  };

  const handleReaction = (emoji: string) => {
    soundEngine.playSoundboardFx('calculator');
    setReactions((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }));
  };

  const handleSwitchRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customRoomInput.trim()) {
      soundEngine.playClick();
      onSetRoomCode(customRoomInput.trim().toUpperCase());
      setCustomRoomInput('');
    }
  };

  const handleStartMatch = (targetTab: TabKey) => {
    soundEngine.playAirhorn();
    setIsStarting(true);
    setTimeout(() => {
      setIsStarting(false);
      onSelectTab(targetTab);
    }, 800);
  };

  return (
    <div className="flex flex-col w-full gap-4 max-w-md mx-auto">
      {/* Prominent Room Code Header Card */}
      <section className="relative overflow-hidden rounded-2xl bg-surface-container-high p-4 shadow-xl border border-surface-container-highest">
        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 h-28 w-28 rounded-full bg-secondary/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onOpenProfile();
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-2.5 py-0.5 font-label-code text-[11px] text-secondary hover:bg-secondary/25 transition-all cursor-pointer border border-secondary/30"
              >
                <span className="h-2 w-2 rounded-full bg-secondary animate-ping" />
                Host: {profile.name}
                <span className="material-symbols-outlined text-[13px] ml-0.5">edit</span>
              </button>
              <span className="rounded-full bg-surface-container px-2.5 py-0.5 font-label-code text-[11px] text-on-surface-variant">
                Private Pod
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onOpenProfile();
                }}
                aria-label="Open Profile"
                title="Profile & Friend Codes"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container hover:bg-surface-bright active:scale-90 transition-all text-secondary"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">badge</span>
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setShowQr(!showQr);
                }}
                aria-label="Quick QR Code"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container hover:bg-surface-bright active:scale-90 transition-all text-primary"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onOpenVoiceDrawer();
                }}
                aria-label="Open Voice Squad"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container hover:bg-surface-bright active:scale-90 transition-all text-secondary"
                type="button"
                title="Squad Voice Chat"
              >
                <span className="material-symbols-outlined text-[18px]">volume_up</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1 gap-2">
            <div>
              <span className="font-label-code text-[11px] text-on-surface-variant uppercase tracking-wider block">
                Battlefield Passcode
              </span>
              <div className="flex items-center gap-2">
                <span className="font-label-numeric-lg text-[22px] font-bold text-primary tracking-widest drop-shadow-[0_0_12px_rgba(192,193,255,0.4)]">
                  {roomCode}
                </span>
                <span className="inline-flex items-center rounded-full bg-surface-container-highest px-2 py-0.5 font-label-code text-[10px] text-secondary">
                  SYNCED
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 sm:pt-0">
              <button
                onClick={handleCopyCode}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 font-label-code text-[12px] font-semibold text-on-primary shadow-[0_0_16px_rgba(192,193,255,0.25)] hover:bg-primary-fixed active:scale-95 transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {copied ? 'done' : 'content_copy'}
                </span>
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <button
                onClick={handleShare}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg bg-surface-container px-3 py-2 font-label-code text-[12px] font-semibold text-on-surface hover:bg-surface-bright active:scale-95 transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">share</span>
                <span>{shared ? 'Link Sent!' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Expandable QR view modal toggle */}
          {showQr && (
            <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-3 border border-surface-container-highest animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-lg bg-on-surface p-1 flex items-center justify-center text-surface shadow">
                  <span className="material-symbols-outlined text-[32px]">qr_code</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-body-sm text-[13px] font-semibold text-on-surface">
                    Scan to Instant-Join
                  </span>
                  <span className="font-label-code text-[11px] text-outline">
                    mindarena.gg/join/{roomCode}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowQr(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Connected Friends Lobby (4/4 Ready) */}
      <section className="flex flex-col gap-3 rounded-2xl bg-surface-container p-4 shadow-lg border border-surface-container-high/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">groups</span>
            <h2 className="font-headline-md text-[17px] font-bold text-on-surface">Live Lobby</h2>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container/30 px-2.5 py-1 font-label-code text-[11px] font-semibold text-secondary-fixed">
            <span className="h-2 w-2 rounded-full bg-secondary-fixed animate-pulse" />
            4/4 PLAYERS READY
          </span>
        </div>

        {/* 4 Player Slots Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Player 1: You (Host) - Dynamic from Profile */}
          <div
            onClick={() => {
              soundEngine.playClick();
              onOpenProfile();
            }}
            title="Click to edit profile & share room code"
            className="flex flex-col gap-2 rounded-xl bg-surface-container-high p-2.5 transition-all border border-secondary/40 hover:border-secondary cursor-pointer group shadow-sm active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <div className="relative shrink-0">
                <img
                  alt={profile.name}
                  className="h-11 w-11 rounded-full object-cover shadow-[0_0_10px_rgba(78,222,163,0.3)] ring-2 ring-secondary"
                  src={profile.avatar}
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-surface text-[10px] font-bold">
                  ★
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-body-sm text-[12px] font-semibold text-on-surface truncate group-hover:text-secondary transition-colors">
                    {profile.name}
                  </span>
                  <span className="font-label-code text-[9px] text-tertiary">HOST</span>
                </div>
                <span className="font-label-numeric-md text-[13px] text-secondary font-medium">
                  {profile.points.toLocaleString()} pts
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="rounded bg-surface-container-lowest px-1.5 py-0.5 font-label-code text-[10px] text-tertiary">
                🔥 {profile.streak}x streak
              </span>
              <span className="rounded-full bg-secondary/20 px-2 py-0.5 font-label-code text-[10px] font-bold text-secondary flex items-center gap-0.5">
                <span>READY</span>
                <span className="material-symbols-outlined text-[10px]">edit</span>
              </span>
            </div>
          </div>

          {/* Player 2: Aarav_Pro */}
          <div className="flex flex-col gap-2 rounded-xl bg-surface-container-high p-2.5 transition-all border border-surface-container-highest">
            <div className="flex items-center gap-2">
              <div className="relative shrink-0">
                <img
                  alt="Aarav Avatar"
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-primary"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsBex66NWcz17UR8hUOdlV2dNEO4NjNRV5MXETMXAVa2yFlSauk-uY6kA0XUVicN85OKfNdKyE03FLz8Y6asLKq8RtpRADNToOLf0IFZ_JXcPbfTQc_RMulyuPcFKkghVy8gfDpCYFXRPm_rKLXiELJTS_km1EoW86GGs7hSCuzN8wPJ-gE272dWevjGDlPOhuh_S8vK2xZBaeIVpU92sZQHcoec6ccrCU7ob_uMKq"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-secondary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-body-sm text-[12px] font-semibold text-on-surface truncate">
                  Aarav_Pro
                </span>
                <span className="font-label-numeric-md text-[13px] text-secondary font-medium">
                  1,380 pts
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="rounded bg-surface-container-lowest px-1.5 py-0.5 font-label-code text-[10px] text-tertiary">
                ⚡ 3x streak
              </span>
              <span className="rounded-full bg-secondary/20 px-2 py-0.5 font-label-code text-[10px] font-bold text-secondary">
                READY
              </span>
            </div>
          </div>

          {/* Player 3: Priya_Logic */}
          <div className="flex flex-col gap-2 rounded-xl bg-surface-container-high p-2.5 transition-all border border-surface-container-highest">
            <div className="flex items-center gap-2">
              <div className="relative shrink-0">
                <img
                  alt="Priya Avatar"
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-tertiary"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiJi0uMDriPNuRTru9PkE3ObF-dIPL66f_clQRqRia2ycaY18uHQvEnmyKciG-dzHEkhIqlMk9_zLI8cvTsSOT9FDk8w-HunjjA4J73mrSE5DQZw3GVk4671HZ6y6FuqnUQZ7zsLG3PHPhZkWFS74Pt6q3YeOmzyt_kJmDP4CmDp9gqD5t4HOF3wRtgFsMAC4ga8j6t_cq8oZRBHN6c3Wkvv6Xt77gCjF_A08pMoqH"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-secondary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-body-sm text-[12px] font-semibold text-on-surface truncate">
                  Priya_Logic
                </span>
                <span className="font-label-numeric-md text-[13px] text-secondary font-medium">
                  1,510 pts
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="rounded bg-surface-container-lowest px-1.5 py-0.5 font-label-code text-[10px] text-primary">
                👑 Master
              </span>
              <span className="rounded-full bg-secondary/20 px-2 py-0.5 font-label-code text-[10px] font-bold text-secondary">
                READY
              </span>
            </div>
          </div>

          {/* Player 4: Kabir_Quant */}
          <div className="flex flex-col gap-2 rounded-xl bg-surface-container-high p-2.5 transition-all border border-surface-container-highest">
            <div className="flex items-center gap-2">
              <div className="relative shrink-0">
                <img
                  alt="Kabir Avatar"
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-secondary"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAM8EaxfG5HXqtBAbpETF28wp4Rt9H3iQBqZL5bOXYTLJyF-yvRd7lG8Tj41rmpmOfx0-AZaGRNDfUKDoEdJm40sryYQpyXZSY9WsfzbzH5mRq17r7AcYPmshYBCOyHhQaz56FmblSBdEOx1kTPAw4vnRmtZyKzs3hgNKyoP6vG7nAm-iAVgrfvWKncHchN0se4N0DLWN8NfhQKRmxxT4jj8VEXYMOGHtloDlZWEyY"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-secondary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-body-sm text-[12px] font-semibold text-on-surface truncate">
                  Kabir_Quant
                </span>
                <span className="font-label-numeric-md text-[13px] text-secondary font-medium">
                  1,290 pts
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="rounded bg-surface-container-lowest px-1.5 py-0.5 font-label-code text-[10px] text-secondary-fixed">
                📐 Quant Wiz
              </span>
              <span className="rounded-full bg-secondary/20 px-2 py-0.5 font-label-code text-[10px] font-bold text-secondary">
                READY
              </span>
            </div>
          </div>
        </div>

        {/* Quick Join another room input */}
        <form onSubmit={handleSwitchRoom} className="flex items-center gap-2 rounded-xl bg-surface-container-lowest p-1.5 border border-surface-container-highest">
          <div className="flex items-center pl-2 text-outline">
            <span className="font-label-code text-[13px] font-bold">#</span>
          </div>
          <input
            value={customRoomInput}
            onChange={(e) => setCustomRoomInput(e.target.value)}
            className="w-full bg-transparent font-label-code text-[12px] uppercase tracking-wider text-on-surface placeholder:text-outline focus:outline-none"
            placeholder="ENTER ROOM CODE..."
            type="text"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-surface-container-highest px-3 py-1.5 font-label-code text-[11px] font-semibold text-on-surface hover:text-primary active:scale-95 transition-all"
          >
            Switch Room
          </button>
        </form>

        {/* Live Tactile Emoji Reactions Bar */}
        <div className="flex items-center justify-between rounded-xl bg-surface-container-high/60 px-3 py-2 border border-surface-container-highest">
          <span className="font-label-code text-[11px] text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">bolt</span> Hype:
          </span>
          <div className="flex items-center gap-1.5">
            {Object.entries(reactions).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                type="button"
                className="group relative flex items-center gap-1 rounded-full bg-surface-container px-2.5 py-1 text-xs hover:bg-surface-bright active:scale-125 transition-transform"
              >
                <span>{emoji}</span>
                <span className="font-label-code text-[10px] text-tertiary font-bold">
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Top 5 Leaderboard Champions */}
      <Leaderboard
        currentUserProfile={profile}
        onOpenProfile={onOpenProfile}
      />

      {/* Game Mode Selector Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h3 className="font-headline-md text-[17px] font-bold text-on-surface">
            Choose Arena Battle
          </h3>
          <p className="font-body-sm text-[12px] text-on-surface-variant">
            Host chooses mode for all 4 players
          </p>
        </div>
        <span className="rounded bg-surface-container-high px-2 py-0.5 font-label-code text-[10px] text-primary font-bold">
          BEST OF 3
        </span>
      </div>

      {/* Game Mode 1: Classic Ludo Arena */}
      <article className="group relative overflow-hidden rounded-2xl bg-surface-container p-4 shadow-lg transition-all hover:bg-surface-container-high border border-surface-container-high/80">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-secondary/10 blur-xl pointer-events-none" />
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/15 px-2.5 py-0.5 font-label-code text-[10px] font-semibold text-secondary w-fit">
              <span className="material-symbols-outlined text-[13px]">casino</span>
              2-4 Players • Board Strategy
            </span>
            <h4 className="font-headline-md text-[16px] font-bold text-on-surface group-hover:text-secondary transition-colors">
              Classic Ludo Arena
            </h4>
          </div>
          {/* 3D glowing dice badge */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-container-lowest shadow-[0_0_16px_rgba(78,222,163,0.3)]">
            <span className="text-2xl text-secondary">⚄</span>
          </div>
        </div>

        {/* Color Token Preview & Track indicator */}
        <div className="my-3 flex items-center justify-between rounded-xl bg-surface-container-lowest p-2.5 border border-surface-container-highest">
          <div className="flex items-center gap-2">
            <span className="font-label-code text-[11px] text-on-surface-variant">Tokens:</span>
            <div className="flex -space-x-1">
              <span className="h-4 w-4 rounded-full bg-red-500 ring-2 ring-surface" />
              <span className="h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-surface" />
              <span className="h-4 w-4 rounded-full bg-amber-500 ring-2 ring-surface" />
              <span className="h-4 w-4 rounded-full bg-blue-500 ring-2 ring-surface" />
            </div>
          </div>
          <span className="font-label-code text-[11px] text-on-surface-variant">
            Real-time Dice Physics
          </span>
        </div>

        <div className="flex items-center justify-between text-on-surface-variant pb-3 font-label-code text-[11px]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-tertiary">timer</span> 8-12 mins
          </span>
          <span className="flex items-center gap-1 text-secondary font-semibold">
            <span className="material-symbols-outlined text-[14px]">military_tech</span> +150 XP
          </span>
          <span className="text-on-surface">Collision Safe Havens</span>
        </div>

        <button
          onClick={() => handleStartMatch('ludo')}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-container via-inverse-primary to-primary py-2.5 px-4 font-headline-md text-[15px] font-bold text-on-primary-container shadow-[0_0_18px_rgba(128,131,255,0.4)] active:scale-98 hover:brightness-110 transition-all"
          type="button"
        >
          <span className="material-symbols-outlined text-[19px]">play_arrow</span>
          Launch Ludo Match
        </button>
      </article>

      {/* Game Mode 2: Mind Logic Duel */}
      <article className="group relative overflow-hidden rounded-2xl bg-surface-container p-4 shadow-lg transition-all hover:bg-surface-container-high border border-surface-container-high/80">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/10 blur-xl pointer-events-none" />
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 font-label-code text-[10px] font-semibold text-primary w-fit">
              <span className="material-symbols-outlined text-[13px]">extension</span>
              Pattern Matrix • Codebreaker • Spatial Flash
            </span>
            <h4 className="font-headline-md text-[16px] font-bold text-on-surface group-hover:text-primary transition-colors">
              Mind Logic Duel
            </h4>
          </div>
          {/* 4x4 Mini Neon Matrix Preview */}
          <div className="grid grid-cols-3 gap-0.5 p-1.5 rounded-lg bg-surface-container-lowest shrink-0 shadow-inner">
            <span className="h-2.5 w-2.5 rounded-sm bg-primary/60" />
            <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
            <span className="h-2.5 w-2.5 rounded-sm bg-primary/40" />
            <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
            <span className="h-2.5 w-2.5 rounded-sm bg-tertiary flex items-center justify-center font-label-code text-[8px] font-bold text-surface">
              ?
            </span>
            <span className="h-2.5 w-2.5 rounded-sm bg-primary/50" />
            <span className="h-2.5 w-2.5 rounded-sm bg-primary/30" />
            <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
            <span className="h-2.5 w-2.5 rounded-sm bg-primary/70" />
          </div>
        </div>

        <div className="my-3 flex items-center justify-between rounded-xl bg-surface-container-lowest p-2.5 border border-surface-container-highest">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[16px]">pin</span>
            <span className="font-label-code text-[11px] text-on-surface font-semibold">
              Bulls &amp; Cows Deduction
            </span>
          </div>
          <span className="rounded bg-surface-container px-2 py-0.5 font-label-code text-[10px] text-secondary">
            Live Head-to-Head
          </span>
        </div>

        <div className="flex items-center justify-between text-on-surface-variant pb-3 font-label-code text-[11px]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-tertiary">bolt</span> Rapid Turn-based
          </span>
          <span className="flex items-center gap-1 text-primary font-semibold">
            <span className="material-symbols-outlined text-[14px]">trending_up</span> IQ Boost +45
          </span>
          <span className="text-on-surface">5 Rounds</span>
        </div>

        <button
          onClick={() => handleStartMatch('logic')}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-surface-container-highest hover:bg-surface-bright py-2.5 px-4 font-headline-md text-[15px] font-semibold text-primary shadow active:scale-98 transition-all"
          type="button"
        >
          <span className="material-symbols-outlined text-[19px]">psychology</span>
          Enter Logic Duel
        </button>
      </article>

      {/* Game Mode 3: Competitive Math Quant Sprint */}
      <article className="group relative overflow-hidden rounded-2xl bg-surface-container p-4 shadow-lg transition-all hover:bg-surface-container-high border border-surface-container-high/80">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-tertiary/10 blur-xl pointer-events-none" />
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-tertiary/15 px-2.5 py-0.5 font-label-code text-[10px] font-semibold text-tertiary w-fit">
              <span className="material-symbols-outlined text-[13px]">calculate</span>
              CAT / GMAT / SSC / Banking Speed Aptitude
            </span>
            <h4 className="font-headline-md text-[16px] font-bold text-on-surface group-hover:text-tertiary transition-colors">
              Math Quant Sprint
            </h4>
          </div>
          <span className="rounded-lg bg-surface-container-lowest px-2 py-1 font-label-code text-[11px] font-bold text-tertiary shadow-[0_0_12px_rgba(255,185,95,0.25)] shrink-0">
            +4 / -1 Exam
          </span>
        </div>

        {/* Math equation preview banner */}
        <div className="my-3 flex items-center justify-between rounded-xl bg-surface-container-lowest px-3 py-2 font-label-code text-[11px] border border-surface-container-highest">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[15px]">timer_10</span>
            <span className="text-on-surface font-semibold tracking-wide">
              x² - 14x + 48 = 0
            </span>
          </div>
          <span className="text-outline text-[11px]">Roots? [6, 8]</span>
        </div>

        <div className="flex items-center justify-between text-on-surface-variant pb-3 font-label-code text-[11px]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-tertiary">speed</span> 45s Blitz
          </span>
          <span className="flex items-center gap-1 text-secondary font-semibold">
            <span className="material-symbols-outlined text-[14px]">school</span> Mental Shortcuts
          </span>
          <span className="text-on-surface">Leaderboard Race</span>
        </div>

        <button
          onClick={() => handleStartMatch('quant')}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-surface-container-highest hover:bg-surface-bright py-2.5 px-4 font-headline-md text-[15px] font-semibold text-tertiary shadow active:scale-98 transition-all"
          type="button"
        >
          <span className="material-symbols-outlined text-[19px]">functions</span>
          Start Quant Battle
        </button>
      </article>

      {/* Sticky-feel Master CTA Bar */}
      <div className="sticky bottom-1 pb-1 pt-1 z-20">
        <button
          onClick={() => handleStartMatch('ludo')}
          disabled={isStarting}
          className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary-container via-inverse-primary to-primary py-3.5 px-6 font-headline-md text-[16px] font-bold text-on-primary-container shadow-[0_0_28px_rgba(128,131,255,0.5)] active:scale-98 hover:brightness-110 transition-all cursor-pointer"
          type="button"
        >
          {isStarting ? (
            <>
              <span className="material-symbols-outlined text-[24px] animate-spin">refresh</span>
              <span>Launching Battlefield...</span>
            </>
          ) : (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
              </span>
              <span>Start Room Match (All Ready)</span>
              <span className="material-symbols-outlined text-[22px]">sports_esports</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
