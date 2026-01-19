import { calculatePlayerStats, calculateTeamPlayerStats } from '@/lib/stats/player-stats';
import { Player, Match } from '@/lib/types';

describe('calculatePlayerStats', () => {
  const testPlayer: Player = {
    id: 'player1',
    teamId: 'team1',
    name: 'John Doe',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  it('should return zero stats for player with no goals', () => {
    const matches: Match[] = [];
    const stats = calculatePlayerStats(testPlayer, matches);

    expect(stats).toEqual({
      playerId: 'player1',
      playerName: 'John Doe',
      totalGoals: 0,
      normalGoals: 0,
      penaltyGoals: 0,
      matchesPlayed: 0,
    });
  });

  it('should correctly count normal goals', () => {
    const matches: Match[] = [
      {
        id: 'match1',
        teamId: 'team1',
        opponent: 'Team A',
        date: '2024-01-01',
        venue: 'home',
        goals: [
          {
            id: 'goal1',
            matchId: 'match1',
            teamId: 'team1',
            playerId: 'player1',
            minute: 10,
            type: 'NORMAL',
          },
          {
            id: 'goal2',
            matchId: 'match1',
            teamId: 'team1',
            playerId: 'player1',
            minute: 20,
            type: 'NORMAL',
          },
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ];

    const stats = calculatePlayerStats(testPlayer, matches);

    expect(stats.totalGoals).toBe(2);
    expect(stats.normalGoals).toBe(2);
    expect(stats.penaltyGoals).toBe(0);
    expect(stats.matchesPlayed).toBe(1);
  });

  it('should correctly count penalty goals', () => {
    const matches: Match[] = [
      {
        id: 'match1',
        teamId: 'team1',
        opponent: 'Team A',
        date: '2024-01-01',
        venue: 'home',
        goals: [
          {
            id: 'goal1',
            matchId: 'match1',
            teamId: 'team1',
            playerId: 'player1',
            minute: 45,
            type: 'PENALTY',
          },
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ];

    const stats = calculatePlayerStats(testPlayer, matches);

    expect(stats.totalGoals).toBe(1);
    expect(stats.normalGoals).toBe(0);
    expect(stats.penaltyGoals).toBe(1);
    expect(stats.matchesPlayed).toBe(1);
  });

  it('should correctly count mixed goal types', () => {
    const matches: Match[] = [
      {
        id: 'match1',
        teamId: 'team1',
        opponent: 'Team A',
        date: '2024-01-01',
        venue: 'home',
        goals: [
          {
            id: 'goal1',
            matchId: 'match1',
            teamId: 'team1',
            playerId: 'player1',
            minute: 10,
            type: 'NORMAL',
          },
          {
            id: 'goal2',
            matchId: 'match1',
            teamId: 'team1',
            playerId: 'player1',
            minute: 45,
            type: 'PENALTY',
          },
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: 'match2',
        teamId: 'team1',
        opponent: 'Team B',
        date: '2024-01-02',
        venue: 'away',
        goals: [
          {
            id: 'goal3',
            matchId: 'match2',
            teamId: 'team1',
            playerId: 'player1',
            minute: 60,
            type: 'NORMAL',
          },
        ],
        createdAt: '2024-01-02',
        updatedAt: '2024-01-02',
      },
    ];

    const stats = calculatePlayerStats(testPlayer, matches);

    expect(stats.totalGoals).toBe(3);
    expect(stats.normalGoals).toBe(2);
    expect(stats.penaltyGoals).toBe(1);
    expect(stats.matchesPlayed).toBe(2);
  });

  it('should not count goals by other players', () => {
    const matches: Match[] = [
      {
        id: 'match1',
        teamId: 'team1',
        opponent: 'Team A',
        date: '2024-01-01',
        venue: 'home',
        goals: [
          {
            id: 'goal1',
            matchId: 'match1',
            teamId: 'team1',
            playerId: 'player2',
            minute: 10,
            type: 'NORMAL',
          },
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ];

    const stats = calculatePlayerStats(testPlayer, matches);

    expect(stats.totalGoals).toBe(0);
    expect(stats.matchesPlayed).toBe(0);
  });
});

describe('calculateTeamPlayerStats', () => {
  it('should calculate stats for multiple players', () => {
    const players: Player[] = [
      {
        id: 'player1',
        teamId: 'team1',
        name: 'Player 1',
        status: 'active',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: 'player2',
        teamId: 'team1',
        name: 'Player 2',
        status: 'active',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ];

    const matches: Match[] = [
      {
        id: 'match1',
        teamId: 'team1',
        opponent: 'Team A',
        date: '2024-01-01',
        venue: 'home',
        goals: [
          {
            id: 'goal1',
            matchId: 'match1',
            teamId: 'team1',
            playerId: 'player1',
            minute: 10,
            type: 'NORMAL',
          },
          {
            id: 'goal2',
            matchId: 'match1',
            teamId: 'team1',
            playerId: 'player1',
            minute: 20,
            type: 'NORMAL',
          },
          {
            id: 'goal3',
            matchId: 'match1',
            teamId: 'team1',
            playerId: 'player2',
            minute: 30,
            type: 'NORMAL',
          },
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ];

    const stats = calculateTeamPlayerStats(players, matches);

    expect(stats).toHaveLength(2);
    // Should be sorted by total goals (player1 has 2, player2 has 1)
    expect(stats[0].playerId).toBe('player1');
    expect(stats[0].totalGoals).toBe(2);
    expect(stats[1].playerId).toBe('player2');
    expect(stats[1].totalGoals).toBe(1);
  });

  it('should filter out players with no activity', () => {
    const players: Player[] = [
      {
        id: 'player1',
        teamId: 'team1',
        name: 'Player 1',
        status: 'active',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: 'player2',
        teamId: 'team1',
        name: 'Player 2',
        status: 'active',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ];

    const matches: Match[] = [
      {
        id: 'match1',
        teamId: 'team1',
        opponent: 'Team A',
        date: '2024-01-01',
        venue: 'home',
        goals: [
          {
            id: 'goal1',
            matchId: 'match1',
            teamId: 'team1',
            playerId: 'player1',
            minute: 10,
            type: 'NORMAL',
          },
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ];

    const stats = calculateTeamPlayerStats(players, matches);

    expect(stats).toHaveLength(1);
    expect(stats[0].playerId).toBe('player1');
  });
});
