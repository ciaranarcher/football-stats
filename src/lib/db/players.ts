import { Player, PlayersData } from '@/lib/types';
import { readData, writeData } from './storage';
import { generateId, getCurrentTimestamp } from '@/lib/utils';

const PLAYERS_FILE = 'players.json';

/**
 * Get all players
 */
export async function getAllPlayers(): Promise<Player[]> {
  const data = await readData<PlayersData>(PLAYERS_FILE, { players: [] });
  return data.players;
}

/**
 * Get players by team ID
 */
export async function getPlayersByTeamId(teamId: string): Promise<Player[]> {
  console.log('[players.ts getPlayersByTeamId] Looking for players with teamId:', teamId);

  const data = await readData<PlayersData>(PLAYERS_FILE, { players: [] });
  console.log('[players.ts getPlayersByTeamId] Total players in storage:', data.players.length);

  const teamPlayers = data.players.filter(p => p.teamId === teamId);
  console.log('[players.ts getPlayersByTeamId] Found', teamPlayers.length, 'players for team:', teamId);
  console.log('[players.ts getPlayersByTeamId] Player names:', teamPlayers.map(p => p.name));

  return teamPlayers;
}

/**
 * Get active players by team ID
 */
export async function getActivePlayersByTeamId(teamId: string): Promise<Player[]> {
  const players = await getPlayersByTeamId(teamId);
  return players.filter(p => p.status === 'active');
}

/**
 * Get player by ID
 */
export async function getPlayerById(id: string): Promise<Player | null> {
  const data = await readData<PlayersData>(PLAYERS_FILE, { players: [] });
  const player = data.players.find(p => p.id === id);
  return player || null;
}

/**
 * Create new player
 */
export async function createPlayer(
  input: Pick<Player, 'teamId' | 'name'> & Partial<Pick<Player, 'position' | 'number'>>
): Promise<Player> {
  console.log('[players.ts createPlayer] Starting player creation with input:', input);

  console.log('[players.ts createPlayer] Reading existing players data...');
  const data = await readData<PlayersData>(PLAYERS_FILE, { players: [] });
  console.log('[players.ts createPlayer] Current players count:', data.players.length);

  const newPlayer: Player = {
    id: generateId(),
    teamId: input.teamId,
    name: input.name,
    status: 'active',
    position: input.position,
    number: input.number,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  };

  console.log('[players.ts createPlayer] Generated new player:', newPlayer);

  data.players.push(newPlayer);
  console.log('[players.ts createPlayer] New players count:', data.players.length);

  console.log('[players.ts createPlayer] Writing players data...');
  await writeData(PLAYERS_FILE, data);
  console.log('[players.ts createPlayer] Write completed successfully');

  return newPlayer;
}

/**
 * Update player
 */
export async function updatePlayer(
  id: string,
  updates: Partial<Pick<Player, 'name' | 'status' | 'position' | 'number'>>
): Promise<Player | null> {
  const data = await readData<PlayersData>(PLAYERS_FILE, { players: [] });
  const playerIndex = data.players.findIndex(p => p.id === id);

  if (playerIndex === -1) {
    return null;
  }

  data.players[playerIndex] = {
    ...data.players[playerIndex],
    ...updates,
    updatedAt: getCurrentTimestamp(),
  };

  await writeData(PLAYERS_FILE, data);

  return data.players[playerIndex];
}

/**
 * Delete player (hard delete)
 * Note: According to plan, players should be soft deleted (set to inactive)
 * But keeping this for completeness
 */
export async function deletePlayer(id: string): Promise<boolean> {
  const data = await readData<PlayersData>(PLAYERS_FILE, { players: [] });
  const playerIndex = data.players.findIndex(p => p.id === id);

  if (playerIndex === -1) {
    return false;
  }

  data.players.splice(playerIndex, 1);
  await writeData(PLAYERS_FILE, data);

  return true;
}

/**
 * Deactivate player (soft delete)
 */
export async function deactivatePlayer(id: string): Promise<Player | null> {
  return updatePlayer(id, { status: 'inactive' });
}

/**
 * Reactivate player
 */
export async function reactivatePlayer(id: string): Promise<Player | null> {
  return updatePlayer(id, { status: 'active' });
}
