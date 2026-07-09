import { type ReactNode, useCallback, useEffect } from 'react'
import { ArrowLeft, BadgeCheck, CircleAlert, Smartphone, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFlowStore } from '@/hooks/useFlowStore'
import { useTelegramMiniApp } from '@/hooks/useTelegramMiniApp'
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
        'pointer-events-none fixed bottom-6 left-1/2 z-50 w-[min(92vw,24rem)] -translate-x-1/2 rounded-2xl border border-white/15 bg-slate-950/90 px-4 py-3 text-sm text-white shadow-2xl shadow-slate-950/40 transition-all duration-200',
        toast ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      )}
      role="status"
      aria-live="polite"
    >
      {toast}
    </div>
  )
}

export function MiniAppShell({ title, label, showBack, onBack, footer, children }: MiniAppShellProps) {
  const runtime = useTelegramMiniApp()
  const resultStatus = useFlowStore((state) => state.resultStatus)

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_22rem),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.12),transparent_20rem),linear-gradient(180deg,#eef6ff_0%,#f8fbff_48%,#eef8f6_100%)] px-4 py-6 text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_22rem),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.16),transparent_20rem),linear-gradient(180deg,#03111b_0%,#071b28_42%,#0b1a17_100%)] dark:text-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/30">
              <Smartphone className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700/80 dark:text-sky-200/80">
                Telegram Mini App
              </p>
              <h1 className="font-display text-3xl font-extrabold tracking-[-0.04em] text-slate-950 dark:text-white">
                手机卡直连上线
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                在 Telegram 内完成账号提交、OTP 校验和上线确认，桌面端保留设备预览壳层以便联调演示。
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/60 bg-white/75 px-4 py-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                <Sparkles className="h-4 w-4" />
                当前环境
              </div>
              <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                {runtime.isTelegram ? `已连接 Telegram · ${runtime.displayName}` : '浏览器预览模式'}
              </p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/75 px-4 py-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                {resultStatus === 'error' ? <CircleAlert className="h-4 w-4" /> : <BadgeCheck className="h-4 w-4" />}
                状态提示
              </div>
              <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                {resultStatus === 'error' ? '等待重新校验 OTP' : '草稿自动保存，PIN 不做持久化'}
              </p>
            </div>
          </div>
        </header>

        <section className="flex justify-center">
          <div className="phone-shell relative w-full max-w-[26rem] rounded-[2.5rem] bg-slate-950 p-2 shadow-[0_28px_90px_rgba(8,15,28,0.35)]">
            <div className="pointer-events-none absolute left-1/2 top-2 h-6 w-28 -translate-x-1/2 rounded-full bg-slate-900/95" />
            <div className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white dark:border-white/10 dark:bg-slate-950">
              <div className="flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 py-3 text-xs font-semibold text-slate-500 backdrop-blur dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300">
                <span>9:41</span>
                <span className="tracking-[0.24em]">{runtime.theme === 'dark' ? 'TG DARK' : 'TG READY'}</span>
              </div>

              <div className="border-b border-slate-200/80 bg-gradient-to-b from-sky-50 to-white px-4 py-4 dark:border-white/10 dark:from-slate-900 dark:to-slate-950">
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={onBack}
                    aria-label="返回上一步"
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
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-transparent" aria-hidden="true" />
                </div>
              </div>

              <div className="min-h-[42rem] bg-[linear-gradient(180deg,rgba(14,165,233,0.06),transparent_9rem)] px-5 pb-5 pt-6 dark:bg-[linear-gradient(180deg,rgba(56,189,248,0.08),transparent_10rem)]">
                <div className="flex min-h-[36rem] flex-col">
                  <div className="animate-enter">{children}</div>
                  {footer ? <div className="mt-auto grid gap-3 pt-8">{footer}</div> : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Toast />
    </main>
  )
}