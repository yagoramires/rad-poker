import { WindowHeader } from './WindowHeader'
import { WindowFooter } from './WindowFooter'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'

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
  headerActions?: ReactNode
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
  headerActions,
  children,
  className = '',
  maxWidth = 'max-w-[500px]'
}: WindowProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const windowRef = useRef<HTMLDivElement>(null)
  // const resizeHandleRef = useRef<HTMLDivElement>(null)
  // const [windowHeight, setWindowHeight] = useState<number | null>(() => {
  //   if (typeof window !== 'undefined') {
  //     const isDesktopQuery = window.matchMedia('(min-width: 1024px)')
  //     if (isDesktopQuery.matches) {
  //       const cachedHeight = getCachedWindowHeight()
  //       if (cachedHeight) {
  //         return cachedHeight
  //       }
  //       return Math.floor(window.innerHeight * 0.8)
  //     }
  //   }
  //   return null
  // })
  // const [isResizing, setIsResizing] = useState(false)

  // useEffect(() => {
  //   if (!isDesktop || !resizeHandleRef.current) return

  //   const handleMouseDown = (e: MouseEvent) => {
  //     e.preventDefault()
  //     setIsResizing(true)
  //   }

  //   const handleMouseMove = (e: MouseEvent) => {
  //     if (!isResizing || !windowRef.current) return

  //     const container = windowRef.current.parentElement
  //     if (!container) return

  //     const containerRect = container.getBoundingClientRect()
  //     const newHeight = e.clientY - containerRect.top
  //     const minHeight = 200
  //     const maxHeight = window.innerHeight - containerRect.top - 20

  //     const clampedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight))
  //     setWindowHeight(clampedHeight)
  //     setCachedWindowHeight(clampedHeight)
  //   }

  //   const handleMouseUp = () => {
  //     setIsResizing(false)
  //   }

  //   const resizeHandle = resizeHandleRef.current
  //   resizeHandle.addEventListener('mousedown', handleMouseDown)
  //   document.addEventListener('mousemove', handleMouseMove)
  //   document.addEventListener('mouseup', handleMouseUp)

  //   return () => {
  //     resizeHandle.removeEventListener('mousedown', handleMouseDown)
  //     document.removeEventListener('mousemove', handleMouseMove)
  //     document.removeEventListener('mouseup', handleMouseUp)
  //   }
  // }, [isDesktop, isResizing])

  const getHeightStyle = () => {
    // if (!isDesktop) {
    //   return { height: '90dvh' }
    // }
    // if (windowHeight !== null) {
    //   return { height: `${windowHeight}px` }
    // }
    return { height: '90vh' }
  }

  return (
    <div className="flex justify-center items-start w-full p-5 bg-transparent box-border sm:p-2.5 sm:pb-[30px]  xs:p-1.5 xs:pb-6 xs:pt-12">
      <div
        ref={windowRef}
        className={`bg-win98-gray border-2 border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray shadow-win98 min-w-[320px] ${maxWidth} w-full ${!isDesktop ? 'h-[80dvh]' : ''} flex flex-col overflow-hidden sm:max-h-[calc(100dvh-30px)] xs:max-h-[calc(100dvh-25px)] window-maximize relative z-1 ${className}`}
        style={getHeightStyle()}
      >
        <WindowHeader
          title={title}
          icon={icon}
          onTitleClick={onTitleClick}
          titleHint={titleHint}
          onClose={onClose}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
          headerActions={headerActions}
        />
        <div className="bg-win98-gray p-2 border border-win98-dark-gray border-r-win98-white border-b-win98-white m-0.5 overflow-hidden flex flex-col flex-1 min-h-0 scrollbar-thin scrollbar-thumb-win98-dark-gray scrollbar-track-win98-gray sm:p-1.5 xs:p-1 h-full">
          {children}
        </div>
        {(footerLeft || footerRight) && (
          <WindowFooter leftContent={footerLeft} rightContent={footerRight} />
        )}
        {/* {isDesktop && (
          <div
            ref={resizeHandleRef}
            className={`absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-win98-blue transition-colors ${isResizing ? 'bg-win98-blue' : ''}`}
            style={{ zIndex: 10 }}
          />
        )} */}
      </div>
    </div>
  )
}
