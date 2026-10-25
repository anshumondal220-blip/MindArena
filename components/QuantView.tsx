'use client';

import React, { useState, useEffect } from 'react';
import { soundEngine } from '@/lib/audio';
import ScratchpadModal from './ScratchpadModal';

export default function QuantView() {
  const [timeLeft, setTimeLeft] = useState<number>(38);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D'>('B');
  const [showMethodDrawer, setShowMethodDrawer] = useState<boolean>(true);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(true);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [currentScore, setCurrentScore] = useState<number>(1380);

  // Timer Countdown and Circular SVG
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 45));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const progressPct = Math.max(0, (timeLeft / 45) * 100);
  const isUrgent = timeLeft <= 15;

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    soundEngine.playClick();
    setSelectedOption(opt);
  };

  const handleLockIn = () => {
    if (selectedOption === 'B') {
      soundEngine.playCorrect();
      setIsSubmitted(true);
      setCurrentScore((s) => s + 82);
      setTimeout(() => setIsSubmitted(false), 2000);
    } else {
      soundEngine.playWrong();
      setCurrentScore((s) => Math.max(0, s - 25));
    }
  };

  const handleToggleBookmark = () => {
    soundEngine.playClick();
    setIsBookmarked(!isBookmarked);
  };

  const optionLabels: Record<'A' | 'B' | 'C' | 'D', string> = {
    A: '14.28%',
    B: '16.67%',
    C: '12.50%',
    D: '18.75%',
  };

  return (
    <div className="flex flex-col w-full gap-3 max-w-md mx-auto">
      {/* Scratchpad Modal */}
      <ScratchpadModal
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
      />

      {/* Telemetry Bar & Exam Context */}
      <section className="bg-surface-container rounded-2xl p-3 shadow-md flex flex-col gap-2.5 border border-surface-container-highest">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-code text-[11px] uppercase tracking-wider border border-surface-bright">
              <span className="material-symbols-outlined text-[13px]">calculate</span>
              Arithmetic: Profit, Loss &amp; Discount
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-tertiary-container/30 text-tertiary font-label-code text-[11px] border border-tertiary/20">
              CAT / SSC CGL Tier-2
            </span>
          </div>
          <div className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-code text-[11px]">
            Q<span className="text-on-surface font-semibold">04</span>/10
          </div>
        </div>

        {/* Live Timer, Streak & Risk Matrix */}
        <div className="flex items-center justify-between bg-surface-container-lowest/80 rounded-xl p-2.5 px-3 border border-surface-container-highest">
          <div className="flex items-center gap-3">
            {/* Circular countdown SVG */}
            <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container-high"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className={`transition-all duration-1000 ease-linear ${
                    isUrgent ? 'text-error' : 'text-tertiary'
                  }`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={`${progressPct}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={`font-label-numeric-md text-[13px] font-bold leading-none ${
                    isUrgent ? 'text-error' : 'text-tertiary'
                  }`}
                >
                  {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </span>
                <span className="font-label-code text-[8px] uppercase text-on-surface-variant leading-none mt-0.5">
                  sec
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-label-code text-[10px] text-on-surface-variant uppercase tracking-wider">
                Speed Reward Pool
              </span>
              <div className="flex items-center gap-1.5 font-label-numeric-md text-[13px]">
                <span className="text-secondary font-bold">+100 Max</span>
                <span className="text-outline-variant text-[11px]">•</span>
                <span className="text-error font-medium text-[11px]">-25 Risk</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high font-label-code text-[10px] text-secondary border border-secondary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              ACTIVE DUEL
            </span>
            <span className="font-label-code text-[10px] text-on-surface-variant mt-1">
              Pool: 4 Competitors
            </span>
          </div>
        </div>
      </section>

      {/* Live Multi-User Lock-in Status Tracker */}
      <section className="bg-surface-container-low rounded-xl p-2.5 px-3 flex flex-col gap-2 border border-surface-container-highest">
        <div className="flex items-center justify-between">
          <span className="font-label-code text-[11px] uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-primary">groups</span>
            Room Telemetry
          </span>
          <span className="font-label-code text-[11px] text-secondary font-semibold">2/4 Locked</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Aarav */}
          <div className="flex flex-col items-center p-1.5 rounded-lg bg-surface-container text-center relative overflow-hidden border border-surface-container-highest">
            <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center relative mb-1">
              <img
                className="w-full h-full rounded-full object-cover ring-1 ring-secondary"
                alt="Aarav"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsBex66NWcz17UR8hUOdlV2dNEO4NjNRV5MXETMXAVa2yFlSauk-uY6kA0XUVicN85OKfNdKyE03FLz8Y6asLKq8RtpRADNToOLf0IFZ_JXcPbfTQc_RMulyuPcFKkghVy8gfDpCYFXRPm_rKLXiELJTS_km1EoW86GGs7hSCuzN8wPJ-gE272dWevjGDlPOhuh_S8vK2xZBaeIVpU92sZQHcoec6ccrCU7ob_uMKq"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-secondary flex items-center justify-center shadow">
                <span className="material-symbols-outlined text-[8px] text-surface font-bold">
                  bolt
                </span>
              </span>
            </div>
            <span className="font-body-sm text-[11px] font-medium text-on-surface truncate w-full">
              Aarav
            </span>
            <span className="font-label-code text-[9px] text-secondary font-semibold">14.2s</span>
          </div>

          {/* You (Solving) */}
          <div className="flex flex-col items-center p-1.5 rounded-lg bg-surface-container-high text-center relative overflow-hidden border border-primary/40">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center relative mb-1">
              <img
                className="w-full h-full rounded-full object-cover ring-1 ring-primary"
                alt="You avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_m6rCd1Vo7OEaaISXm58Hql49UUp76hHMY4iHsQLAH-CAKXXPICIhZpYmXsrAZKshHXIzrvGnaefA307LHAYw-XLaitFscT2B5htelJbnqotwVnkM9yGoYYFTMnT20-DANQ-2Rmqavee_OqTFsd_yBvUtAwtMHUT10JfZ3ezCy2uceN_tOVquFoPH3L_zze5v66mRqCqpW9eT1W4wAjObvbXgDINa_O1dIp3dyl7x"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary animate-ping opacity-75" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-on-primary" />
              </span>
            </div>
            <span className="font-body-sm text-[11px] font-semibold text-primary truncate w-full">
              You
            </span>
            <span className="font-label-code text-[9px] text-primary animate-pulse">Solving...</span>
          </div>

          {/* Priya */}
          <div className="flex flex-col items-center p-1.5 rounded-lg bg-surface-container text-center relative overflow-hidden border border-surface-container-highest">
            <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center relative mb-1">
              <img
                className="w-full h-full rounded-full object-cover ring-1 ring-tertiary"
                alt="Priya"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiJi0uMDriPNuRTru9PkE3ObF-dIPL66f_clQRqRia2ycaY18uHQvEnmyKciG-dzHEkhIqlMk9_zLI8cvTsSOT9FDk8w-HunjjA4J73mrSE5DQZw3GVk4671HZ6y6FuqnUQZ7zsLG3PHPhZkWFS74Pt6q3YeOmzyt_kJmDP4CmDp9gqD5t4HOF3wRtgFsMAC4ga8j6t_cq8oZRBHN6c3Wkvv6Xt77gCjF_A08pMoqH"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-secondary flex items-center justify-center shadow">
                <span className="material-symbols-outlined text-[8px] text-surface font-bold">
                  bolt
                </span>
              </span>
            </div>
            <span className="font-body-sm text-[11px] font-medium text-on-surface truncate w-full">
              Priya
            </span>
            <span className="font-label-code text-[9px] text-secondary font-semibold">21.5s</span>
          </div>

          {/* Kabir */}
          <div className="flex flex-col items-center p-1.5 rounded-lg bg-surface-container text-center relative overflow-hidden opacity-75 border border-surface-container-highest">
            <div className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center relative mb-1">
              <img
                className="w-full h-full rounded-full object-cover ring-1 ring-outline"
                alt="Kabir"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAM8EaxfG5HXqtBAbpETF28wp4Rt9H3iQBqZL5bOXYTLJyF-yvRd7lG8Tj41rmpmOfx0-AZaGRNDfUKDoEdJm40sryYQpyXZSY9WsfzbzH5mRq17r7AcYPmshYBCOyHhQaz56FmblSBdEOx1kTPAw4vnRmtZyKzs3hgNKyoP6vG7nAm-iAVgrfvWKncHchN0se4N0DLWN8NfhQKRmxxT4jj8VEXYMOGHtloDlZWEyY"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-body-sm text-[11px] font-medium text-on-surface-variant truncate w-full">
              Kabir
            </span>
            <span className="font-label-code text-[9px] text-outline">Thinking</span>
          </div>
        </div>
      </section>

      {/* Main Question Card */}
      <section className="bg-surface-container rounded-2xl p-4 shadow-md flex flex-col gap-3 relative border border-surface-container-highest">
        <div className="flex items-center justify-between">
          <span className="font-label-code text-[11px] text-primary uppercase tracking-wider flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[15px]">psychology</span>
            Problem Statement
          </span>
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsScratchpadOpen(true);
            }}
            aria-label="Scratchpad"
            className="flex items-center gap-1 font-label-code text-[11px] text-on-surface-variant hover:text-on-surface px-2.5 py-1 rounded-md bg-surface-container-high transition-colors border border-surface-container-highest"
            type="button"
          >
            <span className="material-symbols-outlined text-[13px]">stylus_note</span>
            Scratchpad
          </button>
        </div>

        <p className="font-body-md text-[14px] text-on-surface leading-relaxed">
          A shopkeeper marks an article <span className="text-tertiary font-semibold">40% above</span>{' '}
          cost price and allows a discount of <span className="text-tertiary font-semibold">25%</span>{' '}
          on the marked price. If he also uses a false weight that measures{' '}
          <span className="text-secondary font-semibold">900g instead of 1000g</span> during
          selling, what is his overall net profit percentage?
        </p>

        {/* Given Monospace Parameters */}
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          <span className="font-label-code text-[11px] px-2 py-1 rounded-lg bg-surface-container-lowest text-on-surface-variant border border-surface-container-highest">
            CP: <span className="text-on-surface font-semibold">100</span>
          </span>
          <span className="font-label-code text-[11px] px-2 py-1 rounded-lg bg-surface-container-lowest text-on-surface-variant border border-surface-container-highest">
            MP: <span className="text-tertiary font-semibold">+40%</span>
          </span>
          <span className="font-label-code text-[11px] px-2 py-1 rounded-lg bg-surface-container-lowest text-on-surface-variant border border-surface-container-highest">
            Disc: <span className="text-primary font-semibold">25%</span>
          </span>
          <span className="font-label-code text-[11px] px-2 py-1 rounded-lg bg-surface-container-lowest text-on-surface-variant border border-surface-container-highest">
            Weight: <span className="text-secondary font-semibold">900g / 1kg</span>
          </span>
        </div>
      </section>

      {/* Interactive 4-Choice Option Grid */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="font-label-code text-[11px] uppercase tracking-wider text-on-surface-variant">
            Select Correct Net Margin
          </span>
          <span className="font-label-code text-[11px] text-outline">Keyboard keys 1-4 active</span>
        </div>

        {/* Option A */}
        <button
          onClick={() => handleSelectOption('A')}
          className={`w-full text-left rounded-xl p-3 flex items-center justify-between transition-all duration-150 active:scale-[0.99] border ${
            selectedOption === 'A'
              ? 'bg-primary-container/20 border-primary shadow-[0_0_20px_-4px_rgba(128,131,255,0.4)]'
              : 'bg-surface-container border-surface-container-highest hover:bg-surface-container-high'
          }`}
          type="button"
        >
          <div className="flex items-center gap-3">
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-label-code text-[12px] font-bold ${
                selectedOption === 'A'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              1
            </span>
            <div className="flex flex-col">
              <span className="font-label-numeric-md text-[14px] text-on-surface font-semibold">
                14.28%
              </span>
              <span className="font-body-sm text-[11px] text-on-surface-variant">
                Equivalent fraction: +1/7
              </span>
            </div>
          </div>
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center ${
              selectedOption === 'A' ? 'bg-primary' : 'bg-surface-container-high'
            }`}
          >
            {selectedOption === 'A' && (
              <span className="material-symbols-outlined text-[14px] text-on-primary font-bold">
                check
              </span>
            )}
          </div>
        </button>

        {/* Option B (Selected / Active State) */}
        <button
          onClick={() => handleSelectOption('B')}
          className={`w-full text-left rounded-xl p-3 flex items-center justify-between transition-all duration-150 active:scale-[0.99] border ${
            selectedOption === 'B'
              ? 'bg-primary-container/20 border-primary shadow-[0_0_20px_-4px_rgba(128,131,255,0.4)]'
              : 'bg-surface-container border-surface-container-highest hover:bg-surface-container-high'
          }`}
          type="button"
        >
          <div className="flex items-center gap-3">
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-label-code text-[12px] font-bold ${
                selectedOption === 'B'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              2
            </span>
            <div className="flex flex-col">
              <span className="font-label-numeric-md text-[14px] text-primary font-bold">
                16.67%
              </span>
              <span className="font-body-sm text-[11px] text-primary-fixed-dim">
                Equivalent fraction: +1/6
              </span>
            </div>
          </div>
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center ${
              selectedOption === 'B' ? 'bg-primary' : 'bg-surface-container-high'
            }`}
          >
            {selectedOption === 'B' && (
              <span className="material-symbols-outlined text-[14px] text-on-primary font-bold">
                check
              </span>
            )}
          </div>
        </button>

        {/* Option C */}
        <button
          onClick={() => handleSelectOption('C')}
          className={`w-full text-left rounded-xl p-3 flex items-center justify-between transition-all duration-150 active:scale-[0.99] border ${
            selectedOption === 'C'
              ? 'bg-primary-container/20 border-primary shadow-[0_0_20px_-4px_rgba(128,131,255,0.4)]'
              : 'bg-surface-container border-surface-container-highest hover:bg-surface-container-high'
          }`}
          type="button"
        >
          <div className="flex items-center gap-3">
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-label-code text-[12px] font-bold ${
                selectedOption === 'C'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              3
            </span>
            <div className="flex flex-col">
              <span className="font-label-numeric-md text-[14px] text-on-surface font-semibold">
                12.50%
              </span>
              <span className="font-body-sm text-[11px] text-on-surface-variant">
                Equivalent fraction: +1/8
              </span>
            </div>
          </div>
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center ${
              selectedOption === 'C' ? 'bg-primary' : 'bg-surface-container-high'
            }`}
          >
            {selectedOption === 'C' && (
              <span className="material-symbols-outlined text-[14px] text-on-primary font-bold">
                check
              </span>
            )}
          </div>
        </button>

        {/* Option D */}
        <button
          onClick={() => handleSelectOption('D')}
          className={`w-full text-left rounded-xl p-3 flex items-center justify-between transition-all duration-150 active:scale-[0.99] border ${
            selectedOption === 'D'
              ? 'bg-primary-container/20 border-primary shadow-[0_0_20px_-4px_rgba(128,131,255,0.4)]'
              : 'bg-surface-container border-surface-container-highest hover:bg-surface-container-high'
          }`}
          type="button"
        >
          <div className="flex items-center gap-3">
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-label-code text-[12px] font-bold ${
                selectedOption === 'D'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              4
            </span>
            <div className="flex flex-col">
              <span className="font-label-numeric-md text-[14px] text-on-surface font-semibold">
                18.75%
              </span>
              <span className="font-body-sm text-[11px] text-on-surface-variant">
                Equivalent fraction: +3/16
              </span>
            </div>
          </div>
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center ${
              selectedOption === 'D' ? 'bg-primary' : 'bg-surface-container-high'
            }`}
          >
            {selectedOption === 'D' && (
              <span className="material-symbols-outlined text-[14px] text-on-primary font-bold">
                check
              </span>
            )}
          </div>
        </button>
      </section>

      {/* Submit & Lock Action Trigger */}
      <section className="flex flex-col gap-2">
        <button
          onClick={handleLockIn}
          className="w-full relative overflow-hidden bg-primary hover:bg-primary-fixed-dim text-on-primary py-3.5 px-4 rounded-xl font-headline-md text-[15px] font-bold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(192,193,255,0.25)] active:scale-[0.98] transition-all cursor-pointer"
          id="lock-btn"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isSubmitted ? 'check_circle' : 'lock'}
          </span>
          <span>
            {isSubmitted
              ? 'Submitted & Confirmed (+82 Pts)!'
              : `Submit & Lock Option ${selectedOption} (${optionLabels[selectedOption]})`}
          </span>
          {/* Interactive Pulse Indicator */}
          <span className="absolute top-1 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-on-primary" />
          </span>
        </button>

        <div className="flex items-center justify-between px-1">
          <span className="font-label-code text-[11px] text-outline">
            Locking commits +82 points at current timestamp
          </span>
          <button
            onClick={() => {
              soundEngine.playWrong();
            }}
            className="font-label-code text-[11px] text-tertiary hover:underline flex items-center gap-0.5"
            type="button"
          >
            <span className="material-symbols-outlined text-[13px]">flag</span>
            Pass (-0 pts)
          </button>
        </div>
      </section>

      {/* Fastest Solver & Pro Shortcut Trick Drawer */}
      <section className="bg-surface-container rounded-2xl overflow-hidden shadow-md flex flex-col border border-surface-container-highest">
        {/* Fast Solver Live Banner */}
        <div className="bg-surface-container-high p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[16px]">military_tech</span>
            </div>
            <div>
              <span className="font-label-code text-[10px] text-tertiary uppercase tracking-wider block leading-none">
                Fastest in Room
              </span>
              <span className="font-body-md text-[13px] font-semibold text-on-surface">
                Aarav (14.2s • +96 pts)
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              setShowMethodDrawer(!showMethodDrawer);
            }}
            className="flex items-center gap-1 font-label-code text-[12px] text-primary hover:text-primary-fixed bg-surface-container px-2.5 py-1 rounded-lg transition-colors border border-surface-container-highest"
            type="button"
          >
            <span>Method</span>
            <span
              className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
                showMethodDrawer ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>
        </div>

        {/* Shortcut Content Box */}
        {showMethodDrawer && (
          <div className="p-3.5 flex flex-col gap-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-headline-md text-[14px] text-tertiary flex items-center gap-1.5 font-bold">
                <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                20-Second Mental Math Multiplier Method
              </span>
              <span className="font-label-code text-[10px] px-2 py-0.5 rounded-full bg-surface-container-highest text-secondary font-semibold">
                High Yield Formula
              </span>
            </div>

            {/* Core Formula Card */}
            <div className="bg-surface-container-lowest rounded-xl p-2.5 flex flex-col gap-1.5 border border-surface-container-highest">
              <span className="font-label-code text-[11px] text-on-surface-variant uppercase tracking-wider">
                Overall Net Multiplier Rule:
              </span>
              <div className="font-label-code text-[12px] text-primary bg-surface-container-high px-2 py-1.5 rounded-lg text-center overflow-x-auto whitespace-nowrap border border-surface-container-highest">
                Multiplier_Net = (Mult_Markup) × (Mult_Discount) × (Mult_Weight)
              </div>
            </div>

            {/* Fractional Breakdown Step-by-Step */}
            <div className="flex flex-col gap-1.5 bg-surface-container-low rounded-xl p-2.5 border border-surface-container-highest">
              <span className="font-label-code text-[11px] text-on-surface-variant uppercase tracking-wider">
                Fast Fraction Cancellation:
              </span>
              <div className="font-label-code text-label-code text-on-surface flex flex-col gap-1 text-[11px]">
                <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap text-secondary font-semibold">
                  <span>= 1.40 × 0.75 × (1000 / 900)</span>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap text-on-surface">
                  <span>= (7/5) × (3/4) × (10/9)</span>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap text-tertiary font-bold">
                  <span>= 7/6 = 1 + (1/6) ➔ +16.67% Net Profit</span>
                </div>
              </div>
            </div>

            {/* Bookmark Action */}
            <button
              onClick={handleToggleBookmark}
              className={`w-full py-2 px-3 rounded-xl border text-on-surface font-label-code text-[11px] flex items-center justify-center gap-1.5 transition-colors active:scale-[0.99] ${
                isBookmarked
                  ? 'bg-surface-container-high border-tertiary/40 text-tertiary font-semibold'
                  : 'bg-surface-container-highest border-surface-container-highest'
              }`}
              type="button"
            >
              <span
                className="material-symbols-outlined text-[16px] text-tertiary"
                style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
              >
                bookmark
              </span>
              <span>
                {isBookmarked
                  ? 'Saved to Your Quantitative Formula Book'
                  : 'Save to Quantitative Formula Book'}
              </span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
