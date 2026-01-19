import { getTeamById } from '@/lib/db/teams';
import { getMatchWithResultById } from '@/lib/db/matches';
import { getPlayerById } from '@/lib/db/players';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface MatchPageProps {
  params: { teamId: string; matchId: string };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const [team, match] = await Promise.all([
    getTeamById(params.teamId),
    getMatchWithResultById(params.matchId),
  ]);

  if (!team || !match) {
    notFound();
  }

  // Get player names for goals
  const goalsWithPlayers = await Promise.all(
    match.goals.map(async (goal) => {
      const player = await getPlayerById(goal.playerId);
      return { ...goal, playerName: player?.name || 'Unknown Player' };
    })
  );

  const resultColor = {
    win: 'bg-green-100 text-green-800',
    draw: 'bg-yellow-100 text-yellow-800',
    loss: 'bg-red-100 text-red-800',
  };

  const resultLabel = {
    win: 'Win',
    draw: 'Draw',
    loss: 'Loss',
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/teams" className="hover:text-gray-900">Teams</Link>
          <span>/</span>
          <Link href={`/teams/${team.id}`} className="hover:text-gray-900">{team.name}</Link>
          <span>/</span>
          <span>vs {match.opponent}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {team.name} vs {match.opponent}
            </h1>
            <p className="text-gray-600 mt-1">
              {formatDate(match.date)}
              {match.competition && ` • ${match.competition}`}
              {' • '}
              <span className="capitalize font-medium">{match.venue}</span>
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <span className={`badge text-lg px-4 py-2 ${resultColor[match.result]}`}>
              {resultLabel[match.result]}
            </span>
            <span className="badge badge-gray uppercase">
              {match.venue}
            </span>
          </div>
        </div>
      </div>

      {/* Score */}
      <Card className="mb-6">
        <div className="flex items-center justify-center gap-8 py-6">
          <div className="text-center">
            <p className="text-gray-600 mb-2">{team.name}</p>
            <p className="text-6xl font-bold text-gray-900">{match.calculatedOurScore}</p>
          </div>
          <div className="text-4xl font-light text-gray-400">-</div>
          <div className="text-center">
            <p className="text-gray-600 mb-2">{match.opponent}</p>
            <p className="text-6xl font-bold text-gray-900">{match.calculatedOpponentScore}</p>
          </div>
        </div>
      </Card>

      {/* Goals */}
      <Card className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Goals</h2>
        {goalsWithPlayers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No goals scored in this match</p>
        ) : (
          <div className="space-y-3">
            {goalsWithPlayers.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚽</span>
                  <div>
                    <p className="font-medium text-gray-900">{goal.playerName}</p>
                    {goal.minute && (
                      <p className="text-sm text-gray-500">{goal.minute}&apos;</p>
                    )}
                  </div>
                </div>
                {goal.type === 'PENALTY' && (
                  <span className="badge badge-info">P</span>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Notes */}
      {match.notes && (
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Notes</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{match.notes}</p>
        </Card>
      )}
    </div>
  );
}
