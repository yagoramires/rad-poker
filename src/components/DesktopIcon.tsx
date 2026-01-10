import { useState } from 'react'

interface DesktopIconProps {
  icon: string
  label: string
  onClick?: () => void
  position?: { x: number; y: number }
}

export function DesktopIcon({ icon, label, onClick, position }: DesktopIconProps) {
  const [isSelected, setIsSelected] = useState(false)

  const handleClick = () => {
    setIsSelected(true)
    setTimeout(() => setIsSelected(false), 300)
    onClick?.()
  }

  return (
    <div
      className={`flex flex-col items-center justify-center p-2 cursor-pointer select-none max-w-[80px] ${
        isSelected ? 'bg-win98-blue bg-opacity-50' : ''
      }`}
      onClick={handleClick}
      onDoubleClick={onClick}
      style={position ? { position: 'absolute', left: position.x, top: position.y } : {}}
    >
      <div className="text-4xl mb-1 filter drop-shadow-lg sm:text-3xl xs:text-2xl">
        {icon}
      </div>
      <div className="text-white text-[11px] text-center font-bold text-shadow-sm leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] sm:text-[10px] xs:text-[9px]">
        {label}
      </div>
    </div>
  )
}
