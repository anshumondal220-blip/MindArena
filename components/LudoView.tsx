'use client';

import React, { useState, useEffect } from 'react';
import { soundEngine } from '@/lib/audio';

interface LudoViewProps {
  onOpenVoiceDrawer: () => void;
  botEnabled?: boolean;
  profileName?: string;
  profileAvatar?: string;
}

// High-fidelity SVG Dice Pips renderer for authentic 3D dice faces
function DicePips({ value, className = 'w-7 h-7 text-red-600' }: { value: number; className?: string }) {
  const dotColor = 'currentColor';
  const pipCoordinates: Record<number, Array<[number, number]>> = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
  };

  const dots = pipCoordinates[value] || pipCoordinates[6];

  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={10} fill={dotColor} />
      ))}
    </svg>
  );
}

export default function LudoView({
  onOpenVoiceDrawer,
  botEnabled = false,
  profileName = 'You (Red)',
  profileAvatar,
}: LudoViewProps) {
  const [diceVal, setDiceVal] = useState<number>(6);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [turnTimer, setTurnTimer] = useState<number>(10);
  const [hasBonusRoll, setHasBonusRoll] = useState<boolean>(true);
  const [playerPoints, setPlayerPoints] = useState<number>(340);
  const [pawnsOnTrack, setPawnsOnTrack] = useState<number>(2);
  const [moveLog, setMoveLog] = useState<{
    text: string;
    roll: number;
    isSafe: boolean;
  }>({
    text: 'Pawn 1 is safe ⭐',
    roll: 6,
    isSafe: true,
  });

  // Floating emoji reaction indicator
  const [floatingReaction, setFloatingReaction] = useState<string | null>(null);

  const rollDice = React.useCallback(() => {
    if (isRolling) return;
    setIsRolling(true);
    soundEngine.playDiceRoll();

    let counter = 0;
    const interval = setInterval(() => {
      setDiceVal(Math.floor(Math.random() * 6) + 1);
      counter++;
      if (counter > 9) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceVal(finalRoll);
        setIsRolling(false);

        const isSix = finalRoll === 6;
        setHasBonusRoll(isSix);

        if (isSix) {
          soundEngine.playCorrect();
          setPlayerPoints((p) => p + 60);
          setMoveLog({
            text: 'Rolled 6! Pawn advanced + Safe Zone ⭐',
            roll: 6,
            isSafe: true,
          });
        } else {
          setPlayerPoints((p) => p + finalRoll * 10);
          setMoveLog({
            text: `Moved token ${finalRoll} spaces forward`,
            roll: finalRoll,
            isSafe: finalRoll % 2 === 0,
          });
        }
      }
    }, 60);
  }, [isRolling]);

  // Turn Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTurnTimer((prev) => {
        if (prev <= 1) {
          return 12;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Bot autoplay if botEnabled
  useEffect(() => {
    if (botEnabled && !isRolling) {
      const botInterval = setInterval(() => {
        rollDice();
      }, 5000);
      return () => clearInterval(botInterval);
    }
  }, [botEnabled, isRolling, rollDice]);

  const triggerReaction = (emoji: string) => {
    soundEngine.playClick();
    setFloatingReaction(emoji);
    setTimeout(() => setFloatingReaction(null), 1200);
  };

  const sendCannedChat = (text: string) => {
    soundEngine.playSoundboardFx('damage');
    setFloatingReaction(text);
    setTimeout(() => setFloatingReaction(null), 1800);
  };

  return (
    <div className="flex flex-col w-full gap-2 select-none max-w-md mx-auto my-auto relative">
      {/* Floating reaction burst overlay */}
      {floatingReaction && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-bounce bg-surface-container-high/90 border border-secondary px-4 py-2 rounded-2xl shadow-[0_0_20px_rgba(78,222,163,0.6)] text-center">
          <span className="text-2xl font-bold font-headline-md text-white drop-shadow">
            {floatingReaction}
          </span>
        </div>
      )}

      {/* Top Opponents Ludo Pods Bar (Green Aarav & Yellow Priya) */}
      <div className="grid grid-cols-2 gap-2 pt-0.5 items-end">
        {/* Player 1: Top-Left Green Pod (Aarav) */}
        <div className="flex items-center gap-1.5 bg-surface-container/90 rounded-xl p-1.5 border border-[#10B981]/40 shadow-sm relative overflow-hidden">
          <div className="relative shrink-0">
            <img
              className="w-9 h-9 rounded-lg object-cover ring-2 ring-[#10B981]"
              alt="Aarav avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqb2BeJFiO1Xzk0h3Ao2wv1Ohe0ZFq5OJn_CghONsX0Os7Okb-d3M6UnSpc0V-_NGsXUwyjeG_H6JToSf4psfdPhxbAjbwSE8bqeWml-lDRqCDOoAWQ5gw7iQat6mY2zyQdbRCQZFeyg91tydTeFJ2GBMcTXP1RXer_9Vn32kPX0RYvhAjqj4Oq7tnx5Qz-4cHtF56VjcG2551hOfs8K16j9HTVxOxRaH5r3LuSjoq"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -top-1 -left-1 bg-[#10B981] text-black font-label-code text-[8px] font-black px-1 rounded-sm shadow">
              L28
            </span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-headline-md text-xs font-bold text-[#10B981] truncate">Aarav</span>
              <span className="text-[9px] font-label-code text-on-surface-variant">1 Home</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1 bg-surface-container-highest rounded-full mt-1 overflow-hidden">
              <div className="w-1/4 h-full bg-[#10B981]" />
            </div>
            <span className="text-[9px] font-label-code text-outline mt-0.5 truncate">
              Waiting turn...
            </span>
          </div>
          {/* Inactive Mini Dice */}
          <div className="w-7 h-7 rounded-md bg-[#1e293b] border border-[#10B981]/30 flex items-center justify-center shadow-inner">
            <DicePips value={3} className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Player 2: Top-Right Yellow Pod (Priya) */}
        <div className="flex items-center gap-1.5 bg-surface-container/90 rounded-xl p-1.5 border border-[#F59E0B]/40 shadow-sm relative overflow-hidden">
          <div className="relative shrink-0">
            <img
              className="w-9 h-9 rounded-lg object-cover ring-2 ring-[#F59E0B]"
              alt="Priya avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjn3Qmwn_P2SUki0FW5Po_xQjM0opXCZ4NI7cw38zNtGlq3YUPBGNrM2cQs85T_nb8_fvUPxWgGwhSaw4KghmnuhC8tPBEwad9rgTPoUzKJPx3J54HK5_UvmYOAof4aAglm3vJl_C-3Ik7BaJb4DXGgTXZNJAM-pM16oJAGxqd__V2vlQVezZBL-7avYh4V0iRI0dBHNVfOjNchkF0fD40umFpfUZ0odLoCo4XWPjU"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -top-1 -left-1 bg-[#F59E0B] text-black font-label-code text-[8px] font-black px-1 rounded-sm shadow">
              L19
            </span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-headline-md text-xs font-bold text-[#F59E0B] truncate">Priya</span>
              <span className="text-[9px] font-label-code text-tertiary">Next</span>
            </div>
            <div className="w-full h-1 bg-surface-container-highest rounded-full mt-1 overflow-hidden">
              <div className="w-2/3 h-full bg-[#F59E0B]" />
            </div>
            <span className="text-[9px] font-label-code text-outline mt-0.5 truncate">
              2 Active
            </span>
          </div>
          {/* Inactive Mini Dice */}
          <div className="w-7 h-7 rounded-md bg-[#1e293b] border border-[#F59E0B]/30 flex items-center justify-center shadow-inner">
            <DicePips value={4} className="w-4 h-4 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Authentic Ludo King 15x15 Master Board */}
      <div className="w-full aspect-square max-w-[390px] mx-auto bg-[#0a0d14] rounded-2xl p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.8)] border border-surface-container-highest relative flex items-center justify-center">
        {/* The 15x15 Grid (6-3-6 layout) */}
        <div className="w-full h-full grid grid-cols-[6fr_3fr_6fr] grid-rows-[6fr_3fr_6fr] bg-[#171b26] rounded-xl overflow-hidden border border-[#313540] shadow-inner select-none">
          {/* ================= TOP ROW ================= */}
          {/* 1. Top-Left: Green Home Yard (6x6) */}
          <div className="bg-[#047857] p-1.5 flex flex-col justify-between rounded-tl-lg border-r-2 border-b-2 border-black/80">
            <div className="flex items-center justify-between">
              <span className="font-headline-md text-[9px] font-bold text-white tracking-wider flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[11px] text-[#a7f3d0]">
                  sports_esports
                </span>{' '}
                GREEN
              </span>
              <span className="font-label-code text-[8px] text-[#a7f3d0] bg-black/30 px-1 py-0.5 rounded">
                AARAV
              </span>
            </div>
            {/* White Inset Box with 4 Green Tokens */}
            <div className="bg-white/95 rounded-lg p-1.5 grid grid-cols-2 gap-2 shadow-inner place-items-center aspect-square mx-auto w-[82%]">
              <div className="w-5 h-5 rounded-full bg-[#10B981] pawn-token flex items-center justify-center border-2 border-white shadow">
                <span className="w-2 h-2 rounded-full bg-white/70" />
              </div>
              <div className="w-5 h-5 rounded-full bg-[#10B981] pawn-token flex items-center justify-center border-2 border-white shadow">
                <span className="w-2 h-2 rounded-full bg-white/70" />
              </div>
              <div className="w-5 h-5 rounded-full bg-[#10B981] pawn-token flex items-center justify-center border-2 border-white shadow">
                <span className="w-2 h-2 rounded-full bg-white/70" />
              </div>
              <div className="w-5 h-5 rounded-full bg-slate-200 border-2 border-dashed border-slate-400 flex items-center justify-center">
                <span className="text-[7px] text-slate-400 font-bold">OUT</span>
              </div>
            </div>
            <div className="h-1" />
          </div>

          {/* 2. Top Arm Track (3 cols x 6 rows) */}
          <div className="grid grid-cols-3 grid-rows-6 bg-[#0f172a] border-b-2 border-black/80 text-[9px]">
            {/* Row 1 */}
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            {/* Row 2 */}
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-emerald-400/50 bg-[#10B981] flex items-center justify-center text-white font-bold" />
            <div className="border border-slate-700/50 bg-[#10B981] flex items-center justify-center text-white font-bold text-[10px] shadow-inner">
              ⭐
            </div>
            {/* Row 3 */}
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center relative">
              <div className="w-4 h-4 rounded-full bg-[#10B981] pawn-token pawn-token-glow-green border border-white flex items-center justify-center text-[7px] font-black text-white z-10 animate-pulse">
                G
              </div>
            </div>
            <div className="border border-emerald-400/50 bg-[#10B981] flex items-center justify-center text-white font-bold" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            {/* Row 4 */}
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-emerald-400/50 bg-[#10B981] flex items-center justify-center text-white font-bold" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            {/* Row 5 */}
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-[9px]">
              ⭐
            </div>
            <div className="border border-emerald-400/50 bg-[#10B981] flex items-center justify-center text-white font-bold" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            {/* Row 6 */}
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-emerald-400/50 bg-[#10B981] flex items-center justify-center text-white font-bold">
              <span className="material-symbols-outlined text-[11px] text-white">
                arrow_downward
              </span>
            </div>
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
          </div>

          {/* 3. Top-Right: Yellow Home Yard (6x6) */}
          <div className="bg-[#b45309] p-1.5 flex flex-col justify-between rounded-tr-lg border-l-2 border-b-2 border-black/80">
            <div className="flex items-center justify-between">
              <span className="font-headline-md text-[9px] font-bold text-white tracking-wider flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[11px] text-[#fef08a]">bolt</span>{' '}
                YELLOW
              </span>
              <span className="font-label-code text-[8px] text-[#fde047] bg-black/30 px-1 py-0.5 rounded">
                PRIYA
              </span>
            </div>
            {/* White Inset Box with 4 Yellow Tokens */}
            <div className="bg-white/95 rounded-lg p-1.5 grid grid-cols-2 gap-2 shadow-inner place-items-center aspect-square mx-auto w-[82%]">
              <div className="w-5 h-5 rounded-full bg-[#F59E0B] pawn-token flex items-center justify-center border-2 border-white shadow">
                <span className="w-2 h-2 rounded-full bg-white/70" />
              </div>
              <div className="w-5 h-5 rounded-full bg-[#F59E0B] pawn-token flex items-center justify-center border-2 border-white shadow">
                <span className="w-2 h-2 rounded-full bg-white/70" />
              </div>
              <div className="w-5 h-5 rounded-full bg-slate-200 border-2 border-dashed border-slate-400 flex items-center justify-center">
                <span className="text-[7px] text-slate-400 font-bold">OUT</span>
              </div>
              <div className="w-5 h-5 rounded-full bg-slate-200 border-2 border-dashed border-slate-400 flex items-center justify-center">
                <span className="text-[7px] text-slate-400 font-bold">OUT</span>
              </div>
            </div>
            <div className="h-1" />
          </div>

          {/* ================= MIDDLE ROW ================= */}
          {/* 4. Left Arm Track (6 cols x 3 rows) */}
          <div className="grid grid-cols-6 grid-rows-3 bg-[#0f172a] border-r-2 border-black/80 text-[9px]">
            {/* Row 1 */}
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-slate-700/50 bg-[#10B981]/80 flex items-center justify-center text-white font-bold text-[9px]">
              ⭐
            </div>
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            {/* Row 2 (Red Home Runway) */}
            <div className="border border-slate-700/50 bg-[#EF4444] flex items-center justify-center text-white font-bold text-[9px]">
              ⭐
            </div>
            <div className="border border-red-400/50 bg-[#EF4444] flex items-center justify-center text-white font-bold" />
            <div className="border border-red-400/50 bg-[#EF4444] flex items-center justify-center text-white font-bold relative">
              <div className="w-4 h-4 rounded-full bg-[#EF4444] pawn-token pawn-token-glow-red border border-white flex items-center justify-center text-[7px] font-black text-white z-10">
                R
              </div>
            </div>
            <div className="border border-red-400/50 bg-[#EF4444] flex items-center justify-center text-white font-bold" />
            <div className="border border-red-400/50 bg-[#EF4444] flex items-center justify-center text-white font-bold" />
            <div className="border border-red-400/50 bg-[#EF4444] flex items-center justify-center text-white font-bold">
              <span className="material-symbols-outlined text-[11px] text-white">
                arrow_forward
              </span>
            </div>
            {/* Row 3 */}
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-[9px]">
              ⭐
            </div>
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center relative">
              <div className="w-4 h-4 rounded-full bg-[#F59E0B] pawn-token pawn-token-glow-yellow border border-white flex items-center justify-center text-[7px] font-black text-black z-10">
                Y
              </div>
            </div>
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
          </div>

          {/* 5. Center Winner Triangle (3x3 apex) */}
          <div className="bg-black relative overflow-hidden flex items-center justify-center border border-black shadow-[inset_0_0_8px_rgba(0,0,0,0.8)]">
            {/* Top Triangle (Green) */}
            <div className="absolute inset-0 bg-[#10B981] [clip-path:polygon(0_0,100%_0,50%_50%)]" />
            {/* Right Triangle (Yellow) */}
            <div className="absolute inset-0 bg-[#F59E0B] [clip-path:polygon(100%_0,100%_100%,50%_50%)]" />
            {/* Bottom Triangle (Blue) */}
            <div className="absolute inset-0 bg-[#3B82F6] [clip-path:polygon(100%_100%,0_100%,50%_50%)]" />
            {/* Left Triangle (Red) */}
            <div className="absolute inset-0 bg-[#EF4444] [clip-path:polygon(0_0,0_100%,50%_50%)]" />
            {/* Central Victory Medallion */}
            <div className="relative z-10 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-[0_0_10px_rgba(245,158,11,0.9)] flex items-center justify-center border border-yellow-100 ring-1 ring-black/40">
              <span className="material-symbols-outlined text-[15px] text-amber-950 font-black">
                emoji_events
              </span>
            </div>
          </div>

          {/* 6. Right Arm Track (6 cols x 3 rows) */}
          <div className="grid grid-cols-6 grid-rows-3 bg-[#0f172a] border-l-2 border-black/80 text-[9px]">
            {/* Row 1 */}
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-slate-700/50 bg-[#F59E0B] flex items-center justify-center text-white font-bold text-[9px]">
              ⭐
            </div>
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            {/* Row 2 (Yellow Home Runway) */}
            <div className="border border-amber-400/50 bg-[#F59E0B] flex items-center justify-center text-white font-bold">
              <span className="material-symbols-outlined text-[11px] text-white">
                arrow_back
              </span>
            </div>
            <div className="border border-amber-400/50 bg-[#F59E0B] flex items-center justify-center text-white font-bold" />
            <div className="border border-amber-400/50 bg-[#F59E0B] flex items-center justify-center text-white font-bold" />
            <div className="border border-amber-400/50 bg-[#F59E0B] flex items-center justify-center text-white font-bold" />
            <div className="border border-amber-400/50 bg-[#F59E0B] flex items-center justify-center text-white font-bold" />
            <div className="border border-slate-700/50 bg-[#F59E0B] flex items-center justify-center text-white font-bold text-[9px]">
              ⭐
            </div>
            {/* Row 3 */}
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
          </div>

          {/* ================= BOTTOM ROW ================= */}
          {/* 7. Bottom-Left: Red Home Yard (6x6) */}
          <div className="bg-[#b91c1c] p-1.5 flex flex-col justify-between rounded-bl-lg border-r-2 border-t-2 border-black/80 ring-1 ring-error/60">
            <div className="flex items-center justify-between">
              <span className="font-headline-md text-[9px] font-bold text-white tracking-wider flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> YOU (RED)
              </span>
              <span className="font-label-code text-[8px] text-white bg-black/40 px-1 py-0.5 rounded font-black">
                ACTIVE
              </span>
            </div>
            {/* White Inset Box with 4 Red Tokens */}
            <div className="bg-white/95 rounded-lg p-1.5 grid grid-cols-2 gap-2 shadow-inner place-items-center aspect-square mx-auto w-[82%]">
              <div className="w-5 h-5 rounded-full bg-[#EF4444] pawn-token flex items-center justify-center border-2 border-white shadow">
                <span className="w-2 h-2 rounded-full bg-white/70" />
              </div>
              <div className="w-5 h-5 rounded-full bg-[#EF4444] pawn-token flex items-center justify-center border-2 border-white shadow">
                <span className="w-2 h-2 rounded-full bg-white/70" />
              </div>
              <div className="w-5 h-5 rounded-full bg-red-100 border-2 border-dashed border-[#EF4444] flex items-center justify-center">
                <span className="text-[7px] text-[#EF4444] font-black">OUT</span>
              </div>
              <div className="w-5 h-5 rounded-full bg-red-100 border-2 border-dashed border-[#EF4444] flex items-center justify-center">
                <span className="text-[7px] text-[#EF4444] font-black">OUT</span>
              </div>
            </div>
            <div className="h-1" />
          </div>

          {/* 8. Bottom Arm Track (3 cols x 6 rows) */}
          <div className="grid grid-cols-3 grid-rows-6 bg-[#0f172a] border-t-2 border-black/80 text-[9px]">
            {/* Row 1 */}
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-blue-400/50 bg-[#3B82F6] flex items-center justify-center text-white font-bold">
              <span className="material-symbols-outlined text-[11px] text-white">
                arrow_upward
              </span>
            </div>
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            {/* Row 2 */}
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-blue-400/50 bg-[#3B82F6] flex items-center justify-center text-white font-bold" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            {/* Row 3 */}
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-blue-400/50 bg-[#3B82F6] flex items-center justify-center text-white font-bold" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            {/* Row 4 */}
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-blue-400/50 bg-[#3B82F6] flex items-center justify-center text-white font-bold" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            {/* Row 5 (Blue Start Safe Square & Red Token 1 on Star Safe Square) */}
            <div className="border border-slate-700/50 bg-[#3B82F6] flex items-center justify-center text-white font-bold text-[9px]">
              ⭐
            </div>
            <div className="border border-blue-400/50 bg-[#3B82F6] flex items-center justify-center text-white font-bold" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center relative">
              <div className="w-4 h-4 rounded-full bg-[#EF4444] pawn-token pawn-token-glow-red border border-white flex items-center justify-center text-[7px] font-black text-white z-10">
                R1
              </div>
              <span className="absolute inset-0 flex items-center justify-center text-[7px] text-amber-500 font-bold opacity-30">
                ⭐
              </span>
            </div>
            {/* Row 6 */}
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
            <div className="border border-slate-700/50 bg-slate-100 flex items-center justify-center" />
          </div>

          {/* 9. Bottom-Right: Blue Home Yard (6x6) */}
          <div className="bg-[#1d4ed8] p-1.5 flex flex-col justify-between rounded-br-lg border-l-2 border-t-2 border-black/80">
            <div className="flex items-center justify-between">
              <span className="font-headline-md text-[9px] font-bold text-white tracking-wider flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[11px] text-[#93c5fd]">shield</span>{' '}
                BLUE
              </span>
              <span className="font-label-code text-[8px] text-[#bfdbfe] bg-black/30 px-1 py-0.5 rounded">
                KABIR
              </span>
            </div>
            {/* White Inset Box with 4 Blue Tokens */}
            <div className="bg-white/95 rounded-lg p-1.5 grid grid-cols-2 gap-2 shadow-inner place-items-center aspect-square mx-auto w-[82%]">
              <div className="w-5 h-5 rounded-full bg-[#3B82F6] pawn-token flex items-center justify-center border-2 border-white shadow">
                <span className="w-2 h-2 rounded-full bg-white/70" />
              </div>
              <div className="w-5 h-5 rounded-full bg-[#3B82F6] pawn-token flex items-center justify-center border-2 border-white shadow">
                <span className="w-2 h-2 rounded-full bg-white/70" />
              </div>
              <div className="w-5 h-5 rounded-full bg-[#3B82F6] pawn-token flex items-center justify-center border-2 border-white shadow">
                <span className="w-2 h-2 rounded-full bg-white/70" />
              </div>
              <div className="w-5 h-5 rounded-full bg-[#3B82F6] pawn-token flex items-center justify-center border-2 border-white shadow">
                <span className="w-2 h-2 rounded-full bg-white/70" />
              </div>
            </div>
            <div className="h-1" />
          </div>
        </div>
      </div>

      {/* Active Player Bottom HUD (You / Red) + 3D Dice Roller */}
      <div className="grid grid-cols-12 gap-2 items-center bg-surface-container/95 border-2 border-secondary/80 rounded-2xl p-2 shadow-[0_0_20px_rgba(78,222,163,0.25)] relative overflow-hidden">
        {/* Glow effect for active turn */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-error/20 rounded-full blur-xl pointer-events-none" />

        {/* Left Column (Cols 1-7): Player Avatar, Info & Turn Timer */}
        <div className="col-span-7 flex items-center gap-2 z-10 min-w-0">
          <div className="relative shrink-0">
            <img
              alt={profileName}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#EF4444] shadow-md"
              src={
                profileAvatar ||
                'https://lh3.googleusercontent.com/aida-public/AB6AXuB_m6rCd1Vo7OEaaISXm58Hql49UUp76hHMY4iHsQLAH-CAKXXPICIhZpYmXsrAZKshHXIzrvGnaefA307LHAYw-XLaitFscT2B5htelJbnqotwVnkM9yGoYYFTMnT20-DANQ-2Rmqavee_OqTFsd_yBvUtAwtMHUT10JfZ3ezCy2uceN_tOVquFoPH3L_zze5v66mRqCqpW9eT1W4wAjObvbXgDINa_O1dIp3dyl7x'
              }
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1 -right-1 bg-secondary text-black font-label-code text-[9px] font-black px-1.5 py-0.2 rounded-md shadow">
              YOU
            </span>
            <span className="absolute -top-1 -left-1 bg-surface-bright text-primary font-label-code text-[8px] font-bold px-1 rounded">
              L24
            </span>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-headline-md text-sm font-bold text-white truncate">
                {profileName}
              </span>
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            </div>

            {/* Turn countdown ticker */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-secondary to-tertiary rounded-full transition-all duration-1000"
                  style={{ width: `${(turnTimer / 12) * 100}%` }}
                />
              </div>
              <span className="font-label-numeric-md text-[11px] font-bold text-tertiary">
                {turnTimer}s
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-on-surface-variant font-label-code mt-0.5">
              <span className="text-secondary font-bold">{pawnsOnTrack} on track</span>
              <span>•</span>
              <span className="text-tertiary">{playerPoints} pts</span>
            </div>
          </div>
        </div>

        {/* Right Column (Cols 8-12): Glowing 3D Dice Roller Box with 'Bonus Roll!' */}
        <div className="col-span-5 flex flex-col items-center justify-center z-10 shrink-0">
          {/* Extra Roll Bonus Banner */}
          {hasBonusRoll && (
            <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-label-code text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md animate-bounce tracking-tighter">
              SIX! ROLL AGAIN 🎲
            </div>
          )}

          {/* 3D Ludo Dice Component */}
          <button
            onClick={rollDice}
            disabled={isRolling}
            aria-label="Roll Dice"
            className={`mt-1 w-14 h-14 bg-gradient-to-br from-white via-slate-100 to-slate-300 rounded-xl dice-cube border-2 border-amber-300 flex flex-col items-center justify-center transform active:scale-90 transition-all cursor-pointer group shadow-[0_0_15px_rgba(245,158,11,0.6)] ${
              isRolling ? 'animate-spin' : ''
            }`}
            type="button"
          >
            <div className="w-8 h-8 flex items-center justify-center p-0.5 group-hover:scale-110 transition-transform">
              <DicePips value={diceVal} className="w-7 h-7 text-red-600" />
            </div>
            <span className="text-[8px] font-label-code font-bold text-slate-700 tracking-tighter uppercase -mt-0.5">
              ROLL!
            </span>
          </button>
          <span className="text-[9px] font-label-code text-secondary font-bold mt-0.5 tracking-wider animate-pulse">
            TAP TO ROLL
          </span>
        </div>
      </div>

      {/* Live Move Log & Opponent Kabir Status */}
      <div className="flex items-center justify-between bg-surface-container-low px-2.5 py-1 rounded-lg border border-surface-container-high/60 text-xs shadow-inner">
        <div className="flex items-center gap-1.5 truncate">
          <span className="material-symbols-outlined text-secondary text-[15px] shrink-0">
            history
          </span>
          <span className="text-error font-bold truncate">🔴 You</span>
          <span className="text-on-surface-variant truncate">
            rolled <b className="text-tertiary font-label-code">{moveLog.roll}</b>! {moveLog.text}
          </span>
        </div>

        {/* Opponent Kabir badge */}
        <div className="flex items-center gap-1 shrink-0 pl-1 border-l border-slate-700 ml-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
          <span className="text-[10px] font-label-code text-[#93c5fd] font-semibold">
            Kabir (Blue): 0 Out
          </span>
        </div>
      </div>

      {/* Ludo King Arcade Reaction Bar & Canned Chat */}
      <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
        {/* Voice squad button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenVoiceDrawer();
          }}
          aria-label="Open Voice Squad"
          className="bg-[#1e293b] border border-secondary/40 text-secondary hover:text-white px-2 py-1.5 rounded-lg flex items-center gap-1 shrink-0 font-label-code text-[11px] active:scale-95 shadow-sm"
        >
          <span className="material-symbols-outlined text-[14px]">graphic_eq</span>
          <span>Voice (4)</span>
        </button>

        {/* Emoji drawer triggers */}
        <div className="flex items-center gap-1 bg-surface-container px-1 py-1 rounded-lg border border-surface-container-highest shrink-0">
          <button
            onClick={() => triggerReaction('😂')}
            className="w-7 h-7 hover:bg-surface-bright rounded flex items-center justify-center text-sm active:scale-125 transition-transform"
            title="Laugh"
          >
            😂
          </button>
          <button
            onClick={() => triggerReaction('😭')}
            className="w-7 h-7 hover:bg-surface-bright rounded flex items-center justify-center text-sm active:scale-125 transition-transform"
            title="Cry"
          >
            😭
          </button>
          <button
            onClick={() => triggerReaction('🎲')}
            className="w-7 h-7 hover:bg-surface-bright rounded flex items-center justify-center text-sm active:scale-125 transition-transform"
            title="Angry Dice"
          >
            🎲
          </button>
          <button
            onClick={() => triggerReaction('🔥')}
            className="w-7 h-7 hover:bg-surface-bright rounded flex items-center justify-center text-sm active:scale-125 transition-transform"
            title="Fire"
          >
            🔥
          </button>
        </div>

        {/* Canned Text Pills */}
        <button
          onClick={() => sendCannedChat('Hurry Up! ⏰')}
          className="bg-surface-container hover:bg-surface-container-high border border-surface-container-highest py-1.5 px-2 rounded-lg text-center whitespace-nowrap text-[11px] font-medium text-on-surface active:scale-95 shrink-0"
        >
          Hurry Up! ⏰
        </button>
        <button
          onClick={() => sendCannedChat('Roll a 6! 🎲')}
          className="bg-surface-container hover:bg-surface-container-high border border-surface-container-highest py-1.5 px-2 rounded-lg text-center whitespace-nowrap text-[11px] font-medium text-tertiary active:scale-95 shrink-0"
        >
          Roll a 6! 🎲
        </button>
        <button
          onClick={() => sendCannedChat('Well Played! 👏')}
          className="bg-surface-container hover:bg-surface-container-high border border-surface-container-highest py-1.5 px-2 rounded-lg text-center whitespace-nowrap text-[11px] font-medium text-secondary active:scale-95 shrink-0"
        >
          Well Played! 👏
        </button>
        <button
          onClick={() => sendCannedChat('Oops! 😅')}
          className="bg-surface-container hover:bg-surface-container-high border border-surface-container-highest py-1.5 px-2 rounded-lg text-center whitespace-nowrap text-[11px] font-medium text-on-surface-variant active:scale-95 shrink-0"
        >
          Oops! 😅
        </button>
      </div>
    </div>
  );
}
