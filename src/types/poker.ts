export type PokerCard = number | '?' | '☕'

export type PlayerRole = 'frontend' | 'backend' | 'fullstack' | 'designer' | 'product' | 'qa' | 'other'

export interface Player {
  id: string
  name: string
  role?: PlayerRole
  vote?: number | null
  hasVoted?: boolean
}

export interface WSMessage {
  type: string
  dst?: string
  src?: string
  payload?: unknown
}

export interface JoinRoomPayload {
  roomId: string
  name: string
  role?: PlayerRole
}

export interface VotePayload {
  roomId: string
  vote: number | string
}

export interface RoomStatePayload {
  roomId: string
  players: Player[]
  currentTask: string
  votesRevealed: boolean
}

export interface PlayerJoinedPayload {
  roomId: string
  player: Player
}

export interface PlayerLeftPayload {
  roomId: string
  playerId: string
}

export interface VoteReceivedPayload {
  roomId: string
  playerId: string
  hasVoted: boolean
}

export interface VotesRevealedPayload {
  roomId: string
  votes: Record<string, number | string>
}

export interface NewTaskPayload {
  roomId: string
  task: string
}

export interface PokerSessionState {
  roomCode: string
  myPeerId: string
  myPlayerName: string
  myPlayerRole?: PlayerRole
  players: Player[]
  currentTask: string
  isConnected: boolean
  votesRevealed: boolean
  myVote: number | string | null
  error: string | null
  connectionError: string | null
}
