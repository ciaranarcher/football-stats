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
    console.log('[API /api/players POST] Received player creation request');

    const body = await request.json();
    console.log('[API /api/players POST] Request body:', body);

    const { teamId, name, position, number } = body;

    // Validation
    if (!teamId || typeof teamId !== 'string') {
      console.error('[API /api/players POST] Validation failed: teamId is required');
      return NextResponse.json(
        { error: 'teamId is required' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      console.error('[API /api/players POST] Validation failed: name is required');
      return NextResponse.json(
        { error: 'name is required' },
        { status: 400 }
      );
    }

    if (number !== undefined && (typeof number !== 'number' || number < 0)) {
      console.error('[API /api/players POST] Validation failed: invalid number');
      return NextResponse.json(
        { error: 'number must be a positive number' },
        { status: 400 }
      );
    }

    console.log('[API /api/players POST] Validation passed, creating player...');

    const player = await createPlayer({
      teamId,
      name: name.trim(),
      position: position?.trim() || undefined,
      number: number || undefined,
    });

    console.log('[API /api/players POST] Player created successfully:', player);

    return NextResponse.json({ player }, { status: 201 });
  } catch (error) {
    console.error('[API /api/players POST] Error creating player:', error);
    return NextResponse.json(
      { error: 'Failed to create player' },
      { status: 500 }
    );
  }
}
