import { NextRequest, NextResponse } from 'next/server';
import { getPlayerById, updatePlayer, deletePlayer } from '@/lib/db/players';

/**
 * GET /api/players/[playerId] - Get player by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { playerId: string } }
) {
  try {
    const player = await getPlayerById(params.playerId);

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ player });
  } catch (error) {
    console.error('Error fetching player:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/players/[playerId] - Update player
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { playerId: string } }
) {
  try {
    const body = await request.json();
    const { name, status, position, number } = body;

    const updates: any = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json(
          { error: 'name must be a non-empty string' },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    if (status !== undefined) {
      if (status !== 'active' && status !== 'inactive') {
        return NextResponse.json(
          { error: 'status must be either "active" or "inactive"' },
          { status: 400 }
        );
      }
      updates.status = status;
    }

    if (position !== undefined) {
      updates.position = position.trim() || undefined;
    }

    if (number !== undefined) {
      if (number !== null && (typeof number !== 'number' || number < 0)) {
        return NextResponse.json(
          { error: 'number must be a positive number or null' },
          { status: 400 }
        );
      }
      updates.number = number || undefined;
    }

    const player = await updatePlayer(params.playerId, updates);

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ player });
  } catch (error) {
    console.error('Error updating player:', error);
    return NextResponse.json(
      { error: 'Failed to update player' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/players/[playerId] - Delete player
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { playerId: string } }
) {
  try {
    const success = await deletePlayer(params.playerId);

    if (!success) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json(
      { error: 'Failed to delete player' },
      { status: 500 }
    );
  }
}
