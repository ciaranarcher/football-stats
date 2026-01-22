import { Team, TeamsData } from '@/lib/types';
import { readData, writeData } from './storage';
import { generateId, getCurrentTimestamp } from '@/lib/utils';

const TEAMS_FILE = 'teams.json';

/**
 * Get all teams
 */
export async function getAllTeams(): Promise<Team[]> {
  const data = await readData<TeamsData>(TEAMS_FILE, { teams: [] });
  return data.teams;
}

/**
 * Get team by ID
 */
export async function getTeamById(id: string): Promise<Team | null> {
  console.log('[teams.ts getTeamById] Looking for team with id:', id);

  const data = await readData<TeamsData>(TEAMS_FILE, { teams: [] });
  console.log('[teams.ts getTeamById] Total teams in storage:', data.teams.length);
  console.log('[teams.ts getTeamById] Team IDs in storage:', data.teams.map(t => t.id));

  const team = data.teams.find(t => t.id === id);

  if (team) {
    console.log('[teams.ts getTeamById] Team found:', team);
  } else {
    console.log('[teams.ts getTeamById] Team NOT found with id:', id);
  }

  return team || null;
}

/**
 * Create new team
 */
export async function createTeam(
  input: Pick<Team, 'name' | 'division'>
): Promise<Team> {
  console.log('[teams.ts createTeam] Starting team creation with input:', input);

  console.log('[teams.ts createTeam] Reading existing teams data...');
  const data = await readData<TeamsData>(TEAMS_FILE, { teams: [] });
  console.log('[teams.ts createTeam] Current teams count:', data.teams.length);

  const newTeam: Team = {
    id: generateId(),
    name: input.name,
    division: input.division,
    status: 'active',
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  };

  console.log('[teams.ts createTeam] Generated new team:', newTeam);

  data.teams.push(newTeam);
  console.log('[teams.ts createTeam] New teams count:', data.teams.length);

  console.log('[teams.ts createTeam] Writing teams data...');
  await writeData(TEAMS_FILE, data);
  console.log('[teams.ts createTeam] Write completed successfully');

  return newTeam;
}

/**
 * Update team
 */
export async function updateTeam(
  id: string,
  updates: Partial<Pick<Team, 'name' | 'division' | 'status'>>
): Promise<Team | null> {
  const data = await readData<TeamsData>(TEAMS_FILE, { teams: [] });
  const teamIndex = data.teams.findIndex(t => t.id === id);

  if (teamIndex === -1) {
    return null;
  }

  data.teams[teamIndex] = {
    ...data.teams[teamIndex],
    ...updates,
    updatedAt: getCurrentTimestamp(),
  };

  await writeData(TEAMS_FILE, data);

  return data.teams[teamIndex];
}

/**
 * Delete team (hard delete)
 */
export async function deleteTeam(id: string): Promise<boolean> {
  const data = await readData<TeamsData>(TEAMS_FILE, { teams: [] });
  const teamIndex = data.teams.findIndex(t => t.id === id);

  if (teamIndex === -1) {
    return false;
  }

  data.teams.splice(teamIndex, 1);
  await writeData(TEAMS_FILE, data);

  return true;
}

/**
 * Get active teams only
 */
export async function getActiveTeams(): Promise<Team[]> {
  const teams = await getAllTeams();
  return teams.filter(t => t.status === 'active');
}
