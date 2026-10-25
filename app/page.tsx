'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNav, { TabKey } from '@/components/BottomNav';
import LobbyView from '@/components/LobbyView';
import LudoView from '@/components/LudoView';
import LogicView from '@/components/LogicView';
import QuantView from '@/components/QuantView';
import SquadBanterDrawer from '@/components/SquadBanterDrawer';
import ProfileModal, { ProfileData } from '@/components/ProfileModal';
import { soundEngine } from '@/lib/audio';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<TabKey>('lobby');
  const [roomCode, setRoomCode] = useState<string>('ARENA-7');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVoiceDrawerOpen, setIsVoiceDrawerOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [botEnabled, setBotEnabled] = useState<boolean>(false);

  // Individual User Profile state
  const [profile, setProfile] = useState<ProfileData>({
    name: 'You (Red)',
    gamerTag: '@cyber_player',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB_m6rCd1Vo7OEaaISXm58Hql49UUp76hHMY4iHsQLAH-CAKXXPICIhZpYmXsrAZKshHXIzrvGnaefA307LHAYw-XLaitFscT2B5htelJbnqotwVnkM9yGoYYFTMnT20-DANQ-2Rmqavee_OqTFsd_yBvUtAwtMHUT10JfZ3ezCy2uceN_tOVquFoPH3L_zze5v66mRqCqpW9eT1W4wAjObvbXgDINa_O1dIp3dyl7x',
    level: 24,
    xp: 1420,
    points: 1420,
    streak: 4,
    ringColor: '#4edea3',
  });

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    soundEngine.isMuted = nextMute;
  };

  const handleUpdateProfile = (newProfile: Partial<ProfileData>) => {
    setProfile((prev) => ({ ...prev, ...newProfile }));
  };

  return (
    <div className="bg-[#0b0e17] min-h-screen flex flex-col font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container relative">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        roomCode={roomCode}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onOpenVoiceDrawer={() => setIsVoiceDrawerOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        profileAvatar={profile.avatar}
        profileName={profile.name}
        botEnabled={botEnabled}
        onToggleBot={() => setBotEnabled(!botEnabled)}
      />

      {/* Main View Area */}
      <main
        className={`flex-1 flex flex-col relative w-full px-2.5 max-w-md mx-auto ${
          currentTab === 'ludo' ? 'pt-16 pb-20' : 'pt-20 pb-24'
        }`}
      >
        {currentTab === 'lobby' && (
          <LobbyView
            roomCode={roomCode}
            onSetRoomCode={setRoomCode}
            onSelectTab={setCurrentTab}
            onOpenVoiceDrawer={() => setIsVoiceDrawerOpen(true)}
            profile={profile}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        )}

        {currentTab === 'ludo' && (
          <LudoView
            onOpenVoiceDrawer={() => setIsVoiceDrawerOpen(true)}
            botEnabled={botEnabled}
            profileName={profile.name}
            profileAvatar={profile.avatar}
          />
        )}

        {currentTab === 'logic' && <LogicView />}

        {currentTab === 'quant' && <QuantView />}
      </main>

      {/* Individual Profile & Friends Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        roomCode={roomCode}
        onSetRoomCode={setRoomCode}
      />

      {/* Squad Banter & Voice Drawer */}
      <SquadBanterDrawer
        isOpen={isVoiceDrawerOpen}
        onClose={() => setIsVoiceDrawerOpen(false)}
        roomCode={roomCode}
      />

      {/* Persistent Bottom Nav */}
      <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />
    </div>
  );
}
