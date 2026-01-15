interface ActionButtonsProps {
  canReveal: boolean
  votesRevealed: boolean
  hasVote: boolean
  onReveal: () => void
  onClear: () => void
  onReset: () => void
  isHost?: boolean
}

export function ActionButtons({
  canReveal,
  votesRevealed,
  hasVote,
  onReveal,
  onClear,
  onReset,
  isHost = false
}: ActionButtonsProps) {
  const canRevealAsHost = canReveal && isHost

  return (
    <>
      <div className="h-0.5 bg-win98-dark-gray border-t border-win98-white my-2 shrink-0 sm:my-1.5 xs:my-1"></div>
      <div className="flex gap-2 flex-wrap shrink-0 flex-col md:flex-row sm:gap-1.5 xs:gap-1">
        <button 
          className="bg-win98-gray border-2 border-win98-black border-r-win98-white border-b-win98-white px-3 py-1 text-[11px] font-bold cursor-pointer min-w-[75px] h-[23px] relative active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white active:translate-x-px active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:border-win98-white disabled:active:border-r-win98-dark-gray disabled:active:border-b-win98-dark-gray sm:text-[10px] sm:px-2.5 sm:py-0.5 sm:h-[21px] sm:w-full sm:min-w-0 xs:text-[9px] xs:px-2 xs:py-0.5 xs:h-5 hover:bg-win98-light-gray transition-colors flex-1 touch-friendly"
          onClick={onReveal}
          disabled={!canRevealAsHost}
          title={!isHost ? 'Apenas o host da sala pode revelar estimativas' : !canReveal ? 'Vote primeiro ou aguarde revelação' : 'Mostrar todas as estimativas'}
        >
          🎭 Revelar Estimativas
        </button>
        <button 
          className="bg-win98-gray border-2 border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray px-3 py-1 text-[11px] font-bold cursor-pointer min-w-[75px] h-[23px] relative active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white active:translate-x-px active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:border-win98-white disabled:active:border-r-win98-dark-gray disabled:active:border-b-win98-dark-gray sm:text-[10px] sm:px-2.5 sm:py-0.5 sm:h-[21px] sm:w-full sm:min-w-0 xs:text-[9px] xs:px-2 xs:py-0.5 xs:h-5 hover:bg-win98-light-gray transition-colors flex-1 touch-friendly"
          onClick={onClear}
          disabled={votesRevealed || !hasVote}
          title="Limpar seu voto atual"
        >
          🗑️ Limpar Seleção
        </button>
        <button 
          className="bg-win98-gray border-2 border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray px-3 py-1 text-[11px] font-bold cursor-pointer min-w-[75px] h-[23px] relative active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white active:translate-x-px active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:border-win98-white disabled:active:border-r-win98-dark-gray disabled:active:border-b-win98-dark-gray sm:text-[10px] sm:px-2.5 sm:py-0.5 sm:h-[21px] sm:w-full sm:min-w-0 xs:text-[9px] xs:px-2 xs:py-0.5 xs:h-5 hover:bg-win98-light-gray transition-colors flex-1 touch-friendly"
          onClick={onReset}
          disabled={!votesRevealed || !isHost}
          title={!isHost ? 'Apenas o host da sala pode iniciar nova rodada' : !votesRevealed ? 'Revele as estimativas primeiro' : 'Começar nova rodada de votação'}
        >
          🔄 Nova Rodada
        </button>
      </div>
    </>
  )
}
