'use client';

import React from 'react';
import { soundEngine } from '@/lib/audio';

interface HeaderProps {
  currentTab: 'lobby' | 'ludo' | 'logic' | 'quant';
  roomCode: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenVoiceDrawer: () => void;
  onOpenProfile: () => void;
  onOpenSettings?: () => void;
  botEnabled?: boolean;
  onToggleBot?: () => void;
  profileAvatar?: string;
  profileName?: string;
}

export default function Header({
  currentTab,
  roomCode,
  isMuted,
  onToggleMute,
  onOpenVoiceDrawer,
  onOpenProfile,
  onOpenSettings,
  botEnabled = false,
  onToggleBot,
  profileAvatar,
  profileName,
}: HeaderProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(roomCode);
    setCopied(true);
    soundEngine.playClick();
    setTimeout(() => setCopied(false), 1500);
  };

  // Ludo has the special Arcade Header from Image 1 / 2
  if (currentTab === 'ludo') {
    return (
      <header className="fixed top-0 w-full z-50 pt-safe bg-[#0f131d]/95 backdrop-blur-md border-b border-surface-container-high/60 shadow-lg">
        <div className="h-14 px-3 flex items-center justify-between gap-2 max-w-md mx-auto">
          {/* Left: Settings & Arena info */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onOpenSettings}
              aria-label="Game Menu / Settings"
              className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
            </button>
            <div className="flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded-full border border-surface-bright">
              <span className="font-label-code text-[11px] text-secondary font-bold tracking-wider">
                {roomCode}
              </span>
              <button
                onClick={handleCopyCode}
                aria-label="Copy Room Code"
                className="w-4 h-4 flex items-center justify-center text-on-surface-variant hover:text-secondary active:scale-90 transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[13px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>
          </div>

          {/* Center: Prize Pool & Stakes */}
          <div className="flex items-center gap-1 bg-gradient-to-r from-tertiary/20 via-surface-container-high to-tertiary/20 px-2.5 py-0.5 rounded-full border border-tertiary/40 shadow-[0_0_10px_rgba(255,185,95,0.2)]">
            <span className="material-symbols-outlined text-[16px] text-tertiary font-bold animate-pulse">
              monetization_on
            </span>
            <span className="font-label-numeric-md text-[12px] font-bold text-tertiary tracking-tight">
              1,000
            </span>
            <span className="text-[10px] text-on-surface-variant font-label-code">/ +250XP</span>
          </div>

          {/* Right: Voice Squad, Sound & Bot Switch */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenVoiceDrawer();
              }}
              aria-label="Voice Chat"
              className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary relative active:scale-95 transition-all"
              title="Mic On / Voice Squad"
            >
              <span className="material-symbols-outlined text-[17px]">mic</span>
              <span className="w-1.5 h-1.5 bg-secondary rounded-full absolute top-1 right-1 animate-ping"></span>
            </button>
            <button
              onClick={() => {
                onToggleMute();
                soundEngine.playClick();
              }}
              aria-label="Toggle Sound"
              className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[17px]">
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>
            <button
              onClick={() => {
                onToggleBot?.();
                soundEngine.playClick();
              }}
              className="flex items-center gap-1 px-1.5 py-1 bg-surface-container-high/80 rounded-md border border-outline-variant/30 active:scale-95 transition-all"
              title="Toggle AI Bot Autoplay"
            >
              <span className="font-label-code text-[9px] text-outline uppercase font-semibold">BOT</span>
              <div
                className={`w-5 h-3 rounded-full p-0.5 flex items-center transition-colors ${
                  botEnabled ? 'bg-secondary justify-end' : 'bg-surface-container-highest justify-start'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-transform ${
                    botEnabled ? 'bg-black' : 'bg-outline'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Lobby, Logic Matrix & Quant Duel header
  const titleMap = {
    lobby: 'Lobby',
    logic: 'Logic Matrix',
    quant: 'Quant Duel',
    ludo: 'Ludo Arena',
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.25)] border-b border-surface-container-high/40">
      <div className="h-16 px-4 flex items-center justify-between gap-1 max-w-md mx-auto">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-container via-inverse-primary to-primary flex items-center justify-center shadow-[0_0_12px_rgba(128,131,255,0.4)]">
            <span className="material-symbols-outlined text-[19px] text-on-primary-container">
              sports_esports
            </span>
          </div>
          <span className="font-headline-md text-headline-md tracking-tight text-on-surface">
            MindArena
          </span>
          <span className="hidden xs:inline-block text-xs font-label-code text-on-surface-variant/80 border-l border-outline-variant/40 pl-2">
            {titleMap[currentTab]}
          </span>
        </div>

        {/* Room badge, Sound toggle & Profile */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-surface-container-high px-2 py-1 rounded-full shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]">
            <span className="font-label-code text-label-code text-secondary tracking-widest text-[11px]">
              {roomCode}
            </span>
            <button
              onClick={handleCopyCode}
              aria-label="Copy Room Code"
              className="w-5 h-5 flex items-center justify-center text-on-surface-variant hover:text-secondary active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">
                {copied ? 'check' : 'content_copy'}
              </span>
            </button>
          </div>

          <button
            onClick={() => {
              onToggleMute();
              soundEngine.playClick();
            }}
            aria-label="Toggle Sound"
            className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-on-surface rounded-full active:scale-95 transition-all bg-surface-container/60"
            type="button"
          >
            <span className="material-symbols-outlined text-[19px]">
              {isMuted ? 'volume_off' : 'volume_up'}
            </span>
          </button>

          {/* User Profile Avatar with Lvl 24 Badge */}
          <div className="relative flex items-center shrink-0">
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenProfile();
              }}
              aria-label="Open Profile & Friends"
              title="Open Profile & Room Code"
              className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-secondary active:scale-95 transition-transform"
            >
              <img
                alt={profileName || 'Profile'}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-secondary/70 shadow"
                src={
                  profileAvatar ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuB_m6rCd1Vo7OEaaISXm58Hql49UUp76hHMY4iHsQLAH-CAKXXPICIhZpYmXsrAZKshHXIzrvGnaefA307LHAYw-XLaitFscT2B5htelJbnqotwVnkM9yGoYYFTMnT20-DANQ-2Rmqavee_OqTFsd_yBvUtAwtMHUT10JfZ3ezCy2uceN_tOVquFoPH3L_zze5v66mRqCqpW9eT1W4wAjObvbXgDINa_O1dIp3dyl7x'
                }
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full ring-2 ring-surface animate-pulse" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
