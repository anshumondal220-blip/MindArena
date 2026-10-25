import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateBullsAndCows,
  calculateQuantNetProfit,
  calculateSpeedScore,
  solvePatternMatrixTarget,
  canPawnExitYard,
  advanceLudoToken,
  isValidRoomCode,
  generateRandomRoomCode,
  createFriendInviteMessage,
  validateProfileName,
  getTopLeaderboardPlayers,
} from './game-rules';

test('Bulls and Cows evaluation handles matches and cows correctly', () => {
  // Secret: 4821, Guess: 4821 -> 4 Bulls
  const perfect = evaluateBullsAndCows('4821', '4821');
  assert.equal(perfect.bulls, 4);
  assert.equal(perfect.cows, 0);
  assert.equal(perfect.isSolved, true);

  // Secret: 4829, Guess: 4821 -> 2 Bulls (4, 8) and 1 Cow (if 2 is in secret at pos 2, wait: pos 0=4, pos 1=8, pos 2=2 matches!)
  // Secret: 3824, Guess: 4821 -> 2 Bulls (8 at pos 1, 2 at pos 2), 1 Cow (4 at pos 0 vs pos 3)
  const partial = evaluateBullsAndCows('3824', '4821');
  assert.equal(partial.bulls, 2);
  assert.equal(partial.cows, 1);
  assert.equal(partial.isSolved, false);
});

test('Quant Profit calculation matches exam formula', () => {
  // Problem from screenshot:
  // Markup: 40% (1.4), Discount: 25% (0.75), Weight: 900g instead of 1000g (10/9)
  // 1.4 * 0.75 * (10/9) = 1.05 * 10 / 9 = 10.5 / 9 = 7/6 = 1.166666... -> 16.67%
  const result = calculateQuantNetProfit(40, 25, 900, 1000);
  assert.equal(result.formattedPercentage, '16.67%');
  assert.ok(Math.abs(result.profitPercentage - 16.67) < 0.01);
});

test('Speed score awards higher points for fast correct answers', () => {
  const fastScore = calculateSpeedScore(100, 10, 45, true);
  const slowScore = calculateSpeedScore(100, 40, 45, true);
  assert.ok(fastScore > slowScore, 'Fast answers must earn more than slow answers');

  const penalty = calculateSpeedScore(100, 10, 45, false);
  assert.equal(penalty, -25);
});

test('Matrix pattern logic computes target value and rotation', () => {
  // Row 4 from screenshot: base 8, step +7: 8, 15, 22, 29 (rotation: 270, 0, 90, 180)
  const target = solvePatternMatrixTarget(8, 7, 2);
  assert.equal(target.value, 29);
});

test('Ludo rules check yard exit and track advancement', () => {
  assert.equal(canPawnExitYard(6), true);
  assert.equal(canPawnExitYard(5), false);

  const move = advanceLudoToken(1, 8);
  assert.equal(move.newPos, 9);
  assert.equal(move.isSafe, true); // 9 is a safe square
});

test('Profile and room code management validates and formats correctly', () => {
  assert.equal(isValidRoomCode('ARENA-7'), true);
  assert.equal(isValidRoomCode('DUEL-99'), true);
  assert.equal(isValidRoomCode('x'), false); // too short
  assert.equal(isValidRoomCode('ARENA!@#'), false); // invalid characters

  const generated = generateRandomRoomCode('PLAY');
  assert.ok(generated.startsWith('PLAY-'));
  assert.equal(isValidRoomCode(generated), true);

  const invite = createFriendInviteMessage('ARENA-7', 'Anshu');
  assert.ok(invite.includes('ARENA-7'));
  assert.ok(invite.includes('Anshu'));

  const validName = validateProfileName('Anshu Pro');
  assert.equal(validName.isValid, true);
  assert.equal(validName.sanitized, 'Anshu Pro');

  const tooShort = validateProfileName('A');
  assert.equal(tooShort.isValid, false);
});

test('Leaderboard sorting ranks top players by points descending', () => {
  const pool = [
    { id: '1', name: 'Aarav', avatar: '', points: 1380 },
    { id: '2', name: 'You', avatar: '', points: 1420 },
    { id: '3', name: 'Priya', avatar: '', points: 1510 },
    { id: '4', name: 'Kabir', avatar: '', points: 1290 },
    { id: '5', name: 'Rohan', avatar: '', points: 1100 },
    { id: '6', name: 'Neha', avatar: '', points: 950 },
  ];

  const top5 = getTopLeaderboardPlayers(pool, 5);
  assert.equal(top5.length, 5);
  // 1st must be Priya (1510)
  assert.equal(top5[0].name, 'Priya');
  assert.equal(top5[0].rank, 1);
  assert.equal(top5[0].points, 1510);

  // 2nd must be You (1420)
  assert.equal(top5[1].name, 'You');
  assert.equal(top5[1].rank, 2);

  // 5th must be Rohan (1100)
  assert.equal(top5[4].name, 'Rohan');
  assert.equal(top5[4].rank, 5);
});


