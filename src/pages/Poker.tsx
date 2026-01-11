import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { usePokerSession } from '../hooks/usePokerSession'
import { useToast } from '../hooks/useToast'
import { ToastContainer } from '../components/Toast'
import { Window } from '../components/Window'
import { RoomInfo } from '../components/RoomInfo'
import { CurrentTask } from '../components/CurrentTask'
import { PokerCards } from '../components/PokerCards'
import { PlayersList } from '../components/PlayersList'
import { ActionButtons } from '../components/ActionButtons'
import type { PlayerRole } from '../types/poker'

function Poker() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const roomCode = searchParams.get('room') || 'DEFAULT'
  const playerName = searchParams.get('name') || ''
  const playerRole = (searchParams.get('role') as PlayerRole) || 'other'
  const { toasts, removeToast, success, error, info, warning } = useToast()
  const [shakeWindow, setShakeWindow] = useState(false)
  const [secretClicks, setSecretClicks] = useState(0)

  const {
    myVote,
    isConnected,
    votesRevealed,
    players,
    pokerCards,
    vote,
    revealVotes,
    resetVotes,
    clearVote,
    myPlayerName,
    myPlayerRole,
    myPeerId,
    connectionError,
    error: sessionError,
    currentTask,
    setNotificationHandler
  } = usePokerSession(roomCode, playerName, playerRole)

  useEffect(() => {
    setNotificationHandler((msg: string, type: 'info' | 'success' | 'warning' | 'error') => {
      switch (type) {
        case 'success':
          success(msg)
          break
        case 'error':
          error(msg)
          break
        case 'warning':
          warning(msg)
          break
        default:
          info(msg)
      }
    })
  }, [setNotificationHandler, success, error, warning, info])

  useEffect(() => {
    if (connectionError) {
      error(connectionError)
    }
  }, [connectionError, error])

  useEffect(() => {
    if (sessionError) {
      warning(sessionError)
    }
  }, [sessionError, warning])

  const myVoteIndex = myVote !== null 
    ? pokerCards.findIndex(card => card === myVote)
    : null

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode)
      success('Código da sala copiado!')
    } catch {
      try {
        const textArea = document.createElement('textarea')
        textArea.value = roomCode
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        success('Código da sala copiado!')
      } catch {
        error('Erro ao copiar código da sala')
      }
    }
  }

  const canReveal = myVote !== null && !votesRevealed

  const handleTitleClick = () => {
    setSecretClicks(prev => prev + 1)
    if (secretClicks >= 6) {
      setShakeWindow(true)
      success('🎉 Você encontrou um easter egg! A janela está tremendo!')
      setTimeout(() => setShakeWindow(false), 500)
      setSecretClicks(0)
    }
  }


  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <Window
        title="Scrum Poker - Planning Session"
        icon="🎴"
        onTitleClick={handleTitleClick}
        titleHint="Clique aqui algumas vezes... 😉"
        onClose={() => navigate('/')}
        maxWidth="max-w-[900px] lg:max-w-[1000px]"
        className={shakeWindow ? 'animate-shake' : ''}
        footerLeft={<span>{isConnected ? 'Conectado' : 'Desconectado'}</span>}
        footerRight={<span>Jogadores: {players.length}</span>}
      >
        <RoomInfo
          roomCode={roomCode}
          isConnected={isConnected}
          playerName={myPlayerName}
          onCopyRoomCode={copyRoomCode}
        />

        {connectionError && (
          <>
            <div className="h-0.5 bg-win98-dark-gray border-t border-win98-white my-2 shrink-0 sm:my-1.5 xs:my-1"></div>
            <div className="bg-[#ffcccc] border-2 border-[#aa0000] p-2 my-2 text-[11px] text-[#aa0000] font-bold wrap-break-words">
              {connectionError}
            </div>
          </>
        )}

        {currentTask && <CurrentTask task={currentTask} />}

        <PokerCards
          cards={pokerCards}
          selectedIndex={myVoteIndex}
          votesRevealed={votesRevealed}
          onVote={vote}
        />

        <PlayersList
          players={players}
          myPeerId={myPeerId}
          myPlayerRole={myPlayerRole}
          votesRevealed={votesRevealed}
        />

        <ActionButtons
          canReveal={canReveal}
          votesRevealed={votesRevealed}
          hasVote={myVote !== null}
          onReveal={revealVotes}
          onClear={clearVote}
          onReset={resetVotes}
        />
      </Window>
    </>
  )
}

export default Poker
