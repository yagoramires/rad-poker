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
import { PlayerInfoDialog } from '../components/Dialog'
import type { PlayerRole } from '../types/poker'

function Poker() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const roomCode = searchParams.get('room') || 'DEFAULT'
  const playerName = searchParams.get('name') || ''
  const playerRole = (searchParams.get('role') as PlayerRole) || 'other'
  const { toasts, removeToast, success, error, info, warning } = useToast()
  const [shakeWindow, setShakeWindow] = useState(false)
  const [secretClicks, setSecretClicks] = useState(0)
  const [streamingMode, setStreamingMode] = useState(false)
  const hasNameParam = searchParams.has('name')
  const hasRoleParam = searchParams.has('role')
  const [showPlayerInfoDialog, setShowPlayerInfoDialog] = useState(() => !hasNameParam || !hasRoleParam)

  const handlePlayerInfoConfirm = (name: string, role: PlayerRole) => {
    setShowPlayerInfoDialog(false)
    const newParams = new URLSearchParams(searchParams)
    newParams.set('name', name)
    newParams.set('role', role)
    setSearchParams(newParams)
  }

  const effectivePlayerName = hasNameParam ? playerName : ''
  const effectivePlayerRole = hasRoleParam ? playerRole : 'other'
  const shouldConnect = hasNameParam && hasRoleParam && !showPlayerInfoDialog && effectivePlayerName.trim()

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
  } = usePokerSession(
    shouldConnect ? roomCode : '',
    shouldConnect ? effectivePlayerName : '',
    shouldConnect ? effectivePlayerRole : 'other'
  )

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
    const url = new URL(window.location.href)
    url.searchParams.delete('name')
    url.searchParams.delete('role')
    url.searchParams.set('room', roomCode)
    const linkToCopy = url.toString()

    try {
      await navigator.clipboard.writeText(linkToCopy)
      success('Link da sala copiado!')
    } catch {
      try {
        const textArea = document.createElement('textarea')
        textArea.value = linkToCopy
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        success('Link da sala copiado!')
      } catch {
        error('Erro ao copiar link da sala')
      }
    }
  }

  const allPlayersVoted = players.length > 0 && players.every(p => p.hasVoted)
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
      <PlayerInfoDialog
        isOpen={showPlayerInfoDialog}
        onConfirm={handlePlayerInfoConfirm}
      />
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
        headerActions={
          <button
            onClick={() => setStreamingMode(!streamingMode)}
            className={`bg-win98-gray border border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray px-1.5 py-0.5 text-[9px] cursor-pointer flex items-center justify-center leading-none active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white hover:bg-win98-light-gray transition-colors xs:px-1 xs:text-[8px] ${
              streamingMode ? 'bg-[#ffffe1] border-[#0000ff]' : ''
            }`}
            title={streamingMode ? 'Modo Streaming Ativo - Sua estimativa não será exibida até ser revelada' : 'Ativar Modo Streaming - Oculte sua estimativa'}
          >
            {streamingMode ? '📺' : '📹'}
          </button>
        }
      >
        <RoomInfo
          roomCode={roomCode}
          isConnected={isConnected}
          playerName={myPlayerName || effectivePlayerName || 'Jogador'}
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
          streamingMode={streamingMode}
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
          isHost={players.length > 0 && players[0]?.id === myPeerId}
        />
      </Window>
    </>
  )
}

export default Poker
