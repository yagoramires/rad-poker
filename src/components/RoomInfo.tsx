interface RoomInfoProps {
  roomCode: string
  isConnected: boolean
  playerName: string
  onCopyRoomCode: () => void
}

export function RoomInfo({ roomCode, isConnected, playerName, onCopyRoomCode }: RoomInfoProps) {
  return (
    <div className="mb-4 shrink-0 sm:mb-3 xs:mb-2.5">
      <div className="text-[11px] font-bold mb-2 text-black flex flex-wrap gap-2 items-center sm:flex-col sm:items-start sm:gap-1 xs:text-[9px]">
        <div className="flex items-center gap-1.5 whitespace-nowrap flex-wrap">
          <span className="flex items-center gap-1">
            Sala: <span className="font-mono bg-win98-white p-0.5 px-2 border border-win98-dark-gray">{roomCode}</span>
            {isConnected ? <span className="animate-pulse-slow">🟢</span> : '🔴'}
          </span>
          <button
            onClick={onCopyRoomCode}
            className="border p-0.5 border-win98-dark-gray border-r-win98-white border-b-win98-white cursor-pointer"
            title="Copiar código da sala"
          >
            📋 Copiar
          </button>
        </div>
        <span className="whitespace-nowrap bg-win98-light-blue text-white px-2 py-0.5 rounded-sm text-[10px]">👤 {playerName}</span>
      </div>
    </div>
  )
}
