import { calculateTeamStats } from '@/lib/stats/team-stats';
import { MatchWithResult } from '@/lib/types';

describe('calculateTeamStats', () => {
  it('should return zero stats for empty matches array', () => {
    const stats = calculateTeamStats([]);

    expect(stats).toEqual({
      totalMatches: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      winPercentage: 0,
      drawPercentage: 0,
      lossPercentage: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    });
  });

  it('should correctly calculate stats for wins only', () => {
    const matches: MatchWithResult[] = [
      {
        id: '1',
        teamId: 'team1',
        opponent: 'Team A',
        date: '2024-01-01',
        venue: 'home',
        goals: [],
        result: 'win',
        calculatedOurScore: 3,
        calculatedOpponentScore: 1,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: '2',
        teamId: 'team1',
        opponent: 'Team B',
        date: '2024-01-02',
        venue: 'away',
        goals: [],
        result: 'win',
        calculatedOurScore: 2,
        calculatedOpponentScore: 0,
        createdAt: '2024-01-02',
        updatedAt: '2024-01-02',
      },
    ];

    const stats = calculateTeamStats(matches);

    expect(stats.totalMatches).toBe(2);
    expect(stats.wins).toBe(2);
    expect(stats.draws).toBe(0);
    expect(stats.losses).toBe(0);
    expect(stats.winPercentage).toBe(100);
    expect(stats.goalsFor).toBe(5);
    expect(stats.goalsAgainst).toBe(1);
  });

  it('should correctly calculate stats for mixed results', () => {
    const matches: MatchWithResult[] = [
      {
        id: '1',
        teamId: 'team1',
        opponent: 'Team A',
        date: '2024-01-01',
        venue: 'home',
        goals: [],
        result: 'win',
        calculatedOurScore: 2,
        calculatedOpponentScore: 1,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: '2',
        teamId: 'team1',
        opponent: 'Team B',
        date: '2024-01-02',
        venue: 'away',
        goals: [],
        result: 'draw',
        calculatedOurScore: 1,
        calculatedOpponentScore: 1,
        createdAt: '2024-01-02',
        updatedAt: '2024-01-02',
      },
      {
        id: '3',
        teamId: 'team1',
        opponent: 'Team C',
        date: '2024-01-03',
        venue: 'home',
        goals: [],
        result: 'loss',
        calculatedOurScore: 0,
        calculatedOpponentScore: 2,
        createdAt: '2024-01-03',
        updatedAt: '2024-01-03',
      },
    ];

    const stats = calculateTeamStats(matches);

    expect(stats.totalMatches).toBe(3);
    expect(stats.wins).toBe(1);
    expect(stats.draws).toBe(1);
    expect(stats.losses).toBe(1);
    expect(stats.winPercentage).toBeCloseTo(33.33, 1);
    expect(stats.drawPercentage).toBeCloseTo(33.33, 1);
    expect(stats.lossPercentage).toBeCloseTo(33.33, 1);
    expect(stats.goalsFor).toBe(3);
    expect(stats.goalsAgainst).toBe(4);
  });

  it('should correctly calculate percentages', () => {
    const matches: MatchWithResult[] = [
      {
        id: '1',
        teamId: 'team1',
        opponent: 'Team A',
        date: '2024-01-01',
        venue: 'home',
        goals: [],
        result: 'win',
        calculatedOurScore: 1,
        calculatedOpponentScore: 0,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: '2',
        teamId: 'team1',
        opponent: 'Team B',
        date: '2024-01-02',
        venue: 'away',
        goals: [],
        result: 'win',
        calculatedOurScore: 1,
        calculatedOpponentScore: 0,
        createdAt: '2024-01-02',
        updatedAt: '2024-01-02',
      },
      {
        id: '3',
        teamId: 'team1',
        opponent: 'Team C',
        date: '2024-01-03',
        venue: 'home',
        goals: [],
        result: 'win',
        calculatedOurScore: 1,
        calculatedOpponentScore: 0,
        createdAt: '2024-01-03',
        updatedAt: '2024-01-03',
      },
      {
        id: '4',
        teamId: 'team1',
        opponent: 'Team D',
        date: '2024-01-04',
        venue: 'away',
        goals: [],
        result: 'loss',
        calculatedOurScore: 0,
        calculatedOpponentScore: 1,
        createdAt: '2024-01-04',
        updatedAt: '2024-01-04',
      },
    ];

    const stats = calculateTeamStats(matches);

    expect(stats.totalMatches).toBe(4);
    expect(stats.wins).toBe(3);
    expect(stats.losses).toBe(1);
    expect(stats.winPercentage).toBe(75);
    expect(stats.lossPercentage).toBe(25);
  });
});
