import { MatchWithResult, TeamStats } from '@/lib/types';

/**
 * Calculate team statistics from matches
 */
export function calculateTeamStats(matches: MatchWithResult[]): TeamStats {
  const totals = matches.reduce(
    (acc, match) => {
      if (match.result === 'win') acc.wins++;
      else if (match.result === 'draw') acc.draws++;
      else acc.losses++;

      acc.goalsFor += match.calculatedOurScore;
      acc.goalsAgainst += match.calculatedOpponentScore;

      return acc;
    },
    { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }
  );

  const totalMatches = matches.length;

  return {
    ...totals,
    totalMatches,
    winPercentage: totalMatches > 0 ? (totals.wins / totalMatches) * 100 : 0,
    drawPercentage: totalMatches > 0 ? (totals.draws / totalMatches) * 100 : 0,
    lossPercentage: totalMatches > 0 ? (totals.losses / totalMatches) * 100 : 0,
  };
}
