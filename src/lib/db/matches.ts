import { Match, MatchWithResult, MatchesData, Goal } from '@/lib/types';
import { readData, writeData } from './storage';
import { generateId, getCurrentTimestamp } from '@/lib/utils';

const MATCHES_FILE = 'matches.json';

/**
 * Calculate match result from goals and scores
 */
export function calculateMatchResult(match: Match): MatchWithResult {
  const ourScore = match.ourScore ?? match.goals.length;
  const opponentScore = match.opponentScore ?? 0;

  let result: 'win' | 'draw' | 'loss';
  if (ourScore > opponentScore) result = 'win';
  else if (ourScore < opponentScore) result = 'loss';
  else result = 'draw';

  return {
    ...match,
    result,
    calculatedOurScore: ourScore,
    calculatedOpponentScore: opponentScore,
  };
}

/**
 * Get all matches
 */
export async function getAllMatches(): Promise<Match[]> {
  const data = await readData<MatchesData>(MATCHES_FILE, { matches: [] });
  return data.matches;
}

/**
 * Get matches by team ID
 */
export async function getMatchesByTeamId(teamId: string): Promise<Match[]> {
  const data = await readData<MatchesData>(MATCHES_FILE, { matches: [] });
  return data.matches
    .filter(m => m.teamId === teamId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get matches with results by team ID
 */
export async function getMatchesWithResultsByTeamId(teamId: string): Promise<MatchWithResult[]> {
  const matches = await getMatchesByTeamId(teamId);
  return matches.map(calculateMatchResult);
}

/**
 * Get match by ID
 */
export async function getMatchById(id: string): Promise<Match | null> {
  const data = await readData<MatchesData>(MATCHES_FILE, { matches: [] });
  const match = data.matches.find(m => m.id === id);
  return match || null;
}

/**
 * Get match with result by ID
 */
export async function getMatchWithResultById(id: string): Promise<MatchWithResult | null> {
  const match = await getMatchById(id);
  return match ? calculateMatchResult(match) : null;
}

/**
 * Create new match
 */
export async function createMatch(
  input: Pick<Match, 'teamId' | 'opponent' | 'date'> &
    Partial<Pick<Match, 'competition' | 'notes' | 'ourScore' | 'opponentScore'>> & {
      goals?: Omit<Goal, 'id' | 'matchId' | 'teamId'>[];
    }
): Promise<Match> {
  const data = await readData<MatchesData>(MATCHES_FILE, { matches: [] });

  const matchId = generateId();

  const newMatch: Match = {
    id: matchId,
    teamId: input.teamId,
    opponent: input.opponent,
    date: input.date,
    competition: input.competition,
    notes: input.notes,
    ourScore: input.ourScore,
    opponentScore: input.opponentScore,
    goals: (input.goals || []).map(goal => ({
      id: generateId(),
      matchId: matchId,
      teamId: input.teamId,
      playerId: goal.playerId,
      minute: goal.minute,
      type: goal.type,
    })),
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  };

  data.matches.push(newMatch);
  await writeData(MATCHES_FILE, data);

  return newMatch;
}

/**
 * Update match
 */
export async function updateMatch(
  id: string,
  updates: Partial<Pick<Match, 'opponent' | 'date' | 'competition' | 'notes' | 'ourScore' | 'opponentScore' | 'goals'>>
): Promise<Match | null> {
  const data = await readData<MatchesData>(MATCHES_FILE, { matches: [] });
  const matchIndex = data.matches.findIndex(m => m.id === id);

  if (matchIndex === -1) {
    return null;
  }

  data.matches[matchIndex] = {
    ...data.matches[matchIndex],
    ...updates,
    updatedAt: getCurrentTimestamp(),
  };

  await writeData(MATCHES_FILE, data);

  return data.matches[matchIndex];
}

/**
 * Delete match
 */
export async function deleteMatch(id: string): Promise<boolean> {
  const data = await readData<MatchesData>(MATCHES_FILE, { matches: [] });
  const matchIndex = data.matches.findIndex(m => m.id === id);

  if (matchIndex === -1) {
    return false;
  }

  data.matches.splice(matchIndex, 1);
  await writeData(MATCHES_FILE, data);

  return true;
}

/**
 * Add goal to match
 */
export async function addGoalToMatch(
  matchId: string,
  goal: Omit<Goal, 'id' | 'matchId' | 'teamId'>
): Promise<Match | null> {
  const data = await readData<MatchesData>(MATCHES_FILE, { matches: [] });
  const matchIndex = data.matches.findIndex(m => m.id === matchId);

  if (matchIndex === -1) {
    return null;
  }

  const match = data.matches[matchIndex];

  const newGoal: Goal = {
    id: generateId(),
    matchId: matchId,
    teamId: match.teamId,
    playerId: goal.playerId,
    minute: goal.minute,
    type: goal.type,
  };

  match.goals.push(newGoal);
  match.updatedAt = getCurrentTimestamp();

  await writeData(MATCHES_FILE, data);

  return match;
}

/**
 * Remove goal from match
 */
export async function removeGoalFromMatch(
  matchId: string,
  goalId: string
): Promise<Match | null> {
  const data = await readData<MatchesData>(MATCHES_FILE, { matches: [] });
  const matchIndex = data.matches.findIndex(m => m.id === matchId);

  if (matchIndex === -1) {
    return null;
  }

  const match = data.matches[matchIndex];
  const goalIndex = match.goals.findIndex(g => g.id === goalId);

  if (goalIndex === -1) {
    return null;
  }

  match.goals.splice(goalIndex, 1);
  match.updatedAt = getCurrentTimestamp();

  await writeData(MATCHES_FILE, data);

  return match;
}
