'use client';

import React, { useState } from 'react';
import { soundEngine } from '@/lib/audio';
import {
  generateRandomRoomCode,
  isValidRoomCode,
  createFriendInviteMessage,
  validateProfileName,
} from '@/lib/game-rules';

export interface ProfileData {
  name: string;
  gamerTag: string;
  avatar: string;
  level: number;
  xp: number;
  points: number;
  streak: number;
  ringColor: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  onUpdateProfile: (newProfile: Partial<ProfileData>) => void;
  roomCode: string;
  onSetRoomCode: (code: string) => void;
}

export const AVATAR_PRESETS = [
  {
    id: 'avatar-1',
    name: 'Cyber Blade',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_m6rCd1Vo7OEaaISXm58Hql49UUp76hHMY4iHsQLAH-CAKXXPICIhZpYmXsrAZKshHXIzrvGnaefA307LHAYw-XLaitFscT2B5htelJbnqotwVnkM9yGoYYFTMnT20-DANQ-2Rmqavee_OqTFsd_yBvUtAwtMHUT10JfZ3ezCy2uceN_tOVquFoPH3L_zze5v66mRqCqpW9eT1W4wAjObvbXgDINa_O1dIp3dyl7x',
  },
  {
    id: 'avatar-2',
    name: 'Neon Prodigy',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqb2BeJFiO1Xzk0h3Ao2wv1Ohe0ZFq5OJn_CghONsX0Os7Okb-d3M6UnSpc0V-_NGsXUwyjeG_H6JToSf4psfdPhxbAjbwSE8bqeWml-lDRqCDOoAWQ5gw7iQat6mY2zyQdbRCQZFeyg91tydTeFJ2GBMcTXP1RXer_9Vn32kPX0RYvhAjqj4Oq7tnx5Qz-4cHtF56VjcG2551hOfs8K16j9HTVxOxRaH5r3LuSjoq',
  },
  {
    id: 'avatar-3',
    name: 'Amber Valkyrie',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjn3Qmwn_P2SUki0FW5Po_xQjM0opXCZ4NI7cw38zNtGlq3YUPBGNrM2cQs85T_nb8_fvUPxWgGwhSaw4KghmnuhC8tPBEwad9rgTPoUzKJPx3J54HK5_UvmYOAof4aAglm3vJl_C-3Ik7BaJb4DXGgTXZNJAM-pM16oJAGxqd__V2vlQVezZBL-7avYh4V0iRI0dBHNVfOjNchkF0fD40umFpfUZ0odLoCo4XWPjU',
  },
  {
    id: 'avatar-4',
    name: 'Tactical Mind',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAM8EaxfG5HXqtBAbpETF28wp4Rt9H3iQBqZL5bOXYTLJyF-yvRd7lG8Tj41rmpmOfx0-AZaGRNDfUKDoEdJm40sryYQpyXZSY9WsfzbzH5mRq17r7AcYPmshYBCOyHhQaz56FmblSBdEOx1kTPAw4vnRmtZyKzs3hgNKyoP6vG7nAm-iAVgrfvWKncHchN0se4N0DLWN8NfhQKRmxxT4jj8VEXYMOGHtloDlZWEyY',
  },
  {
    id: 'avatar-5',
    name: 'Quantum Strategist',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDji8DGrZYkxaoarcPbWKbC61OORfRT0WQGM28sAkKo6RQ4X0yDNlx0qC3EoCEyfdaJCxbPkJnBA0WFAoaEIs51Q2eUyZfQfybIIqWseS9qyvE64VKJ_674EebavbkARipM505lAS0iqQbW_rUBoQDeRk2qOi51Vs30fug4gbIQCk053jVwhD4QqM-k74pDexRO_QbA-gOnXxJBirOMrtaNzgZLW-fjwF8u-qu0kZo_',
  },
  {
    id: 'avatar-6',
    name: 'Logic Oracle',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiJi0uMDriPNuRTru9PkE3ObF-dIPL66f_clQRqRia2ycaY18uHQvEnmyKciG-dzHEkhIqlMk9_zLI8cvTsSOT9FDk8w-HunjjA4J73mrSE5DQZw3GVk4671HZ6y6FuqnUQZ7zsLG3PHPhZkWFS74Pt6q3YeOmzyt_kJmDP4CmDp9gqD5t4HOF3wRtgFsMAC4ga8j6t_cq8oZRBHN6c3Wkvv6Xt77gCjF_A08pMoqH',
  },
];

export default function ProfileModal({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  roomCode,
  onSetRoomCode,
}: ProfileModalProps) {
  const [editingName, setEditingName] = useState(profile.name);
  const [editingTag, setEditingTag] = useState(profile.gamerTag);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [isEditing, setIsEditing] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const [copiedInvite, setCopiedInvite] = useState(false);
  const [copiedRoomCode, setCopiedRoomCode] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinError, setJoinError] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);

  // Friend invite tracking
  const [invitedFriends, setInvitedFriends] = useState<{ [key: string]: boolean }>({});

  if (!isOpen) return null;

  const handleSaveProfile = () => {
    const val = validateProfileName(editingName);
    if (!val.isValid) {
      setNameError(val.error || 'Invalid name');
      return;
    }
    setNameError(null);
    soundEngine.playCorrect();
    onUpdateProfile({
      name: val.sanitized,
      gamerTag: editingTag.startsWith('@') ? editingTag : `@${editingTag}`,
      avatar: selectedAvatar,
    });
    setIsEditing(false);
  };

  const handleGenerateNewCode = () => {
    soundEngine.playSoundboardFx('calculator');
    const newCode = generateRandomRoomCode('ARENA');
    onSetRoomCode(newCode);
  };

  const handleCopyCode = () => {
    soundEngine.playClick();
    navigator.clipboard?.writeText(roomCode);
    setCopiedRoomCode(true);
    setTimeout(() => setCopiedRoomCode(false), 1500);
  };

  const handleShareInvite = () => {
    soundEngine.playClick();
    const msg = createFriendInviteMessage(roomCode, profile.name);
    if (navigator.share) {
      navigator.share({
        title: `Play with ${profile.name} on MindArena`,
        text: msg,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(msg);
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 2000);
    }
  };

  const handleJoinFriendRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = joinCodeInput.trim().toUpperCase();
    if (!isValidRoomCode(cleaned)) {
      setJoinError('Invalid room code format (e.g. ARENA-7)');
      soundEngine.playWrong();
      return;
    }
    setJoinError(null);
    soundEngine.playCorrect();
    onSetRoomCode(cleaned);
    setJoinCodeInput('');
  };

  const handleInviteFriend = (friendName: string) => {
    soundEngine.playSoundboardFx('airhorn');
    setInvitedFriends((prev) => ({ ...prev, [friendName]: true }));
    setTimeout(() => {
      setInvitedFriends((prev) => ({ ...prev, [friendName]: false }));
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-md bg-surface-container rounded-3xl border border-surface-container-highest shadow-2xl flex flex-col overflow-hidden max-h-[92vh] my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-surface-container-highest bg-surface-container-high/90">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">badge</span>
            <div>
              <h2 className="font-headline-md text-base font-bold text-on-surface leading-tight">
                Player Profile &amp; Friends
              </h2>
              <span className="font-label-code text-[10px] text-secondary flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                ONLINE • ARENA HOST
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Profile Modal"
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-surface-container hover:bg-surface-bright text-on-surface-variant hover:text-white transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 overflow-y-auto flex flex-col gap-4 no-scrollbar">
          {/* Individual Profile Showcase Card */}
          <div className="relative rounded-2xl bg-gradient-to-b from-surface-container-high via-surface-container to-surface-container-low p-4 border border-surface-container-highest shadow-lg flex flex-col gap-3">
            <div className="flex items-center gap-3.5">
              {/* Profile Avatar with Glowing Ring */}
              <div className="relative shrink-0">
                <img
                  alt={profile.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-secondary shadow-[0_0_16px_rgba(78,222,163,0.35)]"
                  src={selectedAvatar}
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 bg-secondary text-surface font-label-code text-[10px] font-black px-1.5 py-0.2 rounded-md shadow">
                  YOU
                </span>
                <span className="absolute -top-1 -left-1 bg-surface-bright text-primary font-label-code text-[9px] font-bold px-1.5 py-0.2 rounded shadow">
                  L{profile.level}
                </span>
              </div>

              {/* Name, Tag & Level Info */}
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div className="flex flex-col gap-1.5">
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      placeholder="Your Name"
                      className="bg-surface-container-lowest px-2.5 py-1 rounded-lg font-headline-md text-sm font-bold text-white border border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <input
                      value={editingTag}
                      onChange={(e) => setEditingTag(e.target.value)}
                      placeholder="@handle"
                      className="bg-surface-container-lowest px-2.5 py-0.5 rounded font-label-code text-xs text-secondary border border-surface-container-highest focus:outline-none"
                    />
                    {nameError && (
                      <span className="text-[10px] text-error font-body-sm">{nameError}</span>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-headline-md text-lg font-bold text-white truncate">
                        {profile.name}
                      </h3>
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          setIsEditing(true);
                        }}
                        className="text-[11px] font-label-code text-primary hover:text-white flex items-center gap-0.5 bg-surface-container px-2 py-0.5 rounded-lg active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[13px]">edit</span>
                        Edit
                      </button>
                    </div>
                    <span className="font-label-code text-xs text-secondary font-semibold block">
                      {profile.gamerTag}
                    </span>
                    <span className="font-label-code text-[10px] text-on-surface-variant block mt-0.5">
                      Cyber Grandmaster • 4x Win Streak
                    </span>
                  </div>
                )}

                {/* Level XP Progress Bar */}
                <div className="flex flex-col gap-0.5 mt-2">
                  <div className="flex justify-between text-[10px] font-label-code">
                    <span className="text-tertiary">Level {profile.level}</span>
                    <span className="text-on-surface-variant">1,420 / 2,000 XP</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-lowest rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-secondary to-tertiary w-[71%] rounded-full shadow-[0_0_8px_rgba(78,222,163,0.5)]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Avatar Preset Selector */}
            <div className="flex flex-col gap-1.5 pt-1 border-t border-surface-container-highest">
              <span className="font-label-code text-[11px] text-on-surface-variant uppercase tracking-wider">
                Choose Esports Avatar:
              </span>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedAvatar(preset.url);
                      onUpdateProfile({ avatar: preset.url });
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all active:scale-90 ${
                      selectedAvatar === preset.url
                        ? 'border-secondary ring-2 ring-secondary/50 scale-105'
                        : 'border-surface-container-highest opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      alt={preset.name}
                      src={preset.url}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg bg-surface-container text-xs font-label-code text-on-surface-variant hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-1.5 rounded-lg bg-secondary text-surface text-xs font-headline-md font-bold shadow active:scale-95"
                >
                  Save Profile
                </button>
              </div>
            )}
          </div>

          {/* Room Code & Play With Friends Hub */}
          <div className="rounded-2xl bg-surface-container-high p-4 border border-surface-container-highest shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[19px]">meeting_room</span>
                <h4 className="font-headline-md text-sm font-bold text-on-surface">
                  Play With Friends
                </h4>
              </div>
              <span className="rounded-full bg-secondary/20 text-secondary font-label-code text-[10px] px-2 py-0.5 font-bold">
                MULTIPLAYER READY
              </span>
            </div>

            {/* Current Active Room Code Card */}
            <div className="rounded-xl bg-surface-container-lowest p-3 border border-surface-container-highest flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-code text-[10px] text-on-surface-variant uppercase tracking-wider">
                  Your Room Code
                </span>
                <span className="font-label-numeric-lg text-[22px] font-bold text-primary tracking-widest drop-shadow-[0_0_10px_rgba(192,193,255,0.4)]">
                  {roomCode}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleGenerateNewCode}
                  title="Generate New Code"
                  className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-primary active:scale-95 transition-all border border-surface-container-highest"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                </button>
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-code text-[11px] font-semibold flex items-center gap-1 shadow active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copiedRoomCode ? 'done' : 'content_copy'}
                  </span>
                  <span>{copiedRoomCode ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleShareInvite}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-primary-container via-inverse-primary to-primary text-white font-headline-md text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_16px_rgba(128,131,255,0.35)] active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-white">share</span>
                <span className="text-white">{copiedInvite ? 'Invite Copied!' : 'Invite Friends'}</span>
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setShowQr(!showQr);
                }}
                className="py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-bright text-on-surface font-headline-md text-xs font-semibold flex items-center justify-center gap-1.5 border border-surface-container-highest active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  qr_code_2
                </span>
                <span>QR Instant Join</span>
              </button>
            </div>

            {/* Expandable QR Card */}
            {showQr && (
              <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-3 border border-surface-container-highest animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-on-surface p-1 flex items-center justify-center text-surface shadow">
                    <span className="material-symbols-outlined text-[36px]">qr_code</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-sm text-[12px] font-bold text-on-surface">
                      Scan with Phone Camera
                    </span>
                    <span className="font-label-code text-[10px] text-outline">
                      mindarena.gg/join/{roomCode}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowQr(false)}
                  className="p-1 text-on-surface-variant hover:text-white"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            )}

            {/* Join Another Friend's Room Input */}
            <form
              onSubmit={handleJoinFriendRoom}
              className="flex items-center gap-1.5 rounded-xl bg-surface-container-lowest p-1.5 border border-surface-container-highest mt-1"
            >
              <div className="flex items-center pl-2 text-outline">
                <span className="font-label-code text-[12px] font-bold">#</span>
              </div>
              <input
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                placeholder="ENTER FRIEND'S CODE..."
                className="w-full bg-transparent font-label-code text-[11px] uppercase tracking-wider text-on-surface placeholder:text-outline focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-secondary text-surface px-3 py-1.5 font-label-code text-[11px] font-bold hover:brightness-110 active:scale-95 transition-all shadow"
              >
                Join
              </button>
            </form>
            {joinError && (
              <span className="text-[10px] text-error font-body-sm -mt-1 px-1">{joinError}</span>
            )}

            {/* Active Squad Friends Roster */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-surface-container-highest">
              <span className="font-label-code text-[10px] text-on-surface-variant uppercase tracking-wider">
                Online Friends in Arena:
              </span>
              <div className="flex flex-col gap-1.5">
                {[
                  { name: 'Aarav_Pro', points: '1,380 pts', color: '#10b981', team: 'Green' },
                  { name: 'Priya_Logic', points: '1,510 pts', color: '#f59e0b', team: 'Yellow' },
                  { name: 'Kabir_Quant', points: '1,290 pts', color: '#3b82f6', team: 'Blue' },
                ].map((friend) => (
                  <div
                    key={friend.name}
                    className="flex items-center justify-between bg-surface-container-lowest px-2.5 py-1.5 rounded-xl border border-surface-container-highest text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: friend.color }}
                      />
                      <span className="font-body-sm text-[12px] font-semibold text-on-surface">
                        {friend.name}
                      </span>
                      <span className="font-label-code text-[10px] text-outline">
                        ({friend.team})
                      </span>
                    </div>
                    <button
                      onClick={() => handleInviteFriend(friend.name)}
                      className={`px-2 py-0.5 rounded font-label-code text-[10px] font-semibold active:scale-95 transition-all ${
                        invitedFriends[friend.name]
                          ? 'bg-secondary/20 text-secondary'
                          : 'bg-surface-container hover:bg-surface-bright text-primary'
                      }`}
                    >
                      {invitedFriends[friend.name] ? 'Invited ✓' : 'Invite'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Player Battle Records */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-surface-container-high p-2 rounded-xl border border-surface-container-highest">
              <span className="font-label-code text-[9px] text-on-surface-variant block">
                LUDO WINS
              </span>
              <span className="font-label-numeric-md text-[14px] font-bold text-secondary">18</span>
            </div>
            <div className="bg-surface-container-high p-2 rounded-xl border border-surface-container-highest">
              <span className="font-label-code text-[9px] text-on-surface-variant block">
                LOGIC CLEARED
              </span>
              <span className="font-label-numeric-md text-[14px] font-bold text-primary">42</span>
            </div>
            <div className="bg-surface-container-high p-2 rounded-xl border border-surface-container-highest">
              <span className="font-label-code text-[9px] text-on-surface-variant block">
                QUANT SPEED
              </span>
              <span className="font-label-numeric-md text-[14px] font-bold text-tertiary">
                14.2s
              </span>
            </div>
            <div className="bg-surface-container-high p-2 rounded-xl border border-surface-container-highest">
              <span className="font-label-code text-[9px] text-on-surface-variant block">
                WIN RATE
              </span>
              <span className="font-label-numeric-md text-[14px] font-bold text-secondary">
                68%
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-surface-container-highest bg-surface-container-high flex justify-end">
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-headline-md text-xs font-bold active:scale-95 shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
