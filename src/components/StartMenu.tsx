import { useState, useRef, useEffect } from 'react'

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  onShowAbout: () => void
  onShowHelp: () => void
  onShowClippy: () => void
}

export function StartMenu({ isOpen, onClose, onShowAbout, onShowHelp, onShowClippy }: StartMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [konami, setKonami] = useState<string[]>([])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const newKonami = [...konami, e.key]
      if (newKonami.length > konamiCode.length) {
        newKonami.shift()
      }
      setKonami(newKonami)
      
      if (JSON.stringify(newKonami) === JSON.stringify(konamiCode)) {
        alert('🎮 Konami Code Ativado! Você desbloqueou... nada! Mas ganhou respeito. 🏆')
        setKonami([])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [konami])

  if (!isOpen) return null

  const menuItems = [
    { icon: '📎', label: 'Clippy Assistant', onClick: onShowClippy },
    { icon: '❓', label: 'Ajuda', onClick: onShowHelp },
    { icon: 'ℹ️', label: 'Sobre', onClick: onShowAbout },
    { divider: true },
    { icon: '⚙️', label: 'Configurações', onClick: () => alert('Configurações em breve... (ou não 😅)') },
    { divider: true },
    { icon: '🔌', label: 'Desligar', onClick: () => {
      if (confirm('Deseja realmente desligar o Scrum Poker 98™?')) {
        window.close()
      }
    }}
  ]

  return (
    <div
      ref={menuRef}
      className="fixed bottom-[30px] left-0 z-9998 bg-win98-gray border-2 border-win98-white border-r-win98-dark-gray border-t-win98-white shadow-win98 w-[200px] animate-slide-in sm:bottom-[25px] sm:w-[180px]"
      style={{ animationName: 'slideInUp', animationDuration: '0.2s' }}
    >
      <div className="flex">
        <div className="w-[25px] bg-linear-to-b from-win98-blue to-win98-light-blue flex items-end justify-center py-2 sm:w-[22px]">
          <div className="text-white font-bold text-xs transform -rotate-90 whitespace-nowrap origin-center sm:text-[10px]">
            Poker <span className="text-[10px] sm:text-[8px]">98</span>
          </div>
        </div>
        <div className="flex-1">
          {menuItems.map((item, index) => (
            item.divider ? (
              <div key={index} className="h-px bg-win98-dark-gray mx-1 my-1"></div>
            ) : (
              <button
                key={index}
                onClick={() => {
                  item.onClick?.()
                  onClose()
                }}
                className="w-full text-left px-3 py-1.5 text-[11px] flex items-center gap-2 hover:bg-win98-blue hover:text-white transition-colors sm:px-2 sm:py-1 sm:text-[10px] xs:text-[9px]"
              >
                <span className="text-base sm:text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          ))}
        </div>
      </div>
    </div>
  )
}

const style = document.createElement('style')
style.textContent = `
  @keyframes slideInUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`
document.head.appendChild(style)
