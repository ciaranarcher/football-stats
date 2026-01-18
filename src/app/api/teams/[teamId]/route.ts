import { NextRequest, NextResponse } from 'next/server';
import { getTeamById, updateTeam, deleteTeam } from '@/lib/db/teams';

/**
 * GET /api/teams/[teamId] - Get team by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const team = await getTeamById(params.teamId);

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ team });
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/teams/[teamId] - Update team
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const body = await request.json();
    const { name, division, status } = body;

    const updates: any = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json(
          { error: 'Name must be a non-empty string' },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    if (division !== undefined) {
      if (typeof division !== 'string' || division.trim().length === 0) {
        return NextResponse.json(
          { error: 'Division must be a non-empty string' },
          { status: 400 }
        );
      }
      updates.division = division.trim();
    }

    if (status !== undefined) {
      if (status !== 'active' && status !== 'inactive') {
        return NextResponse.json(
          { error: 'Status must be either "active" or "inactive"' },
          { status: 400 }
        );
      }
      updates.status = status;
    }

    const team = await updateTeam(params.teamId, updates);

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ team });
  } catch (error) {
    console.error('Error updating team:', error);
    return NextResponse.json(
      { error: 'Failed to update team' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/teams/[teamId] - Delete team
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const success = await deleteTeam(params.teamId);

    if (!success) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting team:', error);
    return NextResponse.json(
      { error: 'Failed to delete team' },
      { status: 500 }
    );
  }
}
