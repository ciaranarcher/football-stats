import { NextRequest, NextResponse } from 'next/server';
import { getAllTeams, createTeam } from '@/lib/db/teams';

/**
 * GET /api/teams - List all teams
 */
export async function GET() {
  try {
    const teams = await getAllTeams();
    return NextResponse.json({ teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/teams - Create new team
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, division } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!division || typeof division !== 'string' || division.trim().length === 0) {
      return NextResponse.json(
        { error: 'Division is required' },
        { status: 400 }
      );
    }

    const team = await createTeam({
      name: name.trim(),
      division: division.trim(),
    });

    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    );
  }
}
