/**
 * Core game rules, scoring algorithms, and puzzle evaluators.
 * Decoupled from UI to enable pure unit testing and deterministic simulation.
 */

export interface Player {
  id: string;
  name: string;
  avatar: string;
  color: 'red' | 'green' | 'yellow' | 'blue';
  score: number;
  streak: number;
  status: 'ready' | 'thinking' | 'solving' | 'locked' | 'waiting';
  timeSec?: number;
  isHost?: boolean;
}

export interface BullsCowsResult {
  bulls: number;
  cows: number;
  isSolved: boolean;
}

/**
 * Evaluates a guess against a secret code for Bulls & Cows deduction.
 * Bull: correct digit in correct position
 * Cow: correct digit in different position
 */
export function evaluateBullsAndCows(secret: string, guess: string): BullsCowsResult {
  if (secret.length !== 4 || guess.length !== 4) {
    throw new Error('Secret and guess must be 4 digits');
  }

  let bulls = 0;
  let cows = 0;

  const secretArr = secret.split('');
  const guessArr = guess.split('');
  const secretUsed = [false, false, false, false];
  const guessUsed = [false, false, false, false];

  // 1. Identify bulls
  for (let i = 0; i < 4; i++) {
    if (guessArr[i] === secretArr[i]) {
      bulls++;
      secretUsed[i] = true;
      guessUsed[i] = true;
    }
  }

  // 2. Identify cows
  for (let i = 0; i < 4; i++) {
    if (!guessUsed[i]) {
      for (let j = 0; j < 4; j++) {
        if (!secretUsed[j] && guessArr[i] === secretArr[j]) {
          cows++;
          secretUsed[j] = true;
          break;
        }
      }
    }
  }

  return {
    bulls,
    cows,
    isSolved: bulls === 4,
  };
}

/**
 * Calculates net profit multiplier from markup, discount, and false weight.
 * Multiplier_Net = (1 + markup) * (1 - discount) * (nominalWeight / actualWeight)
 */
export function calculateQuantNetProfit(
  markupPct: number,
  discountPct: number,
  actualWeightGrams: number,
  nominalWeightGrams: number = 1000
): { multiplier: number; profitPercentage: number; formattedPercentage: string } {
  const multMarkup = 1 + markupPct / 100;
  const multDiscount = 1 - discountPct / 100;
  const multWeight = nominalWeightGrams / actualWeightGrams;

  const netMultiplier = multMarkup * multDiscount * multWeight;
  const profitPercentage = (netMultiplier - 1) * 100;

  return {
    multiplier: netMultiplier,
    profitPercentage: Math.round(profitPercentage * 100) / 100,
    formattedPercentage: `${(profitPercentage).toFixed(2)}%`,
  };
}

/**
 * Calculates score earned based on response speed and difficulty pool.
 */
export function calculateSpeedScore(
  baseScore: number,
  timeTakenSec: number,
  maxTimeSec: number = 45,
  isCorrect: boolean = true
): number {
  if (!isCorrect) {
    return -25;
  }
  const speedBonusRatio = Math.max(0, (maxTimeSec - timeTakenSec) / maxTimeSec);
  const earned = Math.round(baseScore * 0.5 + baseScore * 0.5 * speedBonusRatio);
  return earned;
}

/**
 * Validates 4x4 matrix logic target.
 * Given arithmetic row step and clockwise rotation sequence.
 */
export function solvePatternMatrixTarget(
  rowBase: number,
  rowStep: number,
  rotationIndex: number
): { value: number; rotationDeg: number } {
  const value = rowBase + rowStep * 3;
  const rotationDeg = (rotationIndex * 90) % 360;
  return { value, rotationDeg };
}

/**
 * Ludo token movement helper.
 * Determines if pawn can exit yard (requires roll of 6)
 * and advances track step.
 */
export function canPawnExitYard(diceRoll: number): boolean {
  return diceRoll === 6;
}

export function advanceLudoToken(
  currentPos: number,
  roll: number,
  maxPathLen: number = 56
): { newPos: number; isHome: boolean; isSafe: boolean } {
  const SAFE_SQUARES = [1, 9, 14, 22, 27, 35, 40, 48];
  const newPos = Math.min(maxPathLen, currentPos + roll);
  const isHome = newPos >= maxPathLen;
  const isSafe = SAFE_SQUARES.includes(newPos) || isHome;
  return { newPos, isHome, isSafe };
}

/**
 * Validates a room code format (alphanumeric, 4-10 characters).
 */
export function isValidRoomCode(code: string): boolean {
  if (!code) return false;
  const trimmed = code.trim().toUpperCase();
  return /^[A-Z0-9-]{3,12}$/.test(trimmed);
}

/**
 * Generates a clean, memorable room code for playing with friends.
 */
export function generateRandomRoomCode(prefix = 'ARENA'): string {
  const num = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${num}`;
}

/**
 * Formats a shareable friend invitation message.
 */
export function createFriendInviteMessage(roomCode: string, hostName: string): string {
  return `⚔️ ${hostName} invites you to duel in MindArena!
🎮 Game Modes: Ludo King, Logic Matrix & Quant Sprint
🔑 Battlefield Room Code: ${roomCode}
🚀 Join now: mindarena.gg/join/${roomCode}`;
}

/**
 * Validates profile name and returns sanitized string or error.
 */
export function validateProfileName(name: string): { isValid: boolean; sanitized: string; error?: string } {
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { isValid: false, sanitized: trimmed, error: 'Name must be at least 2 characters long' };
  }
  if (trimmed.length > 20) {
    return { isValid: false, sanitized: trimmed.slice(0, 20), error: 'Name must not exceed 20 characters' };
  }
  return { isValid: true, sanitized: trimmed };
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank?: number;
  streak?: number;
  badge?: string;
  isCurrentUser?: boolean;
}

/**
 * Returns top N players sorted by total points descending, assigning 1-based ranks.
 */
export function getTopLeaderboardPlayers(
  players: LeaderboardEntry[],
  limit: number = 5
): LeaderboardEntry[] {
  const sorted = [...players].sort((a, b) => b.points - a.points);
  return sorted.slice(0, limit).map((p, idx) => ({
    ...p,
    rank: idx + 1,
  }));
}


