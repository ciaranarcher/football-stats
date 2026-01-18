// Core entity types

export interface Team {
  id: string;              // UUID
  name: string;
  division: string;
  status: 'active' | 'inactive';
  createdAt: string;       // ISO 8601
  updatedAt: string;
}

export interface Player {
  id: string;              // UUID
  teamId: string;
  name: string;
  status: 'active' | 'inactive';
  position?: string;
  number?: number;
  createdAt: string;       // ISO 8601
  updatedAt: string;
}

export interface Match {
  id: string;              // UUID
  teamId: string;
  opponent: string;
  date: string;            // ISO 8601
  competition?: string;
  notes?: string;
  ourScore?: number;       // Manual override
  opponentScore?: number;  // Manual override
  goals: Goal[];           // Embedded goals
  createdAt: string;       // ISO 8601
  updatedAt: string;
}

export interface Goal {
  id: string;              // UUID
  matchId: string;
  teamId: string;
  playerId: string;
  minute?: number;
  type: 'NORMAL' | 'PENALTY';
}

// Extended types with computed fields

export interface MatchWithResult extends Match {
  result: 'win' | 'draw' | 'loss';
  calculatedOurScore: number;
  calculatedOpponentScore: number;
}

// Statistics types

export interface TeamStats {
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
  winPercentage: number;
  drawPercentage: number;
  lossPercentage: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface PlayerStats {
  playerId: string;
  playerName: string;
  totalGoals: number;
  normalGoals: number;
  penaltyGoals: number;
  matchesPlayed: number;
}

// Data collections

export interface TeamsData {
  teams: Team[];
}

export interface PlayersData {
  players: Player[];
}

export interface MatchesData {
  matches: Match[];
}
