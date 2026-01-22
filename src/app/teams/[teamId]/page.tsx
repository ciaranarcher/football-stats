import { getTeamById } from '@/lib/db/teams';
import { getMatchesWithResultsByTeamId } from '@/lib/db/matches';
import { calculateTeamStats } from '@/lib/stats/team-stats';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MatchCard } from '@/components/matches/MatchCard';

export const dynamic = 'force-dynamic';

interface TeamPageProps {
  params: { teamId: string };
}

export default async function TeamPage({ params }: TeamPageProps) {
  console.log('[TeamPage] Loading team page for teamId:', params.teamId);

  const team = await getTeamById(params.teamId);

  if (!team) {
    console.log('[TeamPage] Team not found, returning 404');
    notFound();
  }

  console.log('[TeamPage] Team loaded successfully:', team);
  console.log('[TeamPage] Fetching matches for team...');

  const matches = await getMatchesWithResultsByTeamId(params.teamId);
  console.log('[TeamPage] Matches loaded, count:', matches.length);

  const stats = calculateTeamStats(matches);
  console.log('[TeamPage] Stats calculated:', stats);

  console.log('[TeamPage] Rendering page...');

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/teams" className="hover:text-gray-900">Teams</Link>
          <span>/</span>
          <span>{team.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
            <p className="text-gray-600 mt-1">{team.division}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/teams/${team.id}/admin`}>
              <Button variant="secondary">Manage Players</Button>
            </Link>
            <Link href={`/teams/${team.id}/matches/new`}>
              <Button>Add Match</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Matches</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalMatches}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Wins</h3>
          <p className="text-2xl font-bold text-green-600">{stats.wins}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Draws</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.draws}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Losses</h3>
          <p className="text-2xl font-bold text-red-600">{stats.losses}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Goals For</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.goalsFor}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Goals Against</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.goalsAgainst}</p>
        </Card>
      </div>

      {/* Win Percentage */}
      {stats.totalMatches > 0 && (
        <Card className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Win Rate</h3>
          <div className="flex gap-2 items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-green-600 h-full"
                style={{ width: `${stats.winPercentage}%` }}
              />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {stats.winPercentage.toFixed(1)}%
            </span>
          </div>
        </Card>
      )}

      {/* Matches Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Matches</h2>
        </div>
        {matches.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No matches yet. Add your first match!</p>
        ) : (
          <div>
            {matches.map(match => (
              <MatchCard key={match.id} match={match} teamId={params.teamId} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
