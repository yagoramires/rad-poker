import { useEffect } from 'react'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

export function ToastItem({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, toast.duration || 3000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return '✓'
      case 'error': return '✕'
      case 'warning': return '⚠'
      default: return 'ℹ'
    }
  }

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success': return 'border-l-[#00aa00]'
      case 'error': return 'border-l-[#aa0000]'
      case 'warning': return 'border-l-[#ffaa00]'
      default: return 'border-l-[#0080ff]'
    }
  }

  const getIconColor = () => {
    switch (toast.type) {
      case 'success': return 'text-[#00aa00]'
      case 'error': return 'text-[#aa0000]'
      case 'warning': return 'text-[#ffaa00]'
      default: return 'text-[#0080ff]'
    }
  }

  return (
    <div className={`bg-win98-gray border-2 border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray border-l-4 ${getBorderColor()} p-2 px-3 flex items-center gap-2 shadow-win98 min-w-[250px] animate-slide-in sm:min-w-0 sm:w-full`}>
      <span className={`font-bold text-sm min-w-4 ${getIconColor()}`}>{getIcon()}</span>
      <span className="flex-1 text-[11px] text-black">{toast.message}</span>
      <button className="bg-transparent border-0 cursor-pointer text-base text-black p-0 w-4 h-4 leading-none font-bold hover:text-[#aa0000]" onClick={() => onRemove(toast.id)}>×</button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="absolute top-5 right-5 z-10000">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}
