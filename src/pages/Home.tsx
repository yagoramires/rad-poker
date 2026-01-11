import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Window } from '../components/Window'
import { ConnectionForm } from '../components/ConnectionForm'
import type { PlayerRole } from '../types/poker'

function Home() {
  const [roomCode, setRoomCode] = useState('')
  const [logoClicks, setLogoClicks] = useState(0)
  const navigate = useNavigate()

  const handleConnect = (code: string, playerName: string, playerRole: PlayerRole) => {
    navigate(`/poker?room=${code}${playerName ? `&name=${encodeURIComponent(playerName)}` : ''}${playerRole ? `&role=${playerRole}` : ''}`)
  }

  const handleCreateRoom = (playerName: string, playerRole: PlayerRole) => {
    const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomCode(newRoomCode)
    navigate(`/poker?room=${newRoomCode}${playerName ? `&name=${encodeURIComponent(playerName)}` : ''}${playerRole ? `&role=${playerRole}` : ''}`)
  }

  const handleLogoClick = () => {
    setLogoClicks(prev => prev + 1)
    if (logoClicks >= 9) {
      alert('🎉 Você encontrou o Easter Egg secreto! Você é persistente! 🏆\n\nDica: Experimente o código Konami no menu Iniciar...')
      setLogoClicks(0)
    }
  }

  return (
    <Window
      title="Scrum Poker - Conectar à Sala"
      icon="🎴"
      onTitleClick={handleLogoClick}
      titleHint="Clique aqui 10 vezes... 🤫"
      maxWidth="max-w-[500px]"
      footerLeft={<span>Pronto</span>}
      footerRight={<span>Sala: {roomCode || 'Nenhuma'}</span>}
    >
      <ConnectionForm onConnect={handleConnect} onCreateRoom={handleCreateRoom} />
    </Window>
  )
}

export default Home
