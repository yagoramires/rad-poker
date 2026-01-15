import type { ReactNode } from 'react'

interface WindowFooterProps {
  leftContent?: ReactNode
  rightContent?: ReactNode
}

export function WindowFooter({ leftContent, rightContent }: WindowFooterProps) {
  return (
    <div className="hidden md:flex bg-win98-gray border-t border-win98-dark-gray px-1 py-0.5 justify-between text-[11px] h-[22px] items-center">
      {leftContent && (
        <div className="flex items-center">
          {leftContent}
        </div>
      )}
      {rightContent && (
        <div className="flex items-center">
          {rightContent}
        </div>
      )}
    </div>
  )
}
