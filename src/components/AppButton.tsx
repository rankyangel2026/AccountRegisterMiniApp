import { type ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type AppButtonProps = {
  variant?: 'primary' | 'secondary'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  children: ReactNode
  type?: 'button' | 'submit'
}

export function AppButton({
  variant = 'primary',
  loading,
  disabled,
  onClick,
  children,
  type = 'button',
}: AppButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border text-sm font-semibold tracking-[0.01em] transition duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary'
          ? 'border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-500/25 hover:border-sky-400 hover:bg-sky-400'
          : 'border-slate-200 bg-white text-slate-800 hover:border-sky-200 hover:text-sky-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:border-sky-500 dark:hover:text-sky-300',
      )}
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
      <span>{children}</span>
    </button>
  )
}
