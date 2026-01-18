import { getTeamById } from '@/lib/db/teams';
import { getPlayersByTeamId } from '@/lib/db/players';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { PlayerForm } from '@/components/players/PlayerForm';
import { PlayerList } from '@/components/players/PlayerList';

export const dynamic = 'force-dynamic';

interface AdminPageProps {
  params: { teamId: string };
}

export default async function AdminPage({ params }: AdminPageProps) {
  const team = await getTeamById(params.teamId);

  if (!team) {
    notFound();
  }

  const players = await getPlayersByTeamId(params.teamId);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/teams" className="hover:text-gray-900">Teams</Link>
          <span>/</span>
          <Link href={`/teams/${team.id}`} className="hover:text-gray-900">{team.name}</Link>
          <span>/</span>
          <span>Manage Players</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Players</h1>
        <p className="text-gray-600 mt-1">Add and manage players for {team.name}</p>
      </div>

      {/* Add Player Form */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Player</h2>
        <PlayerForm teamId={params.teamId} />
      </Card>

      {/* Player List */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Players</h2>
        <PlayerList players={players} teamId={params.teamId} />
      </Card>
    </div>
  );
}
