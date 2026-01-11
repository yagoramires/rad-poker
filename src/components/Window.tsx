import { WindowHeader } from './WindowHeader'
import { WindowFooter } from './WindowFooter'
import type { ReactNode } from 'react'

interface WindowProps {
  title: string
  icon?: string
  onTitleClick?: () => void
  titleHint?: string
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
  footerLeft?: ReactNode
  footerRight?: ReactNode
  children: ReactNode
  className?: string
  maxWidth?: string
}

export function Window({
  title,
  icon,
  onTitleClick,
  titleHint,
  onClose,
  onMinimize,
  onMaximize,
  footerLeft,
  footerRight,
  children,
  className = '',
  maxWidth = 'max-w-[500px]'
}: WindowProps) {
  return (
    <div className="flex justify-center items-start w-full p-5 bg-transparent box-border sm:p-2.5 sm:pb-[30px]  xs:p-1.5 xs:pb-6 xs:pt-12">
      <div className={`bg-win98-gray border-2 border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray shadow-win98 min-w-[320px] ${maxWidth} w-full max-h-[calc(90vh)] flex flex-col overflow-hidden sm:max-h-[calc(100dvh-30px)] xs:max-h-[calc(100dvh-25px)] window-maximize relative z-1 ${className}`}>
        <WindowHeader
          title={title}
          icon={icon}
          onTitleClick={onTitleClick}
          titleHint={titleHint}
          onClose={onClose}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
        />
        <div className="bg-win98-gray p-2 border border-win98-dark-gray border-r-win98-white border-b-win98-white m-0.5 overflow-x-hidden overflow-y-auto flex-1 min-h-0 max-h-[calc(100dvh-80px)] scrollbar-thin scrollbar-thumb-win98-dark-gray scrollbar-track-win98-gray sm:max-h-[calc(100dvh-70px)] sm:p-1.5 xs:max-h-[calc(100dvh-65px)] xs:p-1">
          {children}
        </div>
        {(footerLeft || footerRight) && (
          <WindowFooter leftContent={footerLeft} rightContent={footerRight} />
        )}
      </div>
    </div>
  )
}
