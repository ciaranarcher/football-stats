import Link from 'next/link';
import { MatchWithResult } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface MatchCardProps {
  match: MatchWithResult;
  teamId: string;
}

export function MatchCard({ match, teamId }: MatchCardProps) {
  const resultColor = {
    win: 'bg-green-100 text-green-800',
    draw: 'bg-yellow-100 text-yellow-800',
    loss: 'bg-red-100 text-red-800',
  };

  const resultLabel = {
    win: 'W',
    draw: 'D',
    loss: 'L',
  };

  return (
    <Link href={`/teams/${teamId}/matches/${match.id}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer last:border-0">
        <div className="flex items-center gap-4">
          <span
            className={`badge font-bold ${resultColor[match.result]}`}
          >
            {resultLabel[match.result]}
          </span>
          <div>
            <p className="font-medium text-gray-900">vs {match.opponent}</p>
            <p className="text-sm text-gray-500">
              {formatDate(match.date)}
              {match.competition && ` • ${match.competition}`}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            {match.calculatedOurScore} - {match.calculatedOpponentScore}
          </p>
          {match.goals.length > 0 && (
            <p className="text-sm text-gray-500">{match.goals.length} goal{match.goals.length !== 1 ? 's' : ''}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
