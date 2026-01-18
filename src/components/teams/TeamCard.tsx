import Link from 'next/link';
import { Team } from '@/lib/types';
import { Card } from '@/components/ui/Card';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Link href={`/teams/${team.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{team.division}</p>
          </div>
          <div>
            <span
              className={`badge ${
                team.status === 'active' ? 'badge-success' : 'badge-gray'
              }`}
            >
              {team.status}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
