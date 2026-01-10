import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { PlayerRole } from '../types/poker'

function Home() {
  const [roomCode, setRoomCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [playerRole, setPlayerRole] = useState<PlayerRole>('other')
  const [logoClicks, setLogoClicks] = useState(0)
  const navigate = useNavigate()

  const handleConnect = () => {
    if (roomCode.trim()) {
      navigate(`/poker?room=${roomCode.trim().toUpperCase()}${playerName ? `&name=${encodeURIComponent(playerName.trim())}` : ''}${playerRole ? `&role=${playerRole}` : ''}`)
    }
  }

  const handleCreateRoom = () => {
    const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    navigate(`/poker?room=${newRoomCode}${playerName ? `&name=${encodeURIComponent(playerName.trim())}` : ''}${playerRole ? `&role=${playerRole}` : ''}`)
  }

  const handleLogoClick = () => {
    setLogoClicks(prev => prev + 1)
    if (logoClicks >= 9) {
      alert('🎉 Você encontrou o Easter Egg secreto! Você é persistente! 🏆\n\nDica: Experimente o código Konami no menu Iniciar...')
      setLogoClicks(0)
    }
  }

  return (
    <div className="flex justify-center items-start w-full p-5 bg-transparent min-h-[calc(100dvh-30px)] box-border sm:p-2.5 sm:pb-[30px] sm:min-h-[calc(100dvh-25px)] xs:p-1.5 xs:pb-6 xs:pt-12 xs:min-h-[calc(100dvh-20px)]">
      <div className="bg-win98-gray border-2 border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray shadow-win98 min-w-[320px] max-w-[500px] w-full max-h-[calc(100dvh-40px)] flex flex-col overflow-hidden sm:max-h-[calc(100dvh-30px)] xs:max-h-[calc(100dvh-25px)] window-maximize relative z-1">
        <div className="bg-linear-to-r from-win98-blue to-win98-light-blue text-white px-1 py-0.5 flex justify-between items-center text-[11px] font-bold h-[18px] min-h-[18px] sm:text-[10px] sm:px-0.5 sm:py-0.5 sm:shrink-0 xs:text-[9px] xs:h-4 xs:min-h-4">
          <div 
            className="flex items-center gap-1 sm:gap-0.5 sm:overflow-hidden cursor-pointer select-none"
            onClick={handleLogoClick}
            title="Clique aqui 10 vezes... 🤫"
          >
            <span className="text-sm sm:text-xs animate-float">🎴</span>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0 flex items-center" title="Scrum Poker - Conectar à Sala">
              <span className="overflow-hidden text-ellipsis whitespace-nowrap sm:text-[0.9em] xs:text-[0.8em]">Scrum Poker - Conectar à Sala</span>
            </span>
          </div>
          <div className="flex gap-0.5">
            <button className="bg-win98-gray border border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray w-4 h-3.5 text-[10px] cursor-pointer flex items-center justify-center p-0 leading-none active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white xs:w-3.5 xs:h-3 xs:text-[9px] hover:bg-win98-light-gray">_</button>
            <button className="bg-win98-gray border border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray w-4 h-3.5 text-[10px] cursor-pointer flex items-center justify-center p-0 leading-none active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white xs:w-3.5 xs:h-3 xs:text-[9px] hover:bg-win98-light-gray">□</button>
            <button className="bg-win98-gray border border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray w-4 h-3.5 text-[10px] cursor-pointer flex items-center justify-center p-0 leading-none active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white xs:w-3.5 xs:h-3 xs:text-[9px] hover:bg-red-500">×</button>
          </div>
        </div>

          <div className="bg-win98-gray p-2 border border-win98-dark-gray border-r-win98-white border-b-win98-white m-0.5 overflow-x-hidden overflow-y-auto flex-1 min-h-0 max-h-[calc(100dvh-80px)] scrollbar-thin scrollbar-thumb-win98-dark-gray scrollbar-track-win98-gray sm:max-h-[calc(100dvh-70px)] sm:p-1.5 xs:max-h-[calc(100dvh-65px)] xs:p-1">
          
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

          <div className="flex gap-2 flex-wrap shrink-0 sm:flex-col sm:gap-1.5 xs:gap-1">
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
        </div>

          <div className="bg-win98-gray border-t border-win98-dark-gray px-1 py-0.5 flex justify-between text-[11px] h-[22px] items-center sm:text-[10px] sm:px-0.5 sm:py-0.5 sm:flex-wrap sm:min-h-0 sm:h-auto sm:shrink-0 xs:text-[9px] xs:px-0.5 xs:py-0.5">
          <div className="flex items-center sm:w-full sm:justify-between sm:m-0.5">
            <span>Pronto</span>
          </div>
          <div className="flex items-center sm:w-full sm:justify-between sm:m-0.5">
            <span>Sala: {roomCode || 'Nenhuma'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
