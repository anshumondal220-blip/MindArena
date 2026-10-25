'use client';

import React, { useState, useRef, useEffect } from 'react';
import { soundEngine } from '@/lib/audio';

interface Message {
  id: string;
  sender: 'You' | 'Aarav' | 'Priya' | 'Kabir' | 'system';
  time: string;
  text?: string;
  soundTag?: string;
  isVoiceNote?: boolean;
  voiceDuration?: string;
  reactions?: { [emoji: string]: number };
}

interface SquadBanterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
}

export default function SquadBanterDrawer({
  isOpen,
  onClose,
  roomCode,
}: SquadBanterDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Kabir',
      time: '14:02:18',
      text: "Aarav take 30 more seconds why don't you 🐢",
      reactions: { '😂': 3, '💀': 2 },
    },
    {
      id: '2',
      sender: 'Aarav',
      time: '14:02:24',
      text: 'Just locked 16.67%, enjoy the dust! ⚡',
      reactions: { '🔥': 4 },
    },
    {
      id: '3',
      sender: 'Priya',
      time: '14:02:35',
      soundTag: 'DROPPED AIRHORN 🎺',
      text: "You just hit a safe square though, don't celebrate yet haha",
    },
    {
      id: '4',
      sender: 'system',
      time: '14:02:40',
      text: 'Aarav placed a +50 Bounty on your token!',
    },
    {
      id: '5',
      sender: 'Aarav',
      time: '14:02:49',
      isVoiceNote: true,
      voiceDuration: '0:03',
    },
    {
      id: '6',
      sender: 'You',
      time: '14:03:01',
      text: "I'm coming for that home stretch 😈",
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isPttActive, setIsPttActive] = useState(false);
  const [isHandsfree, setIsHandsfree] = useState(false);
  const [isVoiceNotePlaying, setIsVoiceNotePlaying] = useState(false);
  const [isMutedAll, setIsMutedAll] = useState(false);
  const [spatialActive, setSpatialActive] = useState(true);

  const feedRef = useRef<HTMLDivElement | null>(null);

  const msgCounterRef = useRef(100);

  useEffect(() => {
    if (isOpen && feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [isOpen, messages.length]);

  if (!isOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputVal.trim()) return;

    soundEngine.playClick();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    msgCounterRef.current += 1;
    const newMsg: Message = {
      id: `msg-${msgCounterRef.current}`,
      sender: 'You',
      time: timeStr,
      text: inputVal.trim(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');
  };

  const handleSoundboardChip = (fxName: string) => {
    soundEngine.playSoundboardFx(fxName);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    msgCounterRef.current += 1;
    const newMsg: Message = {
      id: `msg-${msgCounterRef.current}`,
      sender: 'You',
      time: timeStr,
      soundTag: `DROPPED ${fxName.toUpperCase()}`,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleQuip = (quipText: string) => {
    soundEngine.playClick();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    msgCounterRef.current += 1;
    const newMsg: Message = {
      id: `msg-${msgCounterRef.current}`,
      sender: 'You',
      time: timeStr,
      text: quipText,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleQuickReact = (emoji: string) => {
    soundEngine.playSoundboardFx('calculator');
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    msgCounterRef.current += 1;
    const newMsg: Message = {
      id: `msg-${msgCounterRef.current}`,
      sender: 'You',
      time: timeStr,
      text: emoji,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const toggleVoiceNotePlay = () => {
    if (!isVoiceNotePlaying) {
      setIsVoiceNotePlaying(true);
      soundEngine.playSoundboardFx('bruh');
      setTimeout(() => setIsVoiceNotePlaying(false), 3000);
    } else {
      setIsVoiceNotePlaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-md animate-fadeIn">
      {/* Background Click to Dismiss */}
      <div className="flex-1" onClick={onClose} />

      {/* FROSTED SLIDING DRAWER CONTAINER */}
      <div className="relative w-full max-w-md mx-auto bg-surface-container-low/95 backdrop-blur-2xl rounded-t-3xl pt-2 pb-5 px-3 shadow-[0_-12px_40px_rgba(0,0,0,0.85)] flex flex-col gap-3 max-h-[92vh] overflow-hidden border-t border-surface-container-highest">
        {/* Drawer Handle & Header */}
        <div className="flex flex-col items-center">
          {/* Interactive Pill Handle */}
          <div
            onClick={onClose}
            className="w-12 h-1.5 rounded-full bg-outline-variant/60 mb-2 cursor-grab active:scale-95 transition-transform"
          />

          <div className="w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-[18px]">campaign</span>
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-headline-md text-sm text-on-surface font-bold tracking-tight truncate">
                    Squad Banter &amp; Voice
                  </h1>
                  <span className="px-1.5 py-0.2 rounded-full bg-secondary-container/30 text-secondary font-label-code text-[9px] tracking-wider uppercase font-semibold">
                    LIVE
                  </span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-[11px]">
                  <span className="font-label-code text-primary-fixed">#{roomCode}</span>
                  <span className="text-[10px]">•</span>
                  <span className="font-label-code text-secondary flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                    4/4 In Call
                  </span>
                </div>
              </div>
            </div>

            {/* Utility Action Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsMutedAll(!isMutedAll)}
                aria-label="Mute all teammates"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isMutedAll
                    ? 'bg-error-container text-white'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isMutedAll ? 'volume_off' : 'volume_up'}
                </span>
              </button>
              <button
                onClick={() => setSpatialActive(!spatialActive)}
                aria-label="Sound FX toggle"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  spatialActive
                    ? 'bg-tertiary-container/40 text-tertiary'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">spatial_audio</span>
              </button>
              <button
                onClick={onClose}
                aria-label="Minimize drawer"
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-variant active:scale-90 transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Proximity Voice Bar (Audio Channel) */}
        <div className="w-full bg-surface-container rounded-2xl p-2.5 shadow-md flex flex-col gap-2 border border-surface-container-highest">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[15px]">graphic_eq</span>
              <span className="font-label-code text-[10px] uppercase tracking-wider text-on-surface-variant">
                Proximity Squad Audio
              </span>
            </div>
            <span className="font-label-code text-[10px] text-secondary font-medium tracking-wide">
              {spatialActive ? 'Spatial 3D: Active' : 'Stereo Audio'}
            </span>
          </div>

          {/* 4 Players Horizontal Audio Roster */}
          <div className="grid grid-cols-4 gap-1.5">
            {/* Player: You (Speaking Active) */}
            <div className="relative flex flex-col items-center p-2 rounded-xl bg-surface-container-high/70 shadow-sm text-center border border-secondary/30">
              <div className="relative mb-1">
                <img
                  className="w-10 h-10 rounded-full object-cover shadow-[0_0_12px_rgba(78,222,163,0.5)] ring-2 ring-secondary"
                  alt="You avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDji8DGrZYkxaoarcPbWKbC61OORfRT0WQGM28sAkKo6RQ4X0yDNlx0qC3EoCEyfdaJCxbPkJnBA0WFAoaEIs51Q2eUyZfQfybIIqWseS9qyvE64VKJ_674EebavbkARipM505lAS0iqQbW_rUBoQDeRk2qOi51Vs30fug4gbIQCk053jVwhD4QqM-k74pDexRO_QbA-gOnXxJBirOMrtaNzgZLW-fjwF8u-qu0kZo_"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-secondary flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-on-secondary text-[11px]">
                    mic
                  </span>
                </span>
              </div>
              <span className="font-body-sm text-[12px] font-semibold text-on-surface truncate w-full">
                You
              </span>
              {/* Animated Soundwave Visualizer */}
              <div className="flex items-end justify-center gap-0.5 h-3.5 my-0.5">
                <span className="w-0.5 h-3 bg-secondary rounded-full animate-bounce" />
                <span className="w-0.5 h-2 bg-secondary rounded-full animate-pulse" />
                <span className="w-0.5 h-3.5 bg-secondary rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-0.5 h-1.5 bg-secondary rounded-full animate-pulse" />
              </div>
              <span className="font-label-code text-[9px] text-secondary font-bold">
                {isPttActive ? 'LIVE MIC' : 'TALKING'}
              </span>
            </div>

            {/* Player: Aarav (Speaking High Decibel) */}
            <div className="relative flex flex-col items-center p-2 rounded-xl bg-surface-container-high/40 shadow-sm text-center border border-surface-container-highest">
              <div className="relative mb-1">
                <img
                  className="w-10 h-10 rounded-full object-cover shadow-[0_0_10px_rgba(255,185,95,0.4)] ring-2 ring-tertiary"
                  alt="Aarav avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiPTTW2i6kgc3E85MN1bOM2GB6v_EtqEzcO1ruGyhQhmDLbyfSLH0Y1Kbfye0qb2Ptu8jtj4WpAKxjFhI0Ny0ESDFMG-nnWvuagVqcKWjMW-ZS4h4bPUwk4xc0gh9HSgY-7L4u4bc0K_uQkxSRij3tga2ZpcrGfbngzkgv1Ec3FrytVsChB0A04REwMiIbzkCbzJeBKA1Vb18XETiSwuvwOZSDi7V_7RO94bUuw35n"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-tertiary flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-on-tertiary text-[11px]">
                    mic
                  </span>
                </span>
              </div>
              <span className="font-body-sm text-[12px] font-semibold text-on-surface truncate w-full">
                Aarav
              </span>
              <div className="flex items-center justify-center gap-0.5 h-3.5 my-0.5">
                <span className="w-0.5 h-2 bg-tertiary rounded-full animate-pulse" />
                <span className="w-0.5 h-3 bg-tertiary rounded-full animate-bounce" />
                <span className="w-0.5 h-1.5 bg-tertiary rounded-full animate-pulse" />
              </div>
              <span className="font-label-code text-[9px] text-tertiary font-bold">84 dB</span>
            </div>

            {/* Player: Priya (Muted / Listening) */}
            <div className="relative flex flex-col items-center p-2 rounded-xl bg-surface-container-high/20 opacity-80 text-center border border-surface-container-highest">
              <div className="relative mb-1">
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  alt="Priya avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY4sFyJisJuwUN6lx8tLcTPZv3h1UwZUYBb83QfqJdG2lFUKwbTL3KzZoEaDUXqNQr9IWjYl3esD3vVC2Uvw3LWG7-pTUcGuwKyjVpGdA4sFqpAzcD2tkdovXD0-wQrBNa0keb3MZYRT86o1zsWssSKKLWogqWyTj-kcHtWTehTbU0RbgtS8o4xkz9mEqf9Xq4BeAVVdDzpY6jdQdm5OY0946N0XxEn2vU2bI9KSbI"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-surface-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-error text-[11px]">
                    mic_off
                  </span>
                </span>
              </div>
              <span className="font-body-sm text-[12px] font-semibold text-on-surface-variant truncate w-full">
                Priya
              </span>
              <div className="flex items-center justify-center h-3.5 my-0.5">
                <span className="material-symbols-outlined text-on-surface-variant text-[14px]">
                  headphones
                </span>
              </div>
              <span className="font-label-code text-[9px] text-on-surface-variant">MUTED</span>
            </div>

            {/* Player: Kabir (Open Mic Idle) */}
            <div className="relative flex flex-col items-center p-2 rounded-xl bg-surface-container-high/30 text-center border border-surface-container-highest">
              <div className="relative mb-1">
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  alt="Kabir avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuATllNE2hzEoPXuIszOMJIlOA7NXQX0ZFsWaFHsjqb2EuV1vDWF0-LRqoLg0l5R-oLQKi9l9Ry-lHrxqAQTgZwgtjqAuw5F2YoT3D9vE9BecBCkKpHSZd4ayZn2W2b3uuXTA16lX7c-1obdb2uFpkviTEBWMx22eaL9rXjZ1pwS6Q75KathvpugT5MFuJeqZ5XRicceReZA2fQgwyKhRFjJve212BGm-YSW9aWmxux7"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-[11px]">mic</span>
                </span>
              </div>
              <span className="font-body-sm text-[12px] font-semibold text-on-surface truncate w-full">
                Kabir
              </span>
              <div className="flex items-center justify-center gap-0.5 h-3.5 my-0.5">
                <span className="w-1 h-1 rounded-full bg-secondary-container" />
                <span className="w-1 h-1 rounded-full bg-secondary-container" />
                <span className="w-1 h-1 rounded-full bg-secondary-container" />
              </div>
              <span className="font-label-code text-[9px] text-on-surface-variant">OPEN</span>
            </div>
          </div>

          {/* Tactile Push-To-Talk & Voice Mode Switcher */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onMouseDown={() => {
                setIsPttActive(true);
                soundEngine.playClick();
              }}
              onMouseUp={() => setIsPttActive(false)}
              onTouchStart={() => {
                setIsPttActive(true);
                soundEngine.playClick();
              }}
              onTouchEnd={() => setIsPttActive(false)}
              className={`flex-1 py-2.5 px-3 rounded-xl font-headline-md text-xs font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.97] transition-all select-none cursor-pointer ${
                isPttActive
                  ? 'bg-secondary text-surface animate-pulse'
                  : 'bg-primary hover:bg-primary-container text-on-primary shadow-[0_4px_16px_rgba(128,131,255,0.4)]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPttActive ? 'record_voice_over' : 'mic'}
              </span>
              <span>{isPttActive ? 'TRANSMITTING AUDIO...' : 'HOLD TO ROAST / TALK'}</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setIsHandsfree(!isHandsfree);
              }}
              className={`h-10 px-3 rounded-xl flex items-center gap-1.5 shrink-0 active:scale-95 transition-all border ${
                isHandsfree
                  ? 'bg-secondary/20 border-secondary text-secondary'
                  : 'bg-surface-container-high border-surface-container-highest text-on-surface'
              }`}
              title="Toggle Handsfree Open Mic"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">
                graphic_eq
              </span>
              <span className="font-label-code text-[11px] font-semibold">HANDSFREE</span>
            </button>
          </div>
        </div>

        {/* Quick Trash-Talk & Soundboard Drops */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="font-label-code text-[11px] text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-tertiary text-[14px]">volume_up</span>
              Soundboard FX
            </span>
            <span className="font-label-code text-[10px] text-tertiary">0.5s Cooldown</span>
          </div>

          {/* Sound FX Trigger Pill Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-nowrap no-scrollbar">
            {[
              { id: 'airhorn', icon: '🎺', label: 'Airhorn' },
              { id: 'damage', icon: '💀', label: 'Damage' },
              { id: 'bruh', icon: '🗿', label: 'Bruh' },
              { id: 'ggeasy', icon: '🥱', label: 'GG Easy' },
              { id: 'calculator', icon: '🧮', label: 'Calculator' },
              { id: 'checkmate', icon: '♟️', label: 'Checkmate' },
            ].map((fx) => (
              <button
                key={fx.id}
                onClick={() => handleSoundboardChip(fx.id)}
                className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high active:scale-95 transition-all flex items-center gap-1.5 shadow-sm border border-surface-container-highest"
                type="button"
              >
                <span className="text-xs">{fx.icon}</span>
                <span className="font-body-sm text-[11px] text-on-surface font-medium">
                  {fx.label}
                </span>
              </button>
            ))}
          </div>

          {/* Savage Quips Quick Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-nowrap no-scrollbar">
            {[
              '"Broken abacus again?" 🧮',
              '"Prepare to cry next turn! 🎲"',
              '"Speed +100? Miss -25! ⚡"',
              '"Rolling another 6 in your face!"',
            ].map((quip) => (
              <button
                key={quip}
                onClick={() => handleQuip(quip)}
                className="px-2.5 py-1 rounded-full bg-surface-container-high/60 hover:bg-primary-container/30 active:scale-95 transition-all font-body-sm text-[11px] text-on-surface-variant hover:text-primary border border-surface-container-highest"
                type="button"
              >
                {quip}
              </button>
            ))}
          </div>
        </div>

        {/* Live Match Banter Feed */}
        <div
          ref={feedRef}
          className="w-full max-h-52 overflow-y-auto flex flex-col gap-2.5 pr-0.5 no-scrollbar"
        >
          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="flex items-center justify-center my-0.5">
                  <div className="px-3 py-1 rounded-full bg-error-container/40 text-on-error-container font-label-code text-[10px] tracking-wide flex items-center gap-1.5 shadow-sm border border-error/20">
                    <span className="material-symbols-outlined text-[12px]">
                      local_fire_department
                    </span>
                    <span>{msg.text}</span>
                  </div>
                </div>
              );
            }

            const isYou = msg.sender === 'You';

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2 ${isYou ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-label-code ${
                    isYou
                      ? 'bg-primary-container text-on-primary-container'
                      : msg.sender === 'Aarav'
                      ? 'bg-tertiary-container/30 text-tertiary'
                      : 'bg-surface-container-high text-on-surface'
                  }`}
                >
                  {msg.sender[0]}
                </div>

                <div className={`flex-1 min-w-0 ${isYou ? 'text-right' : ''}`}>
                  <div
                    className={`flex items-baseline gap-2 mb-0.5 ${
                      isYou ? 'justify-end' : ''
                    }`}
                  >
                    {!isYou && (
                      <span
                        className={`font-body-sm text-[12px] font-bold ${
                          msg.sender === 'Aarav'
                            ? 'text-tertiary'
                            : msg.sender === 'Priya'
                            ? 'text-secondary'
                            : 'text-on-surface'
                        }`}
                      >
                        {msg.sender}
                      </span>
                    )}
                    <span className="font-label-code text-[10px] text-on-surface-variant">
                      {msg.time}
                    </span>
                    {isYou && (
                      <span className="font-body-sm text-[12px] font-bold text-primary">
                        You
                      </span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`p-2.5 rounded-2xl text-on-surface font-body-sm text-[13px] shadow-sm inline-block ${
                      isYou
                        ? 'bg-primary/20 rounded-tr-sm text-left border border-primary/20'
                        : 'bg-surface-container rounded-tl-sm border border-surface-container-highest'
                    }`}
                  >
                    {msg.soundTag && (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-tertiary/15 text-tertiary font-label-code text-[11px] font-semibold mb-1">
                        <span className="material-symbols-outlined text-[13px]">volume_up</span>
                        {msg.soundTag}
                      </div>
                    )}

                    {msg.isVoiceNote ? (
                      <div className="flex items-center gap-2 min-w-[180px]">
                        <button
                          onClick={toggleVoiceNotePlay}
                          className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0 active:scale-90 transition-transform"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {isVoiceNotePlaying ? 'pause' : 'play_arrow'}
                          </span>
                        </button>
                        <div className="flex-1 flex flex-col gap-0.5">
                          <div className="flex items-center gap-0.5 h-4">
                            {[10, 16, 20, 12, 18, 8, 14, 18, 8].map((h, i) => (
                              <span
                                key={i}
                                className={`w-0.5 rounded-full transition-all ${
                                  isVoiceNotePlaying ? 'bg-secondary animate-pulse' : 'bg-primary'
                                }`}
                                style={{ height: `${h}px` }}
                              />
                            ))}
                          </div>
                          <div className="flex justify-between font-label-code text-[9px] text-on-surface-variant">
                            <span>Voice Roast</span>
                            <span>{msg.voiceDuration}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      msg.text && <p>{msg.text}</p>
                    )}
                  </div>

                  {/* Emoji Reactions */}
                  {msg.reactions && (
                    <div className="flex items-center gap-1 mt-1">
                      {Object.entries(msg.reactions).map(([emo, cnt]) => (
                        <button
                          key={emo}
                          onClick={() => {
                            soundEngine.playClick();
                            setMessages((curr) =>
                              curr.map((m) =>
                                m.id === msg.id && m.reactions
                                  ? {
                                      ...m,
                                      reactions: {
                                        ...m.reactions,
                                        [emo]: (m.reactions[emo] || 0) + 1,
                                      },
                                    }
                                  : m
                              )
                            );
                          }}
                          className="px-1.5 py-0.5 rounded-full bg-surface-container-high text-[10px] text-on-surface flex items-center gap-1 active:scale-90 border border-surface-container-highest"
                          type="button"
                        >
                          <span>{emo}</span>
                          <span className="font-label-numeric-md text-[10px]">{cnt}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky Bottom Message Input Bar */}
        <div className="w-full pt-1">
          <form
            onSubmit={handleSend}
            className="flex items-center gap-1.5 bg-surface-container rounded-2xl p-1.5 shadow-lg border border-surface-container-highest"
          >
            {/* Soundboard / Voice Note Quick Trigger */}
            <button
              onClick={() => handleSoundboardChip('airhorn')}
              className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary active:scale-95 transition-all shrink-0"
              type="button"
              title="Drop Airhorn"
            >
              <span className="material-symbols-outlined text-[18px]">mic</span>
            </button>

            {/* Input Text Field */}
            <div className="flex-1 min-w-0 relative">
              <input
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                autoComplete="off"
                className="w-full bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 font-body-sm text-[13px] px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary caret-primary"
                placeholder="Type trash talk or send meme..."
                type="text"
              />
            </div>

            {/* Emoji Sticker Quick Drop Button */}
            <button
              onClick={() => handleQuickReact('🔥')}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-tertiary active:scale-95 transition-all shrink-0"
              type="button"
            >
              <span className="text-[16px]">🔥</span>
            </button>

            {/* Send Action Button */}
            <button
              aria-label="Send Banter"
              className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold shadow-[0_0_12px_rgba(128,131,255,0.45)] hover:bg-primary-container active:scale-90 transition-all shrink-0 cursor-pointer"
              type="submit"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>

          {/* Quick Reaction Reaction Bar (Subtle Floating Tray) */}
          <div className="flex items-center justify-around pt-2 px-2">
            {['🔥', '💀', '🤡', '🚀', '🎲', '🥱'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleQuickReact(emoji)}
                className="text-base hover:scale-125 transition-transform"
                type="button"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
