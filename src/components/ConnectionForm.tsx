import { useState, useEffect } from 'react'
import type { PlayerRole } from '../types/poker'
import { getCachedPlayerName, getCachedPlayerRole, setCachedPlayerName, setCachedPlayerRole } from '../utils/storage'

interface ConnectionFormProps {
  onConnect: (roomCode: string, playerName: string, playerRole: PlayerRole) => void
  onCreateRoom: (playerName: string, playerRole: PlayerRole) => void
}

export function ConnectionForm({ onConnect, onCreateRoom }: ConnectionFormProps) {
  const [roomCode, setRoomCode] = useState('')
  const [playerName, setPlayerName] = useState(() => getCachedPlayerName())
  const [playerRole, setPlayerRole] = useState<PlayerRole>(() => getCachedPlayerRole())

  useEffect(() => {
    if (playerName.trim()) {
      setCachedPlayerName(playerName)
    }
  }, [playerName])

  useEffect(() => {
    setCachedPlayerRole(playerRole)
  }, [playerRole])

  const handleConnect = () => {
    if (roomCode.trim()) {
      const trimmedName = playerName.trim()
      if (trimmedName) {
        setCachedPlayerName(trimmedName)
      }
      setCachedPlayerRole(playerRole)
      onConnect(roomCode.trim().toUpperCase(), trimmedName, playerRole)
    }
  }

  const handleCreateRoom = () => {
    const trimmedName = playerName.trim()
    if (trimmedName) {
      setCachedPlayerName(trimmedName)
    }
    setCachedPlayerRole(playerRole)
    onCreateRoom(trimmedName, playerRole)
  }

  return (
    <>
      <div className="text-center mb-4 sm:mb-3 xs:mb-2">
        <div className="text-5xl mb-2 animate-float inline-block sm:text-4xl xs:text-3xl">🎴</div>
        <h1 className="text-lg font-bold text-win98-blue mb-1 sm:text-base xs:text-sm">Bem-vindo ao Scrum Poker 98™</h1>
        <p className="text-[10px] text-win98-dark-gray sm:text-[9px] xs:text-[8px]">Planning Poker com estilo retrô!</p>
      </div>

      <div className="h-0.5 bg-win98-dark-gray border-t border-win98-white my-2 shrink-0 sm:my-1.5 xs:my-1"></div>

      <div className="mb-4 shrink-0 sm:mb-3 xs:mb-2.5">
        <div className="text-[11px] font-bold mb-2 text-black sm:text-[10px] sm:mb-1.5 xs:text-[9px]">
          <span className="mr-1">👤</span>Seu nome:
        </div>
        
        <div className="mt-2">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleConnect()}
            className="bg-win98-white border-2 border-win98-dark-gray border-r-win98-white border-b-win98-white px-2 py-1 text-sm font-bold w-full box-border font-win98 focus:outline-none focus:border-win98-blue focus:bg-[#ffffe1] sm:text-xs sm:px-1.5 sm:py-0.5 xs:text-xs xs:px-1.5 xs:py-0.5 touch-friendly transition-colors"
            style={{ textTransform: 'none', letterSpacing: 'normal' }}
            placeholder="Digite seu nome"
            maxLength={20}
          />
        </div>
      </div>

      <div className="h-0.5 bg-win98-dark-gray border-t border-win98-white my-2 shrink-0 sm:my-1.5 xs:my-1"></div>

      <div className="mb-4 shrink-0 sm:mb-3 xs:mb-2.5">
        <div className="text-[11px] font-bold mb-2 text-black sm:text-[10px] sm:mb-1.5 xs:text-[9px]">
          <span className="mr-1">💼</span>Sua função:
        </div>
        
        <div className="mt-2">
          <select
            value={playerRole}
            onChange={(e) => setPlayerRole(e.target.value as PlayerRole)}
            className="bg-win98-white border-2 border-win98-dark-gray border-r-win98-white border-b-win98-white px-2 py-1 text-sm font-bold w-full box-border font-win98 focus:outline-none focus:border-win98-blue focus:bg-[#ffffe1] sm:text-xs sm:px-1.5 sm:py-0.5 xs:text-xs xs:px-1.5 xs:py-0.5 touch-friendly transition-colors cursor-pointer"
          >
            <option value="frontend">💻 Frontend</option>
            <option value="backend">⚙️ Backend</option>
            <option value="fullstack">🚀 Fullstack</option>
            <option value="designer">🎨 Designer</option>
            <option value="product">📊 Product</option>
            <option value="qa">🔍 QA</option>
            <option value="other">👤 Outro</option>
          </select>
        </div>
      </div>

      <div className="h-0.5 bg-win98-dark-gray border-t border-win98-white my-2 shrink-0 sm:my-1.5 xs:my-1"></div>

      <div className="mb-4 shrink-0 sm:mb-3 xs:mb-2.5">
        <div className="text-[11px] font-bold mb-2 text-black sm:text-[10px] sm:mb-1.5 xs:text-[9px]">
          <span className="mr-1">🔑</span>Digite o código da sala:
        </div>
        
        <div className="mt-2">
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleConnect()}
            className="bg-win98-white border-2 border-win98-dark-gray border-r-win98-white border-b-win98-white px-2 py-1 text-sm font-bold w-full box-border font-win98 tracking-wider uppercase focus:outline-none focus:border-win98-blue focus:bg-[#ffffe1] placeholder:text-win98-dark-gray placeholder:font-normal placeholder:tracking-normal placeholder:normal-case sm:text-xs sm:px-1.5 sm:py-0.5 xs:text-xs xs:px-1.5 xs:py-0.5 touch-friendly transition-colors"
            placeholder="Ex: ABC123"
            maxLength={10}
          />
        </div>
      </div>

      <div className="h-0.5 bg-win98-dark-gray border-t border-win98-white my-2 shrink-0 sm:my-1.5 xs:my-1"></div>

      <div className="flex gap-2 flex-wrap shrink-0 sm:gap-1.5 xs:gap-1">
        <button 
          className="bg-win98-gray border-2 border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray px-3 py-1 text-[11px] font-bold cursor-pointer min-w-[75px] h-[23px] relative active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white active:translate-x-px active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:border-win98-white disabled:active:border-r-win98-dark-gray disabled:active:border-b-win98-dark-gray sm:text-[10px] sm:px-2.5 sm:py-0.5 sm:h-[21px] sm:w-full sm:min-w-0 xs:text-[9px] xs:px-2 xs:py-0.5 xs:h-5 hover:bg-win98-light-gray transition-colors flex-1 touch-friendly"
          onClick={handleConnect}
          disabled={!roomCode.trim()}
          title="Entrar em uma sala existente"
        >
          🚪 Conectar
        </button>
        <button 
          className="bg-win98-gray border-2 border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray px-3 py-1 text-[11px] font-bold cursor-pointer min-w-[75px] h-[23px] relative active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white active:translate-x-px active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:border-win98-white disabled:active:border-r-win98-dark-gray disabled:active:border-b-win98-dark-gray sm:text-[10px] sm:px-2.5 sm:py-0.5 sm:h-[21px] sm:w-full sm:min-w-0 xs:text-[9px] xs:px-2 xs:py-0.5 xs:h-5 hover:bg-win98-light-gray transition-colors flex-1 touch-friendly"
          onClick={handleCreateRoom}
          title="Criar uma nova sala"
        >
          ✨ Criar Nova Sala
        </button>
      </div>

      <div className="h-0.5 bg-win98-dark-gray border-t border-win98-white my-2 shrink-0 sm:my-1.5 xs:my-1"></div>

      <div className="bg-win98-white border-2 border-win98-dark-gray border-r-win98-white border-b-win98-white p-3 mt-2 sm:p-2.5">
        <div className="text-[11px] font-bold mb-2 text-black sm:text-[10px] xs:text-[9px]">
          <span className="mr-1">📖</span>Como funciona:
        </div>
        <ul className="m-2 mt-2 pl-5 text-[11px] leading-relaxed sm:text-[10px] sm:pl-4 xs:text-[9px] list-disc">
          <li className="mb-1">Digite o código da sala fornecido pelo organizador</li>
          <li className="mb-1">Ou clique em "Criar Nova Sala" para iniciar uma nova sessão</li>
          <li className="mb-1">Compartilhe o código com sua equipe</li>
          <li className="mb-1 text-win98-dark-gray italic">Dica: Procure por easter eggs escondidos! 🥚</li>
        </ul>
      </div>
    </>
  )
}
