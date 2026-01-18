'use client';

import { useState } from 'react';
import { Player } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface PlayerListProps {
  players: Player[];
  teamId: string;
}

export function PlayerList({ players, teamId }: PlayerListProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const activePlayers = players.filter(p => p.status === 'active');
  const inactivePlayers = players.filter(p => p.status === 'inactive');

  const handleToggleStatus = async (playerId: string, currentStatus: string) => {
    setLoading(playerId);
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await fetch(`/api/players/${playerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update player status');
      }

      router.refresh();
    } catch (error) {
      console.error('Error toggling player status:', error);
      alert('Failed to update player status');
    } finally {
      setLoading(null);
    }
  };

  const PlayerRow = ({ player }: { player: Player }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
      <div className="flex items-center gap-4">
        {player.number && (
          <span className="text-lg font-bold text-gray-400 w-8">{player.number}</span>
        )}
        <div>
          <p className="font-medium text-gray-900">{player.name}</p>
          {player.position && (
            <p className="text-sm text-gray-500">{player.position}</p>
          )}
        </div>
      </div>
      <Button
        variant={player.status === 'active' ? 'secondary' : 'primary'}
        onClick={() => handleToggleStatus(player.id, player.status)}
        disabled={loading === player.id}
        className="text-sm"
      >
        {loading === player.id
          ? 'Loading...'
          : player.status === 'active'
          ? 'Deactivate'
          : 'Reactivate'}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Active Players */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Active Players ({activePlayers.length})
        </h3>
        {activePlayers.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No active players</p>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200">
            {activePlayers.map(player => (
              <PlayerRow key={player.id} player={player} />
            ))}
          </div>
        )}
      </div>

      {/* Inactive Players */}
      {inactivePlayers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Inactive Players ({inactivePlayers.length})
          </h3>
          <div className="bg-gray-50 rounded-lg border border-gray-200">
            {inactivePlayers.map(player => (
              <PlayerRow key={player.id} player={player} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
