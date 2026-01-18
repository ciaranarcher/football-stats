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
  const data = await readData<TeamsData>(TEAMS_FILE, { teams: [] });
  const team = data.teams.find(t => t.id === id);
  return team || null;
}

/**
 * Create new team
 */
export async function createTeam(
  input: Pick<Team, 'name' | 'division'>
): Promise<Team> {
  const data = await readData<TeamsData>(TEAMS_FILE, { teams: [] });

  const newTeam: Team = {
    id: generateId(),
    name: input.name,
    division: input.division,
    status: 'active',
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  };

  data.teams.push(newTeam);
  await writeData(TEAMS_FILE, data);

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
