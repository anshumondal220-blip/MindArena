'use client';

import React, { useState, useEffect } from 'react';
import { soundEngine } from '@/lib/audio';
import { evaluateBullsAndCows } from '@/lib/game-rules';

export default function LogicView() {
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'codebreaker'>('matrix');
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D'>('B');
  const [showHint, setShowHint] = useState<boolean>(true);
  const [score, setScore] = useState<number>(240);
  const [round, setRound] = useState<number>(3);
  const [userProgress, setUserProgress] = useState<number>(80);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(81); // 01:21

  // Codebreaker Guessing State
  const [secretCode] = useState<string>('4829');
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [guessHistory, setGuessHistory] = useState<
    Array<{ id: string; guess: string; bulls: number; cows: number }>
  >([
    { id: '#02', guess: '4 8 2 1', bulls: 2, cows: 1 },
    { id: '#01', guess: '7 3 2 9', bulls: 1, cows: 2 },
  ]);

  // Timer Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 90));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    soundEngine.playClick();
    setSelectedOption(opt);
  };

  const handleToggleHint = () => {
    soundEngine.playClick();
    setShowHint(!showHint);
    if (!showHint) {
      setScore((s) => Math.max(0, s - 10));
    }
  };

  const handleSkip = () => {
    soundEngine.playWrong();
    setScore((s) => Math.max(0, s - 25));
    setRound((r) => Math.min(5, r + 1));
  };

  const handleLockIn = () => {
    if (selectedOption === 'B') {
      soundEngine.playCorrect();
      setScore((s) => s + 85);
      setUserProgress(100);
      setIsLocked(true);
      setTimeout(() => {
        setIsLocked(false);
      }, 2000);
    } else {
      soundEngine.playWrong();
      setScore((s) => Math.max(0, s - 15));
    }
  };

  const handleKeypadDigit = (digit: string) => {
    if (currentGuess.length < 4) {
      soundEngine.playClick();
      setCurrentGuess((prev) => prev + digit);
    }
  };

  const handleClearGuess = () => {
    soundEngine.playClick();
    setCurrentGuess('');
  };

  const handleSubmitGuess = () => {
    if (currentGuess.length !== 4) return;
    try {
      const result = evaluateBullsAndCows(secretCode, currentGuess);
      soundEngine.playSoundboardFx('calculator');
      const guessFormatted = currentGuess.split('').join(' ');
      const newEntry = {
        id: `#0${guessHistory.length + 1}`,
        guess: guessFormatted,
        bulls: result.bulls,
        cows: result.cows,
      };
      setGuessHistory([newEntry, ...guessHistory]);
      setCurrentGuess('');
      if (result.isSolved) {
        soundEngine.playCorrect();
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div className="flex flex-col w-full gap-3 max-w-md mx-auto">
      {/* Live Match Telemetry Strip */}
      <section className="bg-surface-container-high rounded-xl p-3 flex flex-col gap-2 shadow-md border border-surface-container-highest">
        {/* Match Info & Countdown */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-error animate-ping" />
            <span className="font-label-code text-[11px] text-error tracking-wider uppercase font-bold">
              Live Duel
            </span>
            <span className="text-outline-variant font-label-code text-[11px]">•</span>
            <span className="font-label-code text-[11px] text-on-surface-variant">
              Round {round}/5
            </span>
          </div>

          {/* Central Timer Pill */}
          <div className="flex items-center gap-1 bg-surface-container-lowest px-2.5 py-0.5 rounded-full shadow-inner border border-surface-container-highest">
            <span className="material-symbols-outlined text-tertiary text-[14px]">timer</span>
            <span className="font-label-numeric-md text-[13px] text-tertiary font-bold tracking-tight">
              {formatTimer(secondsLeft)}
            </span>
          </div>

          {/* Live Bounty Points */}
          <div className="flex items-center gap-1 bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20">
            <span className="material-symbols-outlined text-secondary text-[14px]">bolt</span>
            <span className="font-label-numeric-md text-[13px] text-secondary font-semibold">
              +{score} pts
            </span>
          </div>
        </div>

        {/* Multi-Player Progress Tracker */}
        <div className="bg-surface-container-lowest rounded-lg p-2.5 flex flex-col gap-2 border border-surface-container-highest">
          {/* Player: You */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-on-surface">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-secondary text-surface-container-lowest flex items-center justify-center font-label-code text-[10px] font-bold">
                  1
                </span>
                <span className="font-body-sm text-[12px] font-semibold text-secondary flex items-center gap-1">
                  You{' '}
                  <span className="font-label-code text-[10px] text-secondary/80">
                    ({userProgress >= 100 ? '5/5' : '4/5'} solved)
                  </span>
                </span>
              </div>
              <span className="font-label-numeric-md text-[12px] font-bold text-secondary">
                {userProgress}%
              </span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-secondary h-1.5 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(78,222,163,0.6)]"
                style={{ width: `${userProgress}%` }}
              />
            </div>
          </div>

          {/* Player: Aarav */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-on-surface-variant">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-label-code text-[10px]">
                  2
                </span>
                <span className="font-body-sm text-[12px]">
                  Aarav <span className="font-label-code text-[10px] text-outline">• 3/5</span>
                </span>
              </div>
              <span className="font-label-numeric-md text-[12px]">60%</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary h-1.5 rounded-full transition-all duration-500" style={{ width: '60%' }} />
            </div>
          </div>

          {/* Player: Priya & Kabir (Split Compact Line) */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center justify-between text-on-surface-variant text-[11px]">
                <span className="truncate">3. Priya (2/5)</span>
                <span className="font-label-numeric-md">45%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1 overflow-hidden">
                <div className="bg-primary-container h-1 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center justify-between text-on-surface-variant text-[11px]">
                <span className="truncate">4. Kabir (2/5)</span>
                <span className="font-label-numeric-md">40%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1 overflow-hidden">
                <div className="bg-tertiary h-1 rounded-full" style={{ width: '40%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Friend Activity Toast Micro-Banner */}
      <div className="bg-surface-container-high/70 backdrop-blur-md rounded-xl px-3 py-2 flex items-center justify-between shadow-sm border border-surface-container-highest">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 animate-pulse">
            electric_bolt
          </span>
          <span className="font-body-sm text-[12px] text-on-surface truncate">
            <span className="font-semibold text-secondary">Aarav</span> cleared Matrix #3 in{' '}
            <span className="font-label-code text-[11px] text-tertiary font-bold">18s</span>!
          </span>
        </div>
        <span className="font-label-code text-[11px] text-outline shrink-0 ml-1">Just now</span>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-surface-container-lowest rounded-xl border border-surface-container-highest">
        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveSubTab('matrix');
          }}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg transition-all active:scale-95 ${
            activeSubTab === 'matrix'
              ? 'bg-surface-container-high text-primary shadow-sm font-semibold'
              : 'bg-transparent text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">grid_4x4</span>
          <span className="font-label-code text-[11px] uppercase tracking-wider font-semibold">
            Pattern Matrix
          </span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveSubTab('codebreaker');
          }}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg transition-all active:scale-95 ${
            activeSubTab === 'codebreaker'
              ? 'bg-surface-container-high text-secondary shadow-sm font-semibold'
              : 'bg-transparent text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">pin</span>
          <span className="font-label-code text-[11px] uppercase tracking-wider">
            Codebreaker
          </span>
          <span className="bg-primary/20 text-primary px-1.5 py-0.2 rounded-full font-label-code text-[9px] font-bold">
            3 Left
          </span>
        </button>
      </div>

      {/* MAIN VIEW: PATTERN MATRIX OR CODEBREAKER */}
      {activeSubTab === 'matrix' ? (
        <>
          {/* Main Puzzle Arena Card */}
          <section className="bg-surface-container rounded-2xl p-4 flex flex-col gap-3 shadow-md border border-surface-container-highest">
            {/* Header with Question Prompt */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col">
                <h2 className="font-headline-md text-[18px] font-bold text-on-surface tracking-tight">
                  Find the Missing Element
                </h2>
                <p className="font-body-sm text-[12px] text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-tertiary text-[14px]">
                    psychology
                  </span>
                  Arithmetic row steps &amp; clockwise rotation logic
                </p>
              </div>
              <span className="bg-surface-container-highest text-secondary font-label-code text-[11px] px-2 py-0.5 rounded-md shrink-0">
                #034
              </span>
            </div>

            {/* 4x4 Logic Matrix */}
            <div className="grid grid-cols-4 gap-1.5 bg-surface-container-lowest p-2 rounded-xl border border-surface-container-highest">
              {/* Row 1 */}
              <div className="aspect-square bg-surface-container-high rounded-lg flex flex-col items-center justify-center p-1 relative shadow-sm">
                <span className="font-label-numeric-md text-[13px] font-bold text-on-surface">4</span>
                <span className="material-symbols-outlined text-primary text-[16px] rotate-0">
                  change_history
                </span>
              </div>
              <div className="aspect-square bg-surface-container-high rounded-lg flex flex-col items-center justify-center p-1 relative shadow-sm">
                <span className="font-label-numeric-md text-[13px] font-bold text-on-surface">7</span>
                <span className="material-symbols-outlined text-primary text-[16px] rotate-90">
                  change_history
                </span>
              </div>
              <div className="aspect-square bg-surface-container-high rounded-lg flex flex-col items-center justify-center p-1 relative shadow-sm">
                <span className="font-label-numeric-md text-[13px] font-bold text-on-surface">10</span>
                <span className="material-symbols-outlined text-primary text-[16px] rotate-180">
                  change_history
                </span>
              </div>
              <div className="aspect-square bg-surface-container-high rounded-lg flex flex-col items-center justify-center p-1 relative shadow-sm">
                <span className="font-label-numeric-md text-[13px] font-bold text-on-surface">13</span>
                <span className="material-symbols-outlined text-primary text-[16px] -rotate-90">
                  change_history
                </span>
              </div>

              {/* Row 2 */}
              <div className="aspect-square bg-surface-container-high rounded-lg flex flex-col items-center justify-center p-1 relative shadow-sm">
                <span className="font-label-numeric-md text-[13px] font-bold text-on-surface">9</span>
                <span className="material-symbols-outlined text-secondary text-[16px] rotate-90">
                  change_history
                </span>
              </div>
              <div className="aspect-square bg-surface-container-high rounded-lg flex flex-col items-center justify-center p-1 relative shadow-sm">
                <span className="font-label-numeric-md text-[13px] font-bold text-on-surface">14</span>
                <span className="material-symbols-outlined text-secondary text-[16px] rotate-180">
                  change_history
                </span>
              </div>
              <div className="aspect-square bg-surface-container-high rounded-lg flex flex-col items-center justify-center p-1 relative shadow-sm">
                <span className="font-label-numeric-md text-[13px] font-bold text-on-surface">19</span>
                <span className="material-symbols-outlined text-secondary text-[16px] -rotate-90">
                  change_history
                </span>
              </div>
              <div className="aspect-square bg-surface-container-high rounded-lg flex flex-col items-center justify-center p-1 relative shadow-sm">
                <span className="font-label-numeric-md text-[13px] font-bold text-on-surface">24</span>
                <span className="material-symbols-outlined text-secondary text-[16px] rotate-0">
                  change_history
                </span>
              </div>

              {/* Row 3 */}
              <div className="aspect-square bg-surface-container-high rounded-lg flex flex-col items-center justify-center p-1 relative shadow-sm">
                <span className="font-label-numeric-md text-[13px] font-bold text-on-surface">11</span>
                <span className="material-symbols-outlined text-tertiary text-[16px] rotate-180">
                  change_history
                </span>
              </div>
              <div className="aspect-square bg-surface-container-high rounded-lg flex flex-col items-center justify-center p-1 relative shadow-sm">
                <span className="font-label-numeric-md text-[13px] font-bold text-on-surface">17</span>
                <span className="material-symbols-outlined text-tertiary text-[16px] -rotate-90">
                  change_history
                </span>
              </div>
              <div className="aspect-square bg-surface-container-high rounded-lg flex flex-col items-center justify-center p-1 relative shadow-sm">
                <span className="font-label-numeric-md text-[13px] font-bold text-on-surface">23</span>
                <span className="material-symbols-outlined text-tertiary text-[16px] rotate-0">
                  change_history
                </span>
              </div>
              <div className="aspect-square bg-surface-container-high rounded-lg flex flex-col items-center justify-center p-1 relative shadow-sm">
                <span className="font-label-numeric-md text-[13px] font-bold text-on-surface">29</span>
                <span className="material-symbols-outlined text-tertiary text-[16px] rotate-90">
                  change_history
                </span>
              </div>

              {/* Row 4 */}
              <div className="aspect-square bg-surface-container-high rounded-lg flex flex-col items-center justify-center p-1 relative shadow-sm">
                <span className="font-label-numeric-md text-[13px] font-bold text-on-surface">8</span>
                <span className="material-symbols-outlined text-primary-fixed-dim text-[16px] -rotate-90">
                  change_history
                </span>
              </div>
              <div className="aspect-square bg-surface-container-high rounded-lg flex flex-col items-center justify-center p-1 relative shadow-sm">
                <span className="font-label-numeric-md text-[13px] font-bold text-on-surface">15</span>
                <span className="material-symbols-outlined text-primary-fixed-dim text-[16px] rotate-0">
                  change_history
                </span>
              </div>
              <div className="aspect-square bg-surface-container-high rounded-lg flex flex-col items-center justify-center p-1 relative shadow-sm">
                <span className="font-label-numeric-md text-[13px] font-bold text-on-surface">22</span>
                <span className="material-symbols-outlined text-primary-fixed-dim text-[16px] rotate-90">
                  change_history
                </span>
              </div>
              {/* 16th Dynamic Target Cell */}
              <div className="aspect-square bg-primary-container/20 rounded-lg flex flex-col items-center justify-center p-1 relative shadow-[0_0_15px_rgba(128,131,255,0.4)] border border-primary animate-pulse">
                <span className="material-symbols-outlined text-primary text-[28px] font-bold">
                  help
                </span>
                <span className="font-label-code text-[9px] text-primary font-bold uppercase tracking-wider">
                  Target
                </span>
              </div>
            </div>

            {/* 4 Multiple-Choice Solution Cards */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              {/* Option A */}
              <button
                onClick={() => handleSelectOption('A')}
                className={`rounded-xl p-2.5 flex items-center justify-between text-left transition-all active:scale-95 shadow-sm border ${
                  selectedOption === 'A'
                    ? 'bg-secondary/15 border-secondary shadow-[0_0_12px_rgba(78,222,163,0.3)]'
                    : 'bg-surface-container-high border-surface-container-highest hover:bg-surface-bright'
                }`}
                type="button"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center font-label-code text-[11px] font-bold ${
                      selectedOption === 'A'
                        ? 'bg-secondary text-surface'
                        : 'bg-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    A
                  </span>
                  <span className="font-label-numeric-md text-[14px] font-bold text-on-surface">
                    28
                  </span>
                </div>
                <span className="material-symbols-outlined text-primary text-[18px] rotate-90">
                  change_history
                </span>
              </button>

              {/* Option B (Selected / Active) */}
              <button
                onClick={() => handleSelectOption('B')}
                className={`rounded-xl p-2.5 flex items-center justify-between text-left transition-all active:scale-95 shadow-[0_0_12px_rgba(78,222,163,0.3)] border ${
                  selectedOption === 'B'
                    ? 'bg-secondary/15 border-secondary'
                    : 'bg-surface-container-high border-surface-container-highest hover:bg-surface-bright'
                }`}
                type="button"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center font-label-code text-[11px] font-bold ${
                      selectedOption === 'B'
                        ? 'bg-secondary text-surface'
                        : 'bg-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    B
                  </span>
                  <span className="font-label-numeric-md text-[14px] font-bold text-secondary">
                    29
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-[18px] rotate-180">
                    change_history
                  </span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">
                    check_circle
                  </span>
                </div>
              </button>

              {/* Option C */}
              <button
                onClick={() => handleSelectOption('C')}
                className={`rounded-xl p-2.5 flex items-center justify-between text-left transition-all active:scale-95 shadow-sm border ${
                  selectedOption === 'C'
                    ? 'bg-secondary/15 border-secondary shadow-[0_0_12px_rgba(78,222,163,0.3)]'
                    : 'bg-surface-container-high border-surface-container-highest hover:bg-surface-bright'
                }`}
                type="button"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center font-label-code text-[11px] font-bold ${
                      selectedOption === 'C'
                        ? 'bg-secondary text-surface'
                        : 'bg-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    C
                  </span>
                  <span className="font-label-numeric-md text-[14px] font-bold text-on-surface">
                    31
                  </span>
                </div>
                <span className="material-symbols-outlined text-primary text-[18px] -rotate-90">
                  change_history
                </span>
              </button>

              {/* Option D */}
              <button
                onClick={() => handleSelectOption('D')}
                className={`rounded-xl p-2.5 flex items-center justify-between text-left transition-all active:scale-95 shadow-sm border ${
                  selectedOption === 'D'
                    ? 'bg-secondary/15 border-secondary shadow-[0_0_12px_rgba(78,222,163,0.3)]'
                    : 'bg-surface-container-high border-surface-container-highest hover:bg-surface-bright'
                }`}
                type="button"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center font-label-code text-[11px] font-bold ${
                      selectedOption === 'D'
                        ? 'bg-secondary text-surface'
                        : 'bg-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    D
                  </span>
                  <span className="font-label-numeric-md text-[14px] font-bold text-on-surface">
                    27
                  </span>
                </div>
                <span className="material-symbols-outlined text-primary text-[18px] rotate-0">
                  change_history
                </span>
              </button>
            </div>

            {/* Tactical Decision Actions (Hints / Skips) */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleToggleHint}
                className="bg-surface-container-high hover:bg-surface-bright active:scale-95 transition-all text-tertiary rounded-lg p-2 flex items-center justify-center gap-1.5 shadow-sm border border-surface-container-highest"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                <span className="font-label-code text-[11px] font-semibold tracking-wide">
                  Hint (-10 pts)
                </span>
              </button>
              <button
                onClick={handleSkip}
                className="bg-error-container/20 text-error hover:bg-error-container/40 active:scale-95 transition-all rounded-lg p-2 flex items-center justify-center gap-1.5 shadow-sm border border-error-container/30"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">fast_forward</span>
                <span className="font-label-code text-[11px] font-semibold tracking-wide">
                  Skip (-25 pts)
                </span>
              </button>
            </div>

            {/* Dynamic Hint Banner (Expanded State) */}
            {showHint && (
              <div className="bg-tertiary-container/20 text-on-surface rounded-xl p-2.5 flex items-start gap-2 shadow-inner border border-tertiary/30 animate-fadeIn">
                <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0 mt-0.5">
                  tips_and_updates
                </span>
                <div className="flex flex-col">
                  <span className="font-label-code text-[11px] text-tertiary font-bold tracking-wider uppercase">
                    Active Hint
                  </span>
                  <p className="font-body-sm text-[12px] text-on-surface-variant">
                    Notice vertical sequence in column 4 (+11, +5, -1) or row sequence delta (+7) with
                    each rotation clockwise.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Bulls & Cows Codebreaker Telemetry Peek Drawer */}
          <section className="bg-surface-container-high rounded-xl p-3 flex flex-col gap-2 shadow-md border border-surface-container-highest">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[16px]">lock_open</span>
                <h3 className="font-headline-md text-[15px] font-bold text-on-surface">
                  Codebreaker Clue Feed
                </h3>
              </div>
              <span className="font-label-code text-[11px] text-on-surface-variant">
                Target: 4 Digits
              </span>
            </div>

            {/* Telemetry Log */}
            <div className="flex flex-col gap-1.5">
              {guessHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-surface-container-lowest px-3 py-2 rounded-lg border border-surface-container-highest"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-label-code text-[10px] text-outline">{item.id}</span>
                    <span className="font-label-numeric-md text-[14px] font-bold tracking-widest text-on-surface">
                      {item.guess}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-secondary/10 px-1.5 py-0.5 rounded text-secondary font-label-code text-[11px]">
                      <span>🟢</span>
                      <span className="font-bold">{item.bulls} Bulls</span>
                    </div>
                    <div className="flex items-center gap-1 bg-tertiary/10 px-1.5 py-0.5 rounded text-tertiary font-label-code text-[11px]">
                      <span>🟡</span>
                      <span className="font-bold">{item.cows} Cow{item.cows !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Submit / Lock-in Action Bar */}
          <div className="w-full pt-1">
            <button
              onClick={handleLockIn}
              className="w-full bg-primary-container text-on-primary-container hover:bg-primary-container/90 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all cursor-pointer font-bold"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isLocked ? 'check_circle' : 'bolt'}
              </span>
              <span className="font-headline-md text-[15px] tracking-wide uppercase">
                {isLocked
                  ? 'Locked In! (+85 Pts)'
                  : `Lock In Selection [${selectedOption}]`}
              </span>
            </button>
          </div>
        </>
      ) : (
        /* CODEBREAKER DEDICATED SOLVER ARENA */
        <section className="bg-surface-container rounded-2xl p-4 flex flex-col gap-3 shadow-md border border-surface-container-highest">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline-md text-[17px] font-bold text-on-surface">
                Deductive Codebreaker
              </h2>
              <p className="font-body-sm text-[12px] text-on-surface-variant">
                Crack the secret 4-digit sequence using Bulls &amp; Cows clues
              </p>
            </div>
            <span className="rounded bg-secondary/20 text-secondary font-label-code text-[10px] px-2 py-0.5 font-bold">
              ACTIVE
            </span>
          </div>

          {/* Live Guess Input Display */}
          <div className="flex items-center justify-center gap-3 bg-surface-container-lowest p-3 rounded-xl border border-surface-container-highest">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="w-11 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-xl font-bold font-label-numeric-lg text-primary border border-surface-container-highest"
              >
                {currentGuess[idx] || '_'}
              </div>
            ))}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-5 gap-1.5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((digit) => (
              <button
                key={digit}
                onClick={() => handleKeypadDigit(digit)}
                className="bg-surface-container-high hover:bg-surface-bright py-2 rounded-lg text-center font-label-numeric-md text-[15px] font-bold text-on-surface active:scale-95 transition-all border border-surface-container-highest"
              >
                {digit}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleClearGuess}
              className="py-2.5 rounded-xl bg-surface-container-highest hover:bg-surface-bright text-on-surface font-label-code text-[12px] active:scale-95 transition-all"
            >
              Clear
            </button>
            <button
              onClick={handleSubmitGuess}
              disabled={currentGuess.length !== 4}
              className="py-2.5 rounded-xl bg-secondary text-surface font-headline-md text-[14px] font-bold disabled:opacity-50 active:scale-95 transition-all shadow-md"
            >
              Submit Guess
            </button>
          </div>

          {/* History */}
          <div className="flex flex-col gap-1.5 mt-2 max-h-48 overflow-y-auto no-scrollbar">
            {guessHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-surface-container-lowest px-3 py-2 rounded-lg border border-surface-container-highest text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-label-code text-[10px] text-outline">{item.id}</span>
                  <span className="font-label-numeric-md text-[13px] font-bold tracking-widest text-on-surface">
                    {item.guess}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-secondary font-bold font-label-code">
                    🟢 {item.bulls} Bulls
                  </span>
                  <span className="text-tertiary font-bold font-label-code">
                    🟡 {item.cows} Cows
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
