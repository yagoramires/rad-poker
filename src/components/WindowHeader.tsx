
import type { ReactNode } from 'react'

interface WindowHeaderProps {
  title: string
  icon?: string
  onTitleClick?: () => void
  titleHint?: string
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
  showControls?: boolean
  headerActions?: ReactNode
}

export function WindowHeader({
  title,
  icon = '🎴',
  onTitleClick,
  titleHint,
  onClose,
  onMinimize,
  onMaximize,
  showControls = true,
  headerActions
}: WindowHeaderProps) {
  return (
    <div className="bg-linear-to-r from-win98-blue to-win98-light-blue text-white px-1 py-0.5 flex justify-between items-center text-[11px] font-bold h-[18px] min-h-[18px] sm:text-[10px] sm:px-0.5 sm:py-0.5 sm:shrink-0 xs:text-[9px] xs:h-4 xs:min-h-4">
      <div 
        className={`flex items-center gap-1 sm:gap-0.5 sm:overflow-hidden ${onTitleClick ? 'cursor-pointer select-none' : ''}`}
        onClick={onTitleClick}
        title={titleHint}
      >
        <span className="text-sm sm:text-xs">{icon}</span>
        <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0 flex items-center" title={title}>
          <span className="overflow-hidden text-ellipsis whitespace-nowrap sm:text-[0.9em] xs:text-[0.8em]">{title}</span>
        </span>
      </div>
      <div className="flex items-center gap-1">
        {headerActions}
        {showControls && (
          <div className="flex gap-0.5">
            {onMinimize && (
              <button 
                className="bg-win98-gray border border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray w-4 h-3.5 text-[10px] cursor-pointer flex items-center justify-center p-0 leading-none active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white xs:w-3.5 xs:h-3 xs:text-[9px] hover:bg-win98-light-gray"
                onClick={onMinimize}
                title="Minimizar"
              >_</button>
            )}
            {onMaximize && (
              <button 
                className="bg-win98-gray border border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray w-4 h-3.5 text-[10px] cursor-pointer flex items-center justify-center p-0 leading-none active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white xs:w-3.5 xs:h-3 xs:text-[9px] hover:bg-win98-light-gray"
                onClick={onMaximize}
                title="Maximizar"
              >□</button>
            )}
            {onClose && (
              <button 
                className="bg-win98-gray border border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray w-4 h-3.5 text-[10px] cursor-pointer flex items-center justify-center p-0 leading-none active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white xs:w-3.5 xs:h-3 xs:text-[9px] hover:bg-red-500" 
                onClick={onClose}
                title="Fechar"
              >×</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
