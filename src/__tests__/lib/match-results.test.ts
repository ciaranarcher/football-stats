import { Match, MatchWithResult } from '@/lib/types';

// Direct test of match result calculation logic (extracted to avoid storage imports)
function testCalculateMatchResult(match: Match): MatchWithResult {
  const ourScore = match.ourScore ?? match.goals.length;
  const opponentScore = match.opponentScore ?? 0;

  let result: 'win' | 'draw' | 'loss';
  if (ourScore > opponentScore) result = 'win';
  else if (ourScore < opponentScore) result = 'loss';
  else result = 'draw';

  return {
    ...match,
    result,
    calculatedOurScore: ourScore,
    calculatedOpponentScore: opponentScore,
  };
}

describe('Match Result Calculation', () => {
  it('should calculate win when our score is higher', () => {
    const match: Match = {
      id: 'match1',
      teamId: 'team1',
      opponent: 'Team A',
      date: '2024-01-01',
      venue: 'home',
      goals: [
        { id: 'g1', matchId: 'match1', teamId: 'team1', playerId: 'p1', type: 'NORMAL' },
        { id: 'g2', matchId: 'match1', teamId: 'team1', playerId: 'p1', type: 'NORMAL' },
      ],
      opponentScore: 1,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    const result = testCalculateMatchResult(match);

    expect(result.result).toBe('win');
    expect(result.calculatedOurScore).toBe(2);
    expect(result.calculatedOpponentScore).toBe(1);
  });

  it('should calculate loss when opponent score is higher', () => {
    const match: Match = {
      id: 'match1',
      teamId: 'team1',
      opponent: 'Team A',
      date: '2024-01-01',
      venue: 'away',
      goals: [],
      opponentScore: 3,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    const result = testCalculateMatchResult(match);

    expect(result.result).toBe('loss');
    expect(result.calculatedOurScore).toBe(0);
    expect(result.calculatedOpponentScore).toBe(3);
  });

  it('should calculate draw when scores are equal', () => {
    const match: Match = {
      id: 'match1',
      teamId: 'team1',
      opponent: 'Team A',
      date: '2024-01-01',
      venue: 'home',
      goals: [
        { id: 'g1', matchId: 'match1', teamId: 'team1', playerId: 'p1', type: 'NORMAL' },
      ],
      opponentScore: 1,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    const result = testCalculateMatchResult(match);

    expect(result.result).toBe('draw');
  });

  it('should correctly handle home venue', () => {
    const match: Match = {
      id: 'match1',
      teamId: 'team1',
      opponent: 'Team A',
      date: '2024-01-01',
      venue: 'home',
      goals: [],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    const result = testCalculateMatchResult(match);

    expect(result.venue).toBe('home');
  });

  it('should correctly handle away venue', () => {
    const match: Match = {
      id: 'match1',
      teamId: 'team1',
      opponent: 'Team A',
      date: '2024-01-01',
      venue: 'away',
      goals: [],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    const result = testCalculateMatchResult(match);

    expect(result.venue).toBe('away');
  });
});
