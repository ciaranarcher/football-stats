import { createPlayer, getPlayersByTeamId, getPlayerById, getAllPlayers } from '@/lib/db/players';
import { readData, writeData } from '@/lib/db/storage';
import { PlayersData } from '@/lib/types';

// Mock the storage functions
jest.mock('@/lib/db/storage', () => ({
  readData: jest.fn(),
  writeData: jest.fn(),
}));

const mockReadData = readData as jest.MockedFunction<typeof readData>;
const mockWriteData = writeData as jest.MockedFunction<typeof writeData>;

describe('Player Database Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPlayer', () => {
    it('should create a single player successfully', async () => {
      // Mock empty players data
      mockReadData.mockResolvedValue({ players: [] });
      mockWriteData.mockResolvedValue();

      const player = await createPlayer({
        teamId: 'team1',
        name: 'Player 1',
        position: 'Forward',
        number: 10,
      });

      expect(player).toMatchObject({
        teamId: 'team1',
        name: 'Player 1',
        status: 'active',
        position: 'Forward',
        number: 10,
      });

      expect(player.id).toBeDefined();
      expect(player.createdAt).toBeDefined();
      expect(player.updatedAt).toBeDefined();

      // Verify writeData was called with correct data
      expect(mockWriteData).toHaveBeenCalledTimes(1);
      expect(mockWriteData).toHaveBeenCalledWith('players.json', {
        players: [expect.objectContaining({ name: 'Player 1' })],
      });
    });

    it('should create multiple players successfully', async () => {
      // Start with empty data
      let currentData: PlayersData = { players: [] };

      // Mock readData to return current state
      mockReadData.mockImplementation(async () => ({ ...currentData }));

      // Mock writeData to update current state
      mockWriteData.mockImplementation(async (filename: string, data: PlayersData) => {
        currentData = data;
      });

      // Create first player
      const player1 = await createPlayer({
        teamId: 'team1',
        name: 'Player 1',
        position: 'Forward',
        number: 10,
      });

      expect(player1.name).toBe('Player 1');
      expect(mockWriteData).toHaveBeenCalledTimes(1);
      expect(currentData.players).toHaveLength(1);

      // Create second player
      const player2 = await createPlayer({
        teamId: 'team1',
        name: 'Player 2',
        position: 'Midfielder',
        number: 8,
      });

      expect(player2.name).toBe('Player 2');
      expect(mockWriteData).toHaveBeenCalledTimes(2);
      expect(currentData.players).toHaveLength(2);

      // Create third player
      const player3 = await createPlayer({
        teamId: 'team1',
        name: 'Player 3',
        position: 'Defender',
        number: 5,
      });

      expect(player3.name).toBe('Player 3');
      expect(mockWriteData).toHaveBeenCalledTimes(3);
      expect(currentData.players).toHaveLength(3);

      // Verify all players are stored
      expect(currentData.players.map(p => p.name)).toEqual(['Player 1', 'Player 2', 'Player 3']);
      expect(currentData.players.map(p => p.teamId)).toEqual(['team1', 'team1', 'team1']);
    });

    it('should create players for different teams', async () => {
      let currentData: PlayersData = { players: [] };

      mockReadData.mockImplementation(async () => ({ ...currentData }));
      mockWriteData.mockImplementation(async (filename: string, data: PlayersData) => {
        currentData = data;
      });

      // Create player for team1
      await createPlayer({
        teamId: 'team1',
        name: 'Team 1 Player',
      });

      // Create player for team2
      await createPlayer({
        teamId: 'team2',
        name: 'Team 2 Player',
      });

      expect(currentData.players).toHaveLength(2);
      expect(currentData.players[0].teamId).toBe('team1');
      expect(currentData.players[1].teamId).toBe('team2');
    });

    it('should handle players without optional fields', async () => {
      mockReadData.mockResolvedValue({ players: [] });
      mockWriteData.mockResolvedValue();

      const player = await createPlayer({
        teamId: 'team1',
        name: 'Player Without Details',
      });

      expect(player.name).toBe('Player Without Details');
      expect(player.position).toBeUndefined();
      expect(player.number).toBeUndefined();
      expect(player.status).toBe('active');
    });
  });

  describe('getPlayersByTeamId', () => {
    it('should return all players for a specific team', async () => {
      mockReadData.mockResolvedValue({
        players: [
          {
            id: 'p1',
            teamId: 'team1',
            name: 'Player 1',
            status: 'active',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            id: 'p2',
            teamId: 'team2',
            name: 'Player 2',
            status: 'active',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            id: 'p3',
            teamId: 'team1',
            name: 'Player 3',
            status: 'active',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        ],
      });

      const players = await getPlayersByTeamId('team1');

      expect(players).toHaveLength(2);
      expect(players.map(p => p.name)).toEqual(['Player 1', 'Player 3']);
    });

    it('should return empty array when team has no players', async () => {
      mockReadData.mockResolvedValue({ players: [] });

      const players = await getPlayersByTeamId('team1');

      expect(players).toHaveLength(0);
    });
  });

  describe('getPlayerById', () => {
    it('should return player by ID', async () => {
      mockReadData.mockResolvedValue({
        players: [
          {
            id: 'p1',
            teamId: 'team1',
            name: 'Player 1',
            status: 'active',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        ],
      });

      const player = await getPlayerById('p1');

      expect(player).not.toBeNull();
      expect(player?.name).toBe('Player 1');
    });

    it('should return null when player not found', async () => {
      mockReadData.mockResolvedValue({ players: [] });

      const player = await getPlayerById('nonexistent');

      expect(player).toBeNull();
    });
  });

  describe('getAllPlayers', () => {
    it('should return all players across all teams', async () => {
      mockReadData.mockResolvedValue({
        players: [
          {
            id: 'p1',
            teamId: 'team1',
            name: 'Player 1',
            status: 'active',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            id: 'p2',
            teamId: 'team2',
            name: 'Player 2',
            status: 'active',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        ],
      });

      const players = await getAllPlayers();

      expect(players).toHaveLength(2);
    });
  });
});
