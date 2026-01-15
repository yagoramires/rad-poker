import { useState, useEffect, useCallback, useRef } from 'react'
import { SignalingClient } from '../services/signaling'
import type { 
  PokerSessionState, 
  WSMessage, 
  RoomStatePayload, 
  PlayerJoinedPayload,
  PlayerLeftPayload,
  JoinRoomPayload,
  VotePayload,
  PlayerRole
} from '../types/poker'

const pokerCards = ['☕', 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?']

export function usePokerSession(roomCode: string, playerName: string = '', playerRole?: PlayerRole) {
  const [state, setState] = useState<PokerSessionState>({
    roomCode,
    myPeerId: '',
    myPlayerName: playerName || `Jogador-${Math.random().toString(36).substring(2, 6)}`,
    myPlayerRole: playerRole,
    players: [],
    hostId: null,
    currentTask: '',
    isConnected: false,
    votesRevealed: false,
    myVote: null,
    error: null,
    connectionError: null
  })

  const signalingClientRef = useRef<SignalingClient | null>(null)
  const notificationHandlerRef = useRef<((msg: string, type: 'info' | 'success' | 'warning' | 'error') => void) | null>(null)
  const stateRef = useRef(state)
  const hasJoinedRoomRef = useRef(false)
  stateRef.current = state

  useEffect(() => {
    if (playerName && playerName.trim()) {
      setState(prev => ({
        ...prev,
        myPlayerName: playerName.trim(),
        myPlayerRole: playerRole
      }))
    }
  }, [playerName, playerRole])

  const handleMessage = useCallback((message: WSMessage) => {
    switch (message.type) {
      case 'OPEN': {
        break
      }

      case 'ROOM_STATE': {
        const payload = message.payload as RoomStatePayload
        
        setState(prev => {
          const myPlayer = payload.players?.find(p => p.id === prev.myPeerId)
          const myVoteFromServer = myPlayer?.vote ?? null
          
          let finalVote = prev.myVote
          if (myVoteFromServer !== null) {
            finalVote = myVoteFromServer
          } else if (prev.myVote === null) {
            finalVote = null
          }
          
          return {
            ...prev,
            players: payload.players || [],
            hostId: payload.hostId || null,
            currentTask: payload.currentTask || '',
            votesRevealed: payload.votesRevealed || false,
            myVote: finalVote
          }
        })
        break
      }

      case 'PLAYER_JOINED': {
        const payload = message.payload as PlayerJoinedPayload
        
        notificationHandlerRef.current?.(`${payload.player.name} entrou na sala`, 'info')
        break
      }

      case 'PLAYER_LEFT': {
        const payload = message.payload as PlayerLeftPayload
        
        setState(prev => {
          const leavingPlayer = prev.players.find(p => p.id === payload.playerId)
          if (leavingPlayer) {
            notificationHandlerRef.current?.(`${leavingPlayer.name} saiu da sala`, 'warning')
          }
          return prev
        })
        break
      }

      case 'VOTE_RECEIVED': {
        break
      }

      case 'VOTES_REVEALED': {
        notificationHandlerRef.current?.('Estimativas reveladas!', 'success')
        break
      }

      case 'VOTES_RESET': {
        setState(prev => ({
          ...prev,
          myVote: null,
          votesRevealed: false
        }))
        
        notificationHandlerRef.current?.('Nova rodada iniciada', 'info')
        break
      }

      case 'NEW_TASK': {
        const payload = message.payload as { task: string }
        
        setState(prev => ({
          ...prev,
          currentTask: payload.task,
          myVote: null,
          votesRevealed: false
        }))
        
        notificationHandlerRef.current?.(`Nova tarefa: ${payload.task}`, 'info')
        break
      }

      case 'ERROR': {
        const payload = message.payload as { error: string }
        console.error('[POKER] Erro:', payload)
        
        setState(prev => ({
          ...prev,
          connectionError: payload.error
        }))
        break
      }
    }
  }, [])

  useEffect(() => {
    if (!roomCode || !playerName || !playerName.trim()) {
      return
    }

    if (signalingClientRef.current?.isConnected()) {
      return
    }

    const client = new SignalingClient()
    signalingClientRef.current = client

    client.on('*', handleMessage)

    client.connect()
      .then((peerId) => {
        setState(prev => ({
          ...prev,
          myPeerId: peerId,
          isConnected: true,
          connectionError: null,
          error: null
        }))

        if (!hasJoinedRoomRef.current) {
          hasJoinedRoomRef.current = true
          
          const joinMessage: WSMessage = {
            type: 'JOIN_ROOM',
            payload: {
              roomId: roomCode,
              name: playerName.trim(),
              role: playerRole
            } as JoinRoomPayload
          }
          
          client.sendMessage(joinMessage)
        }
      })
      .catch((error) => {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao conectar'
        console.error('[POKER] Erro ao conectar:', errorMessage)
        
        setState(prev => ({
          ...prev,
          connectionError: errorMessage,
          isConnected: false
        }))
        
        notificationHandlerRef.current?.(errorMessage, 'error')
      })

    return () => {
      hasJoinedRoomRef.current = false
      client.off('*', handleMessage)
      client.disconnect()
    }
  }, [roomCode, playerName, playerRole, handleMessage])

  const vote = useCallback((cardIndex: number) => {
    if (cardIndex < 0 || cardIndex >= pokerCards.length) {
      return
    }

    const card = pokerCards[cardIndex]
    const client = signalingClientRef.current
    
    if (!client || !client.isConnected()) {
      setState(prev => ({
        ...prev,
        error: 'Não conectado ao servidor'
      }))
      return
    }

    setState(prev => ({
      ...prev,
      myVote: card,
      error: null
    }))

    const voteMessage: WSMessage = {
      type: 'VOTE',
      payload: {
        roomId: roomCode,
        vote: card
      } as VotePayload
    }
    
    try {
      client.sendMessage(voteMessage)
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao enviar voto'
      }))
    }
  }, [roomCode])

  const revealVotes = useCallback(() => {
    const client = signalingClientRef.current
    
    if (!client || !client.isConnected()) {
      setState(prev => ({
        ...prev,
        error: 'Não conectado ao servidor'
      }))
      return
    }

    const revealMessage: WSMessage = {
      type: 'REVEAL_VOTES',
      payload: {
        roomId: roomCode
      }
    }
    
    try {
      client.sendMessage(revealMessage)
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao revelar votos'
      }))
    }
  }, [roomCode])

  const resetVotes = useCallback(() => {
    const client = signalingClientRef.current
    
    if (!client || !client.isConnected()) {
      setState(prev => ({
        ...prev,
        error: 'Não conectado ao servidor'
      }))
      return
    }

    setState(prev => ({
      ...prev,
      myVote: null,
      votesRevealed: false,
      error: null
    }))

    const resetMessage: WSMessage = {
      type: 'RESET_VOTES',
      payload: {
        roomId: roomCode
      }
    }
    
    try {
      client.sendMessage(resetMessage)
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao resetar votos'
      }))
    }
  }, [roomCode])

  const clearVote = useCallback(() => {
    const client = signalingClientRef.current
    
    if (!client || !client.isConnected()) {
      setState(prev => ({
        ...prev,
        error: 'Não conectado ao servidor'
      }))
      return
    }

    setState(prev => ({
      ...prev,
      myVote: null,
      error: null
    }))

    const clearVoteMessage: WSMessage = {
      type: 'CLEAR_VOTE',
      payload: {
        roomId: roomCode
      }
    }
    
    try {
      client.sendMessage(clearVoteMessage)
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao limpar voto'
      }))
    }
  }, [roomCode])

  const setTask = useCallback((task: string) => {
    const client = signalingClientRef.current
    
    if (!client || !client.isConnected()) {
      setState(prev => ({
        ...prev,
        error: 'Não conectado ao servidor'
      }))
      return
    }

    const taskMessage: WSMessage = {
      type: 'NEW_TASK',
      payload: {
        roomId: roomCode,
        task
      }
    }
    
    try {
      client.sendMessage(taskMessage)
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao definir tarefa'
      }))
    }
  }, [roomCode])

  return {
    ...state,
    vote,
    revealVotes,
    resetVotes,
    clearVote,
    setTask,
    pokerCards,
    setNotificationHandler: (handler: (msg: string, type: 'info' | 'success' | 'warning' | 'error') => void) => {
      notificationHandlerRef.current = handler
    }
  }
}
