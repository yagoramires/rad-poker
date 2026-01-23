interface RoomInfoProps {
  roomCode: string
  isConnected: boolean
  playerName: string
  onCopyRoomCode: () => void
  onEditPlayer: () => void
}

export function RoomInfo({ roomCode, isConnected, playerName, onCopyRoomCode, onEditPlayer }: RoomInfoProps) {
  return (
    <div className="shrink-0 p-2">
      <div className="text-[11px] font-bold text-black flex gap-2 items-center justify-between xs:text-[9px]">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="flex items-center gap-1">
            Sala: <span className="font-mono bg-win98-white p-0.5 px-2 border border-win98-dark-gray">{roomCode}</span>
            {isConnected ? <span className="animate-pulse-slow">🟢</span> : '🔴'}
          </span>
          <button
            onClick={onCopyRoomCode}
            className="border p-0.5 border-win98-dark-gray border-r-win98-white border-b-win98-white cursor-pointer"
            title="Copiar link da sala"
          >
            📋 Copiar
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap bg-win98-light-blue text-white px-2 py-0.5 rounded-sm text-[10px]">👤 {playerName}</span>
          <button
            onClick={onEditPlayer}
            className="border p-0.5 border-win98-dark-gray border-r-win98-white border-b-win98-white cursor-pointer text-[10px] hover:bg-win98-light-gray transition-colors"
            title="Editar nome e função"
          >
            ✏️
          </button>
        </div>
      </div>
    </div>
  )
}
