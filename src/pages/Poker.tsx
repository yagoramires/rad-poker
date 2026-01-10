import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { usePokerSession } from '../hooks/usePokerSession'
import { useToast } from '../hooks/useToast'
import { ToastContainer } from '../components/Toast'
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

  const playersByRole = useMemo(() => {
    const grouped: Record<string, typeof players> = {}
    players.forEach(player => {
      const role = player.role || 'other'
      if (!grouped[role]) {
        grouped[role] = []
      }
      grouped[role].push(player)
    })
    return grouped
  }, [players])

  const roleLabels: Record<PlayerRole | string, string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    fullstack: 'Fullstack',
    designer: 'Designer',
    product: 'Product',
    qa: 'QA',
    other: 'Outro'
  }

  const getRoleEmoji = (role: string) => {
    const emojis: Record<string, string> = {
      frontend: '💻',
      backend: '⚙️',
      fullstack: '🚀',
      designer: '🎨',
      product: '📊',
      qa: '🔍',
      other: '👤'
    }
    return emojis[role] || '👤'
  }

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

  const getVoteEmoji = (vote: string | number) => {
    const v = String(vote)
    if (v === '1' || v === '2') return '🟢'
    if (v === '3' || v === '5') return '🟡'
    if (v === '8' || v === '13') return '🟠'
    if (v === '21' || v === '34') return '🔴'
    if (v === '?') return '❓'
    if (v === '☕') return '☕'
    return '🎴'
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="flex justify-center items-start w-full p-5 bg-transparent min-h-[calc(100dvh-30px)] box-border sm:p-2.5 sm:pb-[30px] sm:min-h-[calc(100dvh-25px)] xs:p-1.5 xs:pb-6 xs:pt-12 xs:min-h-[calc(100dvh-20px)]">
        <div className={`bg-win98-gray border-2 border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray shadow-win98 min-w-[320px] max-w-[900px] w-full max-h-[calc(100dvh-40px)] flex flex-col overflow-hidden sm:max-h-[calc(100dvh-30px)] xs:max-h-[calc(100dvh-25px)] lg:max-w-[1000px] relative z-1 ${shakeWindow ? 'animate-shake' : ''}`}>
          <div className="bg-linear-to-r from-win98-blue to-win98-light-blue text-white px-1 py-0.5 flex justify-between items-center text-[11px] font-bold h-[18px] min-h-[18px] sm:text-[10px] sm:px-0.5 sm:py-0.5 sm:shrink-0 xs:text-[9px] xs:h-4 xs:min-h-4">
            <div 
              className="flex items-center gap-1 sm:gap-0.5 sm:overflow-hidden cursor-pointer select-none"
              onClick={handleTitleClick}
              title="Clique aqui algumas vezes... 😉"
            >
              <span className="text-sm sm:text-xs">🎴</span>
              <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0 flex items-center" title="Scrum Poker - Planning Session">
                <span className="overflow-hidden text-ellipsis whitespace-nowrap sm:text-[0.9em] xs:text-[0.8em]">Scrum Poker - Planning Session</span>
              </span>
            </div>
            <div className="flex gap-0.5">
              <button 
                className="bg-win98-gray border border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray w-4 h-3.5 text-[10px] cursor-pointer flex items-center justify-center p-0 leading-none active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white xs:w-3.5 xs:h-3 xs:text-[9px] hover:bg-win98-light-gray"
                title="Minimizar"
              >_</button>
              <button 
                className="bg-win98-gray border border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray w-4 h-3.5 text-[10px] cursor-pointer flex items-center justify-center p-0 leading-none active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white xs:w-3.5 xs:h-3 xs:text-[9px] hover:bg-win98-light-gray"
                title="Maximizar"
              >□</button>
              <button 
                className="bg-win98-gray border border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray w-4 h-3.5 text-[10px] cursor-pointer flex items-center justify-center p-0 leading-none active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white xs:w-3.5 xs:h-3 xs:text-[9px] hover:bg-red-500" 
                onClick={() => navigate('/')}
                title="Fechar"
              >×</button>
            </div>
          </div>

          <div className="bg-win98-gray p-2 border border-win98-dark-gray border-r-win98-white border-b-win98-white m-0.5 overflow-x-hidden overflow-y-auto flex-1 min-h-0 max-h-[calc(100dvh-80px)] scrollbar-thin scrollbar-thumb-win98-dark-gray scrollbar-track-win98-gray sm:max-h-[calc(100dvh-70px)] sm:p-1.5 xs:max-h-[calc(100dvh-65px)] xs:p-1">
            <div className="mb-4 shrink-0 sm:mb-3 xs:mb-2.5">
              <div className="text-[11px] font-bold mb-2 text-black flex flex-wrap gap-2 items-center sm:flex-col sm:items-start sm:gap-1 xs:text-[9px]">
                <div className="flex items-center gap-1.5 whitespace-nowrap flex-wrap">
                  <span className="flex items-center gap-1">
                    Sala: <span className="font-mono bg-win98-white px-1 border border-win98-dark-gray">{roomCode}</span>
                    {isConnected ? <span className="animate-pulse-slow">🟢</span> : '🔴'}
                  </span>
                  <button
                    onClick={copyRoomCode}
                    className="bg-win98-gray border border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray px-1.5 py-0.5 text-[10px] font-bold cursor-pointer active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white active:translate-x-px active:translate-y-px hover:bg-win98-light-gray transition-colors touch-friendly"
                    title="Copiar código da sala"
                  >
                    📋 Copiar
                  </button>
                </div>
                <span className="whitespace-nowrap bg-win98-light-blue text-white px-2 py-0.5 rounded-sm text-[10px]">👤 {myPlayerName}</span>
              </div>
            </div>

            {connectionError && (
              <>
                <div className="h-0.5 bg-win98-dark-gray border-t border-win98-white my-2 shrink-0 sm:my-1.5 xs:my-1"></div>
                <div className="bg-[#ffcccc] border-2 border-[#aa0000] p-2 my-2 text-[11px] text-[#aa0000] font-bold wrap-break-words">
                  {connectionError}
                </div>
              </>
            )}

            {currentTask && (
              <>
                <div className="h-0.5 bg-win98-dark-gray border-t border-win98-white my-2 shrink-0 sm:my-1.5 xs:my-1"></div>
                <div className="mb-4 shrink-0 sm:mb-3 xs:mb-2.5">
                  <div className="text-[11px] font-bold mb-2 text-black sm:text-[10px] sm:mb-1.5 xs:text-[9px]">Tarefa Atual:</div>
                  <div className="bg-win98-white border-2 border-win98-dark-gray border-r-win98-white border-b-win98-white p-2 text-[11px] sm:p-1.5 sm:text-[10px] xs:p-1 xs:text-[9px]">
                    {currentTask}
                  </div>
                </div>
              </>
            )}

            <div className="h-0.5 bg-win98-dark-gray border-t border-win98-white my-2 shrink-0 sm:my-1.5 xs:my-1"></div>

            <div className="mb-4 shrink-0 sm:mb-3 xs:mb-2.5">
              <div className="text-[11px] font-bold mb-2 text-black sm:text-[10px] sm:mb-1.5 xs:text-[9px]">
                <span className="mr-2">🎯</span>Selecione sua estimativa:
              </div>
              
              <div className="grid gap-2 mt-2 sm:gap-1.5 sm:mt-1.5 xs:gap-1 xs:mt-1 poker-cards-grid">
                {pokerCards.map((card, index) => {
                  const isSelected = myVoteIndex === index
                  const isDisabled = votesRevealed
                  
                  return (
                    <button
                      key={index}
                      className={`bg-win98-gray border-2 cursor-pointer p-0 aspect-2/3 transition-all duration-100 relative active:translate-x-px active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 touch-friendly group ${
                        isSelected 
                          ? 'border-[#0000ff] border-r-[#0000ff] border-b-[#0000ff] bg-[#c0c0ff] shadow-[inset_2px_2px_0_#0000ff,inset_-2px_-2px_0_#8080ff] animate-bounce-in' 
                          : 'border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white hover:bg-win98-light-gray'
                      } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => !isDisabled && vote(index)}
                      disabled={isDisabled}
                      title={`Estimar ${card}`}
                    >
                      <div className={`w-full h-full flex flex-col items-center justify-center border m-0.5 ${
                        isSelected 
                          ? 'bg-[#e0e0ff] border-[#0000ff]' 
                          : 'bg-win98-white border-win98-black'
                      }`}>
                        <div className={`text-2xl font-bold sm:text-lg xs:text-base ${
                          isSelected ? 'text-[#0000ff] scale-110' : 'text-black group-hover:scale-105 transition-transform'
                        }`}>
                          {card}
                        </div>
                        {!isDisabled && !isSelected && (
                          <div className="text-[8px] text-win98-dark-gray mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {getVoteEmoji(card)}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="h-0.5 bg-win98-dark-gray border-t border-win98-white my-2 shrink-0 sm:my-1.5 xs:my-1"></div>

            <div className="mb-4 shrink-0 sm:mb-3 xs:mb-2.5">
              <div className="text-[11px] font-bold mb-2 text-black flex justify-between items-center sm:text-[10px] sm:mb-1.5 xs:text-[9px]">
                <span><span className="mr-1">👥</span>Jogadores Conectados:</span>
                {allPlayersVoted && !votesRevealed && (
                  <span className="text-green-700 text-[10px] sm:text-[9px] xs:text-[8px] animate-bounce-in bg-green-100 px-2 py-0.5 rounded border border-green-700">
                    ✓ Todos votaram!
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3 mt-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-win98-dark-gray scrollbar-track-win98-white sm:gap-2 sm:mt-1.5 sm:max-h-[200px] xs:gap-1.5 xs:mt-1 xs:max-h-[150px]">
                {Object.entries(playersByRole).map(([role, rolePlayers]) => (
                  <div key={role} className="bg-win98-white border-2 border-win98-dark-gray border-r-win98-white border-b-win98-white p-2 sm:p-1.5 xs:p-1 hover:shadow-sm transition-shadow">
                    <div className="text-[11px] font-bold mb-1.5 text-win98-blue sm:text-[10px] sm:mb-1 xs:text-[9px] flex items-center gap-1">
                      <span>{getRoleEmoji(role)}</span>
                      {roleLabels[role] || role} ({rolePlayers.length})
                    </div>
                    <div className="flex flex-col gap-1.5 sm:gap-1 xs:gap-0.5">
                      {rolePlayers.map((player) => {
                        const isMe = player.id === myPeerId
                        const displayName = player.name || `Jogador-${player.id.slice(0, 6)}`
                        
                        return (
                          <div key={player.id} className={`flex justify-between items-center bg-win98-light-gray border border-win98-dark-gray px-2 py-1 sm:px-1.5 sm:py-0.5 xs:px-1 xs:py-0.5 transition-all ${isMe ? 'bg-[#ffffe1] border-win98-blue' : ''}`}>
                            <span className="font-bold text-[11px] sm:text-[10px] xs:text-[9px] flex items-center gap-1">
                              {displayName}
                              {isMe && <span className="text-[9px] bg-win98-blue text-white px-1 rounded">VOCÊ</span>}
                            </span>
                            <span className="text-base font-bold text-win98-blue sm:text-sm xs:text-xs">
                              {votesRevealed 
                                ? (
                                  <span className="flex items-center gap-1">
                                    {player.vote !== null && player.vote !== undefined && getVoteEmoji(player.vote)}
                                    <span>{player.vote !== null && player.vote !== undefined ? String(player.vote) : '-'}</span>
                                  </span>
                                )
                                : (player.hasVoted ? <span className="animate-pulse-slow">✓</span> : '⏳')}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-0.5 bg-win98-dark-gray border-t border-win98-white my-2 shrink-0 sm:my-1.5 xs:my-1"></div>

            <div className="flex gap-2 flex-wrap shrink-0 sm:flex-col sm:gap-1.5 xs:gap-1">
              <button 
                className="bg-win98-gray border-2 border-win98-black border-r-win98-white border-b-win98-white px-3 py-1 text-[11px] font-bold cursor-pointer min-w-[75px] h-[23px] relative active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white active:translate-x-px active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:border-win98-white disabled:active:border-r-win98-dark-gray disabled:active:border-b-win98-dark-gray sm:text-[10px] sm:px-2.5 sm:py-0.5 sm:h-[21px] sm:w-full sm:min-w-0 xs:text-[9px] xs:px-2 xs:py-0.5 xs:h-5 hover:bg-win98-light-gray transition-colors flex-1 touch-friendly"
                onClick={revealVotes}
                disabled={!canReveal}
                title={!canReveal ? 'Vote primeiro ou aguarde revelação' : 'Mostrar todas as estimativas'}
              >
                🎭 Revelar Estimativas
              </button>
              <button 
                className="bg-win98-gray border-2 border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray px-3 py-1 text-[11px] font-bold cursor-pointer min-w-[75px] h-[23px] relative active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white active:translate-x-px active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:border-win98-white disabled:active:border-r-win98-dark-gray disabled:active:border-b-win98-dark-gray sm:text-[10px] sm:px-2.5 sm:py-0.5 sm:h-[21px] sm:w-full sm:min-w-0 xs:text-[9px] xs:px-2 xs:py-0.5 xs:h-5 hover:bg-win98-light-gray transition-colors flex-1 touch-friendly"
                onClick={clearVote}
                disabled={votesRevealed || myVote === null}
                title="Limpar seu voto atual"
              >
                🗑️ Limpar Seleção
              </button>
              <button 
                className="bg-win98-gray border-2 border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray px-3 py-1 text-[11px] font-bold cursor-pointer min-w-[75px] h-[23px] relative active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white active:translate-x-px active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:border-win98-white disabled:active:border-r-win98-dark-gray disabled:active:border-b-win98-dark-gray sm:text-[10px] sm:px-2.5 sm:py-0.5 sm:h-[21px] sm:w-full sm:min-w-0 xs:text-[9px] xs:px-2 xs:py-0.5 xs:h-5 hover:bg-win98-light-gray transition-colors flex-1 touch-friendly"
                onClick={resetVotes}
                disabled={!votesRevealed}
                title="Começar nova rodada de votação"
              >
                🔄 Nova Rodada
              </button>
            </div>
          </div>

          <div className="bg-win98-gray border-t border-win98-dark-gray px-1 py-0.5 flex justify-between text-[11px] h-[22px] items-center sm:text-[10px] sm:px-0.5 sm:py-0.5 sm:flex-wrap sm:min-h-0 sm:h-auto sm:shrink-0 xs:text-[9px] xs:px-0.5 xs:py-0.5">
            <div className="flex items-center sm:w-full sm:justify-between sm:m-0.5">
              <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
            </div>
            <div className="flex items-center sm:w-full sm:justify-between sm:m-0.5">
              <span>Jogadores: {players.length}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Poker
