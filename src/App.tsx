import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Poker from './pages/Poker'
import { Clippy } from './components/Clippy'
import { StartMenu } from './components/StartMenu'
import { AboutDialog, HelpDialog } from './components/Dialog'
import { DesktopIcon } from './components/DesktopIcon'
import { ThemeSelector } from './components/ThemeSelector'

function TaskbarClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-win98-gray border-l border-win98-dark-gray px-2 py-0.5 text-[11px] font-bold min-w-[70px] text-center sm:text-[10px] sm:min-w-[60px] sm:px-1 xs:text-[9px] xs:min-w-[50px]">
      <div>{time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  )
}

function AppContent() {
  const location = useLocation()
  const [showClippy, setShowClippy] = useState(false)
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const timer = setTimeout(() => {
      const random = Math.random()
      if (random > 0.7) {
        setShowClippy(true)
      }
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1)
    if (clickCount >= 4) {
      setShowClippy(true)
      setClickCount(0)
    }
  }

  return (
    <div className="min-h-dvh bg-transparent pb-[30px] w-full overflow-x-hidden sm:pb-[25px] relative">
      <ThemeSelector />
      
      {isHomePage && (
        <div className="fixed top-4 left-4 z-10 flex flex-col gap-4 sm:top-2 sm:left-2 sm:gap-3 xs:hidden">
          <DesktopIcon 
            icon="🎴" 
            label="Scrum Poker"
            onClick={() => {}}
          />
          <DesktopIcon 
            icon="📎" 
            label="Clippy"
            onClick={() => setShowClippy(true)}
          />
          <DesktopIcon 
            icon="❓" 
            label="Ajuda"
            onClick={() => setShowHelp(true)}
          />
        </div>
      )}

      {showClippy && <Clippy onClose={() => setShowClippy(false)} />}

      <nav className="fixed bottom-0 left-0 right-0 bg-win98-gray border-t-2 border-win98-white flex items-stretch z-9997 h-[30px] sm:h-[25px]">
        <button
          onClick={() => setShowStartMenu(!showStartMenu)}
          className={`bg-win98-gray border border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray px-2 py-1 text-[11px] font-bold cursor-pointer flex items-center gap-1 hover:bg-win98-light-gray sm:px-1.5 sm:text-[10px] sm:gap-0.5 xs:text-[9px] ${
            showStartMenu ? 'border-win98-dark-gray border-r-win98-white border-b-win98-white' : ''
          }`}
        >
          <span className="text-base sm:text-sm xs:text-xs">🪟</span>
          <span className="hidden sm:inline">Iniciar</span>
        </button>

        <div className="h-[2px] w-[2px] bg-win98-dark-gray mx-0.5 self-center"></div>

        <div className="flex gap-0.5 flex-1 items-center overflow-x-auto scrollbar-thin px-0.5">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `bg-win98-gray border border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray px-2 py-1 text-black text-[11px] font-bold cursor-pointer inline-flex items-center gap-1 hover:bg-win98-light-gray whitespace-nowrap sm:px-1.5 sm:text-[10px] sm:gap-0.5 xs:text-[9px] xs:px-1 ${
                isActive 
                  ? 'bg-win98-light-gray border-win98-dark-gray border-r-win98-white border-b-win98-white' 
                  : ''
              }`
            }
          >
            <span>🎴</span>
            <span className="sm:hidden">Scrum Poker</span>
          </NavLink>
        </div>

        <TaskbarClock />
      </nav>

      <StartMenu 
        isOpen={showStartMenu} 
        onClose={() => setShowStartMenu(false)}
        onShowAbout={() => setShowAbout(true)}
        onShowHelp={() => setShowHelp(true)}
        onShowClippy={() => setShowClippy(true)}
      />

      <AboutDialog isOpen={showAbout} onClose={() => setShowAbout(false)} />
      <HelpDialog isOpen={showHelp} onClose={() => setShowHelp(false)} />

      <div onClick={handleLogoClick}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/poker" element={<Poker />} />
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
