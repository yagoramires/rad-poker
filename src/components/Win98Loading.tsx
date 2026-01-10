import { useEffect, useState } from 'react'

interface Win98LoadingProps {
  message?: string
}

export function Win98Loading({ message = 'Carregando...' }: Win98LoadingProps) {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-win98-gray border-2 border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray shadow-win98 min-w-[250px] window-maximize">
        <div className="bg-linear-to-r from-win98-blue to-win98-light-blue text-white px-1 py-0.5 flex items-center text-[11px] font-bold h-[18px]">
          <span className="text-sm mr-1">⏳</span>
          <span>Por favor, aguarde...</span>
        </div>
        <div className="p-4 flex flex-col items-center gap-3">
          <div className="w-full bg-win98-white border-2 border-win98-dark-gray border-r-win98-white border-b-win98-white h-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-win98-blue animate-loading-bar"></div>
          </div>
          <div className="text-[11px] text-center font-bold">
            {message}{dots}
          </div>
        </div>
      </div>
    </div>
  )
}
