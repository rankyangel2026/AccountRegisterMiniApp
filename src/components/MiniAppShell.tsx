import { type ReactNode, useCallback, useEffect } from 'react'
import { ArrowLeft, Languages } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFlowStore } from '@/hooks/useFlowStore'
import { useI18n } from '@/i18n'
import { getBackButton } from '@/utils/telegram'

type MiniAppShellProps = {
  title: string
  label: string
  showBack?: boolean
  onBack?: () => void
  footer?: ReactNode
  children: ReactNode
}

function Toast() {
  const toast = useFlowStore((state) => state.toast)
  const clearToast = useFlowStore((state) => state.clearToast)

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timer = window.setTimeout(() => clearToast(), 2200)
    return () => window.clearTimeout(timer)
  }, [toast, clearToast])

  return (
    <div
      className={cn(
        'pointer-events-none fixed top-6 left-1/2 z-50 w-[min(92vw,24rem)] -translate-x-1/2 rounded-2xl border border-white/15 bg-slate-950/90 px-4 py-3 text-sm text-white shadow-2xl shadow-slate-950/40 transition-all duration-200',
        toast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0',
      )}
      role="status"
      aria-live="polite"
    >
      {toast}
    </div>
  )
}

export function MiniAppShell({ title, label, showBack, onBack, footer, children }: MiniAppShellProps) {
  const { t, toggleLocale } = useI18n()

  const handleBack = useCallback(() => {
    onBack?.()
  }, [onBack])

  useEffect(() => {
    const backButton = getBackButton()
    if (!backButton) {
      return
    }

    if (showBack && onBack) {
      backButton.show()
      backButton.onClick(handleBack)
    } else {
      backButton.hide()
      backButton.offClick(handleBack)
    }

    return () => {
      backButton.offClick(handleBack)
      backButton.hide()
    }
  }, [showBack, onBack, handleBack])

  return (
    <main className="h-dvh overflow-hidden bg-white px-5 pb-6 pt-4 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="flex items-center justify-between gap-3 pb-4">
        <button
          type="button"
          onClick={onBack}
          aria-label={t('common.backAria')}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:border-sky-400',
            showBack ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">{title}</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
            {label}
          </p>
        </div>
        <button
          type="button"
          onClick={toggleLocale}
          aria-label={t('common.languageToggleAria')}
          className="flex h-10 min-w-10 items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:border-sky-400"
        >
          <Languages className="h-4 w-4" />
          <span>{t('common.languageSwitchText')}</span>
        </button>
      </div>

      <div className="flex min-h-[calc(100dvh-5rem)] flex-col justify-between gap-4 overflow-y-auto">
        <div className="animate-enter">{children}</div>
        {footer ? <div className="grid gap-3 pb-2">{footer}</div> : null}
      </div>

      <Toast />
    </main>
  )
}