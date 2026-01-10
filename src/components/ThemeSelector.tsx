import { useState, useEffect } from 'react'

type Theme = 'teal' | 'purple' | 'brick' | 'desert' | 'matrix'

interface ThemeConfig {
  name: string
  background: string
  emoji: string
}

const themes: Record<Theme, ThemeConfig> = {
  teal: {
    name: 'Teal Classic',
    background: '#008080',
    emoji: '🌊'
  },
  purple: {
    name: 'Purple Reign',
    background: '#663399',
    emoji: '💜'
  },
  brick: {
    name: 'Brick Red',
    background: '#800000',
    emoji: '🧱'
  },
  desert: {
    name: 'Desert Sand',
    background: '#c19a6b',
    emoji: '🏜️'
  },
  matrix: {
    name: 'Matrix Green',
    background: '#003300',
    emoji: '💚'
  }
}

export function ThemeSelector() {
  const getInitialTheme = (): Theme => {
    const saved = localStorage.getItem('poker98-theme') as Theme
    return saved && themes[saved] ? saved : 'teal'
  }

  const [currentTheme, setCurrentTheme] = useState<Theme>(getInitialTheme)
  const [isOpen, setIsOpen] = useState(false)

  const applyTheme = (theme: Theme) => {
    document.body.style.background = themes[theme].background
  }

  useEffect(() => {
    applyTheme(currentTheme)
  }, [currentTheme])

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme)
    applyTheme(theme)
    localStorage.setItem('poker98-theme', theme)
    setIsOpen(false)
  }

  return (
    <div className="fixed top-2 right-2 z-10 sm:top-1 sm:right-1 xs:top-1 xs:right-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-win98-gray border-2 border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray px-2 py-1 text-[11px] font-bold cursor-pointer active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white active:translate-x-px active:translate-y-px hover:bg-win98-light-gray transition-colors flex items-center gap-1 sm:px-1.5 sm:py-0.5 sm:text-[10px] xs:px-1 xs:py-0.5 xs:text-[9px] touch-friendly"
        title="Mudar tema do desktop"
      >
        <span className="xs:hidden">{themes[currentTheme].emoji} </span>
        <span className="xs:hidden">Tema</span>
        <span className="hidden xs:inline">{themes[currentTheme].emoji}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-5"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-1 bg-win98-gray border-2 border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray shadow-win98 min-w-[150px] animate-slide-in z-20 sm:min-w-[140px] xs:min-w-[130px]">
            <div className="bg-win98-blue text-white px-2 py-0.5 text-[10px] font-bold">
              Escolher Tema
            </div>
            <div className="p-1">
              {(Object.keys(themes) as Theme[]).map((theme) => (
                <button
                  key={theme}
                  onClick={() => handleThemeChange(theme)}
                  className={`w-full text-left px-2 py-1 text-[11px] flex items-center gap-2 hover:bg-win98-blue hover:text-white transition-colors sm:text-[10px] xs:text-[9px] touch-friendly ${
                    currentTheme === theme ? 'bg-win98-light-gray' : ''
                  }`}
                >
                  <span>{themes[theme].emoji}</span>
                  <span>{themes[theme].name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
