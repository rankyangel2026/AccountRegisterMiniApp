import { type ReactNode } from 'react'

type FormFieldProps = {
  label: string
  hint?: string
  children: ReactNode
}

export function FormField({ label, hint, children }: FormFieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold tracking-[0.01em] text-slate-700 dark:text-slate-200">{label}</span>
      {children}
      {hint ? <span className="text-xs leading-5 text-slate-500 dark:text-slate-400">{hint}</span> : null}
    </label>
  )
}
