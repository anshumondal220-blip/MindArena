'use client';

import React from 'react';
import { soundEngine } from '@/lib/audio';

export type TabKey = 'lobby' | 'ludo' | 'logic' | 'quant';

interface BottomNavProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export default function BottomNav({ currentTab, onSelectTab }: BottomNavProps) {
  const tabs: Array<{ key: TabKey; label: string; icon: string }> = [
    { key: 'lobby', label: 'LOBBY', icon: 'meeting_room' },
    { key: 'ludo', label: 'LUDO', icon: 'casino' },
    { key: 'logic', label: 'LOGIC', icon: 'psychology' },
    { key: 'quant', label: 'QUANT', icon: 'calculate' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-surface/95 backdrop-blur-xl border-t border-surface-container-high/60 shadow-[0_-1px_12px_rgba(0,0,0,0.4)]">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                soundEngine.playClick();
                onSelectTab(tab.key);
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-all select-none active:scale-95 ${
                isActive
                  ? 'text-secondary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div className="relative">
                <span
                  className={`material-symbols-outlined text-[23px] transition-transform ${
                    isActive ? 'scale-110' : ''
                  }`}
                >
                  {tab.icon}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-secondary rounded-full" />
                )}
              </div>
              <span className="font-label-code text-[11px] uppercase tracking-wider">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
