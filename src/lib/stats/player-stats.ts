import { Match, Player, PlayerStats } from '@/lib/types';

/**
 * Calculate player statistics from matches
 */
export function calculatePlayerStats(
  player: Player,
  matches: Match[]
): PlayerStats {
  let totalGoals = 0;
  let normalGoals = 0;
  let penaltyGoals = 0;
  const matchesPlayedSet = new Set<string>();

  matches.forEach(match => {
    const playerGoals = match.goals.filter(g => g.playerId === player.id);

    if (playerGoals.length > 0) {
      matchesPlayedSet.add(match.id);
    }

    playerGoals.forEach(goal => {
      totalGoals++;
      if (goal.type === 'PENALTY') {
        penaltyGoals++;
      } else {
        normalGoals++;
      }
    });
  });

  return {
    playerId: player.id,
    playerName: player.name,
    totalGoals,
    normalGoals,
    penaltyGoals,
    matchesPlayed: matchesPlayedSet.size,
  };
}

/**
 * Calculate stats for all players in a team
 */
export function calculateTeamPlayerStats(
  players: Player[],
  matches: Match[]
): PlayerStats[] {
  return players
    .map(player => calculatePlayerStats(player, matches))
    .filter(stats => stats.totalGoals > 0 || stats.matchesPlayed > 0)
    .sort((a, b) => b.totalGoals - a.totalGoals);
}
