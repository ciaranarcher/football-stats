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
    console.log('[API /api/teams POST] Received team creation request');

    const body = await request.json();
    console.log('[API /api/teams POST] Request body:', body);

    const { name, division } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      console.error('[API /api/teams POST] Validation failed: name is required');
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!division || typeof division !== 'string' || division.trim().length === 0) {
      console.error('[API /api/teams POST] Validation failed: division is required');
      return NextResponse.json(
        { error: 'Division is required' },
        { status: 400 }
      );
    }

    console.log('[API /api/teams POST] Validation passed, creating team...');

    const team = await createTeam({
      name: name.trim(),
      division: division.trim(),
    });

    console.log('[API /api/teams POST] Team created successfully:', team);
    console.log('[API /api/teams POST] Returning response with status 201');

    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    console.error('[API /api/teams POST] Error creating team:', error);
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    );
  }
}
