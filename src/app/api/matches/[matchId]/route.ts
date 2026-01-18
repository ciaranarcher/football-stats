import { NextRequest, NextResponse } from 'next/server';
import { getMatchWithResultById, updateMatch, deleteMatch } from '@/lib/db/matches';

/**
 * GET /api/matches/[matchId] - Get match by ID with result
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  try {
    const match = await getMatchWithResultById(params.matchId);

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ match });
  } catch (error) {
    console.error('Error fetching match:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/matches/[matchId] - Update match
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  try {
    const body = await request.json();
    const { opponent, date, competition, notes, ourScore, opponentScore, goals } = body;

    const updates: any = {};

    if (opponent !== undefined) {
      if (typeof opponent !== 'string' || opponent.trim().length === 0) {
        return NextResponse.json(
          { error: 'opponent must be a non-empty string' },
          { status: 400 }
        );
      }
      updates.opponent = opponent.trim();
    }

    if (date !== undefined) {
      if (typeof date !== 'string') {
        return NextResponse.json(
          { error: 'date must be a string' },
          { status: 400 }
        );
      }
      updates.date = date;
    }

    if (competition !== undefined) {
      updates.competition = competition?.trim() || undefined;
    }

    if (notes !== undefined) {
      updates.notes = notes?.trim() || undefined;
    }

    if (ourScore !== undefined) {
      updates.ourScore = ourScore !== null ? Number(ourScore) : undefined;
    }

    if (opponentScore !== undefined) {
      updates.opponentScore = opponentScore !== null ? Number(opponentScore) : undefined;
    }

    if (goals !== undefined) {
      if (!Array.isArray(goals)) {
        return NextResponse.json(
          { error: 'goals must be an array' },
          { status: 400 }
        );
      }
      updates.goals = goals;
    }

    const match = await updateMatch(params.matchId, updates);

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ match });
  } catch (error) {
    console.error('Error updating match:', error);
    return NextResponse.json(
      { error: 'Failed to update match' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/matches/[matchId] - Delete match
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  try {
    const success = await deleteMatch(params.matchId);

    if (!success) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting match:', error);
    return NextResponse.json(
      { error: 'Failed to delete match' },
      { status: 500 }
    );
  }
}
