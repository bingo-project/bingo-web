// ABOUTME: Text divider component
// ABOUTME: Used between OAuth buttons and email form

interface DividerProps {
  text: string
}

export function Divider({ text }: DividerProps) {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
      <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{text}</span>
      <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
    </div>
  )
}
