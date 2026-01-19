'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Player, Goal } from '@/lib/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface MatchFormProps {
  teamId: string;
  players: Player[];
}

interface GoalInput {
  playerId: string;
  minute: string;
  type: 'NORMAL' | 'PENALTY';
}

export function MatchForm({ teamId, players }: MatchFormProps) {
  const router = useRouter();
  const [opponent, setOpponent] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState<'home' | 'away'>('home');
  const [competition, setCompetition] = useState('');
  const [notes, setNotes] = useState('');
  const [opponentScore, setOpponentScore] = useState('');
  const [goals, setGoals] = useState<GoalInput[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const activePlayers = players.filter(p => p.status === 'active');

  const addGoal = () => {
    setGoals([...goals, { playerId: '', minute: '', type: 'NORMAL' }]);
  };

  const updateGoal = (index: number, field: keyof GoalInput, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = { ...newGoals[index], [field]: value };
    setGoals(newGoals);
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate goals
      const validGoals = goals.filter(g => g.playerId);
      const formattedGoals = validGoals.map(g => ({
        playerId: g.playerId,
        minute: g.minute ? parseInt(g.minute, 10) : undefined,
        type: g.type,
      }));

      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamId,
          opponent,
          date,
          venue,
          competition: competition || undefined,
          notes: notes || undefined,
          opponentScore: opponentScore ? parseInt(opponentScore, 10) : undefined,
          goals: formattedGoals,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create match');
      }

      const { match } = await response.json();
      router.push(`/teams/${teamId}/matches/${match.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Match Details */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="opponent"
            label="Opponent"
            type="text"
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            placeholder="e.g., Arsenal FC"
            required
          />

          <Input
            id="date"
            label="Match Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <div>
            <label className="label" htmlFor="venue">
              Venue
            </label>
            <select
              id="venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value as 'home' | 'away')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="home">Home</option>
              <option value="away">Away</option>
            </select>
          </div>

          <Input
            id="competition"
            label="Competition (Optional)"
            type="text"
            value={competition}
            onChange={(e) => setCompetition(e.target.value)}
            placeholder="e.g., Premier League"
          />

          <Input
            id="opponentScore"
            label="Opponent Score"
            type="number"
            min="0"
            value={opponentScore}
            onChange={(e) => setOpponentScore(e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="mt-4">
          <label className="label" htmlFor="notes">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Match notes..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* Goals */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Goals</h3>
          <Button type="button" onClick={addGoal} variant="secondary" disabled={activePlayers.length === 0}>
            Add Goal
          </Button>
        </div>

        {activePlayers.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No active players. Add players to the team first.
          </p>
        ) : goals.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No goals yet. Click &quot;Add Goal&quot; to record a goal.
          </p>
        ) : (
          <div className="space-y-3">
            {goals.map((goal, index) => (
              <div key={index} className="flex gap-2 items-start">
                <select
                  value={goal.playerId}
                  onChange={(e) => updateGoal(index, 'playerId', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Player</option>
                  {activePlayers.map(player => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="0"
                  max="120"
                  value={goal.minute}
                  onChange={(e) => updateGoal(index, 'minute', e.target.value)}
                  placeholder="Min"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                  value={goal.type}
                  onChange={(e) => updateGoal(index, 'type', e.target.value as 'NORMAL' | 'PENALTY')}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="NORMAL">Normal</option>
                  <option value="PENALTY">Penalty</option>
                </select>

                <Button
                  type="button"
                  variant="danger"
                  onClick={() => removeGoal(index)}
                  className="px-3"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Match'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
