interface PokerCardsProps {
  cards: (string | number)[]
  selectedIndex: number | null
  votesRevealed: boolean
  onVote: (index: number) => void
  streamingMode?: boolean
}

function getVoteEmoji(vote: string | number) {
  const v = String(vote)
  if (v === '1' || v === '2') return '🟢'
  if (v === '3' || v === '5') return '🟡'
  if (v === '8' || v === '13') return '🟠'
  if (v === '21' || v === '34') return '🔴'
  if (v === '?') return '❓'
  if (v === '☕') return '☕'
  return '🎴'
}

export function PokerCards({ cards, selectedIndex, votesRevealed, onVote, streamingMode = false }: PokerCardsProps) {
  return (
    <>
      <div className="h-0.5 bg-win98-dark-gray border-t border-win98-white my-2 shrink-0 sm:my-1.5 xs:my-1"></div>
      <div className="mb-4 shrink-0 sm:mb-3 xs:mb-2.5">
        <div className="text-[11px] font-bold mb-2 text-black sm:text-[10px] sm:mb-1.5 xs:text-[9px]">
          <span className="mr-2">🎯</span>Selecione sua estimativa:
        </div>
        
        <div className="grid gap-2 mt-2 sm:gap-1.5 sm:mt-1.5 xs:gap-1 xs:mt-1 poker-cards-grid">
          {cards.map((card, index) => {
            const isSelected = selectedIndex === index && (!streamingMode || votesRevealed)
            const isDisabled = votesRevealed
            
            return (
              <button
                key={index}
                className={`bg-win98-gray border-2 cursor-pointer p-0 aspect-2/3 transition-all duration-100 relative active:translate-x-px active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 touch-friendly group ${
                  isSelected 
                    ? 'border-[#0000ff] border-r-[#0000ff] border-b-[#0000ff] bg-[#c0c0ff] shadow-[inset_2px_2px_0_#0000ff,inset_-2px_-2px_0_#8080ff] animate-bounce-in' 
                    : 'border-win98-white border-r-win98-dark-gray border-b-win98-dark-gray active:border-win98-dark-gray active:border-r-win98-white active:border-b-win98-white hover:bg-win98-light-gray'
                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !isDisabled && onVote(index)}
                disabled={isDisabled}
                title={`Estimar ${card}`}
              >
                <div className={`w-full h-full flex flex-col items-center justify-center border m-0.5 ${
                  isSelected 
                    ? 'bg-[#e0e0ff] border-[#0000ff]' 
                    : 'bg-win98-white border-win98-black'
                }`}>
                  <div className={`text-2xl font-bold sm:text-lg xs:text-base ${
                    isSelected ? 'text-[#0000ff] scale-110' : 'text-black group-hover:scale-105 transition-transform'
                  }`}>
                    {card}
                  </div>
                  {!isDisabled && !isSelected && (
                    <div className="text-[8px] text-win98-dark-gray mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {getVoteEmoji(card)}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
