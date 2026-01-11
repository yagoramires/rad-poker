import type { ReactNode } from "react"

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  icon?: string
  children: ReactNode
  width?: string
}

export function Dialog({ isOpen, onClose, title, icon, children, width = 'max-w-[400px]' }: DialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black bg-opacity-30">
      <div className={`bg-win98-gray border-2 border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray shadow-win98 w-full ${width} window-maximize`}>
        <div className="bg-linear-to-r from-win98-blue to-win98-light-blue text-white px-1 py-0.5 flex justify-between items-center text-[11px] font-bold h-[18px] cursor-move">
          <div className="flex items-center gap-1">
            {icon && <span className="text-sm">{icon}</span>}
            <span>{title}</span>
          </div>
          <button
            onClick={onClose}
            className="bg-win98-gray border border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray w-4 h-3.5 text-[10px] cursor-pointer flex items-center justify-center p-0 leading-none hover:bg-red-500 active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white"
          >
            ×
          </button>
        </div>
        <div className="p-3 sm:p-2">
          {children}
        </div>
        <div className="border-t border-win98-dark-gray p-2 flex justify-end">
          <button
            onClick={onClose}
            className="bg-win98-gray border-2 border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray px-4 py-1 text-[11px] font-bold cursor-pointer min-w-[75px] active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white active:translate-x-px active:translate-y-px sm:px-3 sm:text-[10px]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

export function AboutDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Sobre o Scrum Poker 98™" icon="ℹ️">
      <div className="bg-win98-white border-2 border-win98-dark-gray p-3 text-[11px] leading-relaxed">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-5xl">🎴</div>
          <div>
            <div className="font-bold text-base mb-1">Scrum Poker 98™</div>
            <div className="text-[10px]">Versão 1.98.2026</div>
          </div>
        </div>
        <div className="border-t border-win98-dark-gray pt-2 space-y-2">
          <p>
            <strong>Planning Poker</strong> para equipes ágeis com estética retrô!
          </p>
          <p className="text-[10px]">
            © 2026 Rad Poker Corporation.<br/>
            Todos os direitos reservados... ou não.
          </p>
          <p className="text-[9px] text-win98-dark-gray italic">
            "Se você lembra do Windows 98, você provavelmente precisa de férias." 😄
          </p>
        </div>
      </div>
    </Dialog>
  )
}

export function HelpDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Ajuda - Como usar" icon="❓" width="max-w-[500px]">
      <div className="bg-win98-white border-2 border-win98-dark-gray p-3 text-[11px] leading-relaxed max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-win98-dark-gray scrollbar-track-win98-white">
        <h3 className="font-bold mb-2 text-win98-blue">📋 Como Jogar Scrum Poker:</h3>
        <ol className="list-decimal list-inside space-y-2 mb-4">
          <li>Crie uma sala ou entre em uma existente</li>
          <li>Compartilhe o código da sala com sua equipe</li>
          <li>Cada membro escolhe uma estimativa (Fibonacci)</li>
          <li>Quando todos votarem, revele as estimativas</li>
          <li>Discuta as diferenças e vote novamente se necessário</li>
        </ol>

        <h3 className="font-bold mb-2 text-win98-blue mt-4">🎯 Dicas Profissionais:</h3>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>Use a escala Fibonacci (1, 2, 3, 5, 8, 13...)</li>
          <li>Discuta antes de votar novamente</li>
          <li>Maior divergência = mais discussão necessária</li>
          <li>Não influencie os outros antes de revelar</li>
        </ul>

        <h3 className="font-bold mb-2 text-win98-blue mt-4">🎮 Easter Eggs:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Procure por mensagens escondidas</li>
          <li>Tente o código Konami... 🎮</li>
          <li>Clique em elementos suspeitos</li>
          <li>Arraste o Clippy pela tela</li>
        </ul>

        <div className="mt-4 p-2 bg-[#ffffe1] border border-win98-dark-gray text-[10px]">
          <strong>💡 Dica:</strong> Esta aplicação funciona melhor com pelo menos 3 jogadores!
        </div>
      </div>
    </Dialog>
  )
}
