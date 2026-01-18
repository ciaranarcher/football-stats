import { NextRequest, NextResponse } from 'next/server';
import { getPlayersByTeamId, createPlayer } from '@/lib/db/players';

/**
 * GET /api/players?teamId=xxx - List players for a team
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

    const players = await getPlayersByTeamId(teamId);
    return NextResponse.json({ players });
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/players - Create new player
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamId, name, position, number } = body;

    // Validation
    if (!teamId || typeof teamId !== 'string') {
      return NextResponse.json(
        { error: 'teamId is required' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'name is required' },
        { status: 400 }
      );
    }

    if (number !== undefined && (typeof number !== 'number' || number < 0)) {
      return NextResponse.json(
        { error: 'number must be a positive number' },
        { status: 400 }
      );
    }

    const player = await createPlayer({
      teamId,
      name: name.trim(),
      position: position?.trim() || undefined,
      number: number || undefined,
    });

    return NextResponse.json({ player }, { status: 201 });
  } catch (error) {
    console.error('Error creating player:', error);
    return NextResponse.json(
      { error: 'Failed to create player' },
      { status: 500 }
    );
  }
}
