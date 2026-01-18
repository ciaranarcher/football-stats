import { NextRequest, NextResponse } from 'next/server';
import { getMatchesByTeamId, createMatch } from '@/lib/db/matches';

/**
 * GET /api/matches?teamId=xxx - List matches for a team
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json(
        { error: 'teamId parameter is required' },
        { status: 400 }
      );
    }

    const matches = await getMatchesByTeamId(teamId);
    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/matches - Create new match
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamId, opponent, date, competition, notes, ourScore, opponentScore, goals } = body;

    // Validation
    if (!teamId || typeof teamId !== 'string') {
      return NextResponse.json(
        { error: 'teamId is required' },
        { status: 400 }
      );
    }

    if (!opponent || typeof opponent !== 'string' || opponent.trim().length === 0) {
      return NextResponse.json(
        { error: 'opponent is required' },
        { status: 400 }
      );
    }

    if (!date || typeof date !== 'string') {
      return NextResponse.json(
        { error: 'date is required' },
        { status: 400 }
      );
    }

    // Validate goals array if provided
    if (goals && !Array.isArray(goals)) {
      return NextResponse.json(
        { error: 'goals must be an array' },
        { status: 400 }
      );
    }

    const match = await createMatch({
      teamId,
      opponent: opponent.trim(),
      date,
      competition: competition?.trim() || undefined,
      notes: notes?.trim() || undefined,
      ourScore: ourScore !== undefined ? Number(ourScore) : undefined,
      opponentScore: opponentScore !== undefined ? Number(opponentScore) : undefined,
      goals: goals || [],
    });

    return NextResponse.json({ match }, { status: 201 });
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    );
  }
}
