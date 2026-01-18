'use client';

import { useState } from 'react';
import { Player } from '@/lib/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface PlayerFormProps {
  teamId: string;
  player?: Player;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PlayerForm({ teamId, player, onSuccess, onCancel }: PlayerFormProps) {
  const [name, setName] = useState(player?.name || '');
  const [position, setPosition] = useState(player?.position || '');
  const [number, setNumber] = useState(player?.number?.toString() || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = player ? `/api/players/${player.id}` : '/api/players';
      const method = player ? 'PATCH' : 'POST';

      const body: any = { name };
      if (!player) {
        body.teamId = teamId;
      }
      if (position) body.position = position;
      if (number) body.number = parseInt(number, 10);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save player');
      }

      if (onSuccess) {
        onSuccess();
      }

      // Reset form if creating new player
      if (!player) {
        setName('');
        setPosition('');
        setNumber('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          id="name"
          label="Player Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Cristiano Ronaldo"
          required
        />

        <Input
          id="position"
          label="Position (Optional)"
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="e.g., Forward"
        />

        <Input
          id="number"
          label="Number (Optional)"
          type="number"
          min="0"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="e.g., 7"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : player ? 'Update Player' : 'Add Player'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
