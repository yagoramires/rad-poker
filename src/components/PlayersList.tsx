import { useState } from 'react'
import type { Player } from '../types/poker'
import type { PlayerRole } from '../types/poker'

interface PlayersListProps {
  players: Player[]
  myPeerId: string | null
  myPlayerRole?: PlayerRole
  votesRevealed: boolean
}

const roleLabels: Record<PlayerRole | string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  fullstack: 'Fullstack',
  designer: 'Designer',
  product: 'Product',
  qa: 'QA',
  other: 'Outro'
}

function getRoleEmoji(role: string) {
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

function getVoteEmoji(vote: string | number) {
  const v = String(vote)
  if (v === '1' || v === '2') return '🟢'
  if (v === '3' || v === '5') return '🟡'
  if (v === '8' || v === '13') return '🟠'
  if (v === '21' || v === '34') return '🔴'
  if (v === '?') return '❓'
  if (v === '☕') return '☕'
  return '🎴'
}

export function PlayersList({ players, myPeerId, myPlayerRole, votesRevealed }: PlayersListProps) {
  const [showOnlyMyRole, setShowOnlyMyRole] = useState(false)

  const filteredPlayers = showOnlyMyRole && myPlayerRole
    ? players.filter(player => (player.role || 'other') === myPlayerRole)
    : players

  const playersByRole: Record<string, typeof filteredPlayers> = {}
  filteredPlayers.forEach(player => {
    const role = player.role || 'other'
    if (!playersByRole[role]) {
      playersByRole[role] = []
    }
    playersByRole[role].push(player)
  })

  const allPlayersVoted = players.length > 0 && players.every(p => p.hasVoted)

  return (
    <>
      <div className="h-0.5 bg-win98-dark-gray border-t border-win98-white my-2 shrink-0 sm:my-1.5 xs:my-1"></div>
      <div className="mb-4 shrink-0 sm:mb-3 xs:mb-2.5">
        <div className="text-[11px] font-bold mb-2 text-black flex justify-between items-center flex-wrap gap-2 sm:text-[10px] sm:mb-1.5 xs:text-[9px]">
          <span><span className="mr-1">👥</span>Jogadores Conectados:</span>
          <div className="flex items-center gap-2">
            {allPlayersVoted && !votesRevealed && (
              <span className="text-green-700 text-[10px] sm:text-[9px] xs:text-[8px] animate-bounce-in bg-green-100 px-2 py-0.5 rounded border border-green-700">
                ✓ Todos votaram!
              </span>
            )}
            {myPlayerRole && (
              <button
                onClick={() => setShowOnlyMyRole(!showOnlyMyRole)}
                className={`bg-win98-gray border-2 px-2 py-0.5 text-[10px] font-bold cursor-pointer h-[20px] relative active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white active:translate-x-px active:translate-y-px hover:bg-win98-light-gray transition-colors touch-friendly sm:text-[9px] xs:text-[8px] xs:px-1.5 xs:py-0.5 xs:h-[18px] ${
                  showOnlyMyRole 
                    ? 'border-win98-dark-gray border-r-win98-white border-b-win98-white bg-[#ffffe1]' 
                    : 'border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray'
                }`}
                title={showOnlyMyRole ? 'Mostrar todos os jogadores' : 'Mostrar apenas minha função'}
              >
                {showOnlyMyRole ? '👥 Todos' : `🎯 ${getRoleEmoji(myPlayerRole)}`}
              </button>
            )}
          </div>
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
                        {isMe && <span className="text-[10px] bg-win98-blue text-white px-1 rounded">VOCÊ</span>}
                      </span>
                      <span className="text-base font-bold text-win98-blue sm:text-sm xs:text-xs">
                        {votesRevealed 
                          ? (
                            <span className="flex items-center gap-1">
                              {player.vote !== null && player.vote !== undefined ? (
                                String(player.vote) === '☕' ? (
                                  <span>☕</span>
                                ) : (
                                  <>
                                    {getVoteEmoji(player.vote)}
                                    <span>{String(player.vote)}</span>
                                  </>
                                )
                              ) : (
                                <span>-</span>
                              )}
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
    </>
  )
}
