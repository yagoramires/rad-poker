import { useState, useEffect } from 'react'

interface ClippyProps {
  onClose?: () => void
}

export function Clippy({ onClose }: ClippyProps) {
  const [message, setMessage] = useState('')
  const [isVisible, setIsVisible] = useState(true)
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const messages = [
    "Parece que você está fazendo Planning Poker! Posso ajudar?",
    "Dica: Convença sua equipe que todas as tasks são '13' 📈",
    "Fibonacci? Eu prefiro contador: 1, 2, 3, 4, 5... 🤓",
    "Lembra de fazer um break! Café é importante! ☕",
    "Scrum Poker: onde '3' significa '3 dias', não '3 horas' 😅",
    "Pro tip: Se está difícil estimar, é porque é complexo!",
    "Está me vendo? Clique em mim para mudar minha mensagem! 📎",
    "Windows 98 + Scrum = Nostalgia Ágil ™️",
    "Eu era útil... ou pelo menos tentava ser! 🤔",
    "Dica secreta: Konami code não funciona aqui... ou funciona? 🎮"
  ]

  useEffect(() => {
    setMessage(messages[Math.floor(Math.random() * messages.length)])
  }, [])

  const changeMessage = () => {
    const newMessage = messages[Math.floor(Math.random() * messages.length)]
    setMessage(newMessage)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) return
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose?.(), 300)
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed z-9999 ${isVisible ? 'animate-bounce-in' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="bg-win98-light-blue border-2 border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray shadow-win98 min-w-[200px] max-w-[280px] sm:max-w-[240px] xs:max-w-[200px]">
        <div className="bg-linear-to-r from-win98-blue to-win98-light-blue text-white px-1 py-0.5 flex justify-between items-center text-[11px] font-bold cursor-move">
          <span>💡 Assistente do Office</span>
          <button
            onClick={handleClose}
            className="bg-win98-gray border border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray w-4 h-3.5 text-[10px] cursor-pointer flex items-center justify-center p-0 leading-none hover:bg-red-500"
          >
            ×
          </button>
        </div>
        <div className="p-3 bg-[#ffffe1] relative">
          <div 
            className="text-6xl mb-2 animate-float cursor-pointer select-none"
            onClick={changeMessage}
            title="Clique em mim!"
          >
            📎
          </div>
          <div className="text-[11px] leading-relaxed wrap-break-word">
            {message}
          </div>
        </div>
      </div>
    </div>
  )
}
