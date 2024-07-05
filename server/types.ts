export enum Role {
  Civilian = "civilian",
  Terrorist = "terrorist",
  Researcher = "researcher",
  Police = "police",
  Fanatic = "fanatic",
  Reporter = "reporter",
}

// Infection status
export enum Status {
  Infected = "infected",
  Healthy = "healthy",
}

export type Winner = Role.Civilian | Role.Terrorist;

export type Position = {
  x: number;
  y: number;
};

export type PlayerID = string;

export interface Player {
  id: PlayerID;
  role: Role;
  hasAntibodies: boolean;
  numOfAntidotes: number;
  remainingTests: number;
  takenAntidote: boolean;
  numOfBullets: number;
  position: Position;
  colour: string;
}

export type GameID = string;

export interface Game {
  players: {
    [playerId: PlayerID]: Player;
  };
  playerIndices: PlayerID[];
  infected: { [playerId: PlayerID]: { roundInfected: number } };
  dead: PlayerID[];
  round: number;
  started: boolean;
  timeRoundStarted: number; // Unix timestamp (milliseconds since epoch)
}

export interface GameState {
  [gameId: GameID]: Game;
}

export interface GameOver {
  winner: Winner;
  lastVictimId?: GameID;
  gamePlayers: { [playerId: PlayerID]: Player };
}

// Define an interface for the socket to player mapping
export interface SocketToPlayerMapping {
  [socketId: string]: string; // socketId maps to playerId
}

// Define an interface for the player to game mapping
export interface PlayerToGameMapping {
  [playerId: string]: string; // playerId maps to gameId
}
