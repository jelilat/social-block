import { Schema, ArraySchema, SetSchema, MapSchema } from '@colyseus/schema'

export enum Role {
  Civilian = 'civilian',
  Terrorist = 'terrorist',
  Researcher = 'researcher',
  Police = 'police',
  Fanatic = 'fanatic',
  Reporter = 'reporter',
}

export interface IPlayer extends Schema {
  name: string
  x: number
  y: number
  anim: string
  readyToConnect: boolean
  videoConnected: boolean
  role?: Role
  hasAntibodies?: boolean
  numOfAntidotes?: number
  remainingTests?: number
  takenAntidote?: boolean
  numOfBullets?: number
  isDead?: boolean
  isInfected?: boolean
  roundInfected?: number
  testKits?: number
}

export interface IComputer extends Schema {
  connectedUser: SetSchema<string>
}

export interface IWhiteboard extends Schema {
  roomId: string
  connectedUser: SetSchema<string>
}

export interface IChatMessage extends Schema {
  author: string
  createdAt: number
  content: string
}

export interface IOfficeState extends Schema {
  players: MapSchema<IPlayer>
  computers: MapSchema<IComputer>
  whiteboards: MapSchema<IWhiteboard>
  chatMessages: ArraySchema<IChatMessage>
  gameStarted: boolean
  round: number
  timeRoundStarted: number
  playerOrder: ArraySchema<string>
  deadPlayers: ArraySchema<string>
}
