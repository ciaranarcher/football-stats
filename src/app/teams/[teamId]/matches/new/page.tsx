import { getTeamById } from '@/lib/db/teams';
import { getActivePlayersByTeamId } from '@/lib/db/players';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MatchForm } from '@/components/matches/MatchForm';

export const dynamic = 'force-dynamic';

interface NewMatchPageProps {
  params: { teamId: string };
}

export default async function NewMatchPage({ params }: NewMatchPageProps) {
  const team = await getTeamById(params.teamId);

  if (!team) {
    notFound();
  }

  const players = await getActivePlayersByTeamId(params.teamId);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/teams" className="hover:text-gray-900">Teams</Link>
          <span>/</span>
          <Link href={`/teams/${team.id}`} className="hover:text-gray-900">{team.name}</Link>
          <span>/</span>
          <span>New Match</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Match</h1>
        <p className="text-gray-600 mt-1">Record a match for {team.name}</p>
      </div>

      <MatchForm teamId={params.teamId} players={players} />
    </div>
  );
}
