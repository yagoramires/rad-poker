import { ReactNode } from 'react'

interface WindowFooterProps {
  leftContent?: ReactNode
  rightContent?: ReactNode
}

export function WindowFooter({ leftContent, rightContent }: WindowFooterProps) {
  return (
    <div className="bg-win98-gray border-t border-win98-dark-gray px-1 py-0.5 flex justify-between text-[11px] h-[22px] items-center sm:text-[10px] sm:px-0.5 sm:py-0.5 sm:flex-wrap sm:min-h-0 sm:h-auto sm:shrink-0 xs:text-[9px] xs:px-0.5 xs:py-0.5">
      {leftContent && (
        <div className="flex items-center sm:w-full sm:justify-between sm:m-0.5">
          {leftContent}
        </div>
      )}
      {rightContent && (
        <div className="flex items-center sm:w-full sm:justify-between sm:m-0.5">
          {rightContent}
        </div>
      )}
    </div>
  )
}
