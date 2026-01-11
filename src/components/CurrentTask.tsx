interface CurrentTaskProps {
  task: string
}

export function CurrentTask({ task }: CurrentTaskProps) {
  return (
    <>
      <div className="h-0.5 bg-win98-dark-gray border-t border-win98-white my-2 shrink-0 sm:my-1.5 xs:my-1"></div>
      <div className="mb-4 shrink-0 sm:mb-3 xs:mb-2.5">
        <div className="text-[11px] font-bold mb-2 text-black sm:text-[10px] sm:mb-1.5 xs:text-[9px]">Tarefa Atual:</div>
        <div className="bg-win98-white border-2 border-win98-dark-gray border-r-win98-white border-b-win98-white p-2 text-[11px] sm:p-1.5 sm:text-[10px] xs:p-1 xs:text-[9px]">
          {task}
        </div>
      </div>
    </>
  )
}
