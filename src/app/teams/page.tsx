import { getAllTeams } from '@/lib/db/teams';
import { TeamList } from '@/components/teams/TeamList';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function TeamsPage() {
  const teams = await getAllTeams();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600 mt-1">Manage your football teams</p>
        </div>
        <Link href="/teams/new">
          <Button>Create Team</Button>
        </Link>
      </div>

      <TeamList teams={teams} />
    </div>
  );
}
