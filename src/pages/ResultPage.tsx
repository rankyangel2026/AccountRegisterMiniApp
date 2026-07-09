import { BadgeCheck, CircleAlert, ExternalLink, RotateCcw, X } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppButton } from '@/components/AppButton'
import { MiniAppShell } from '@/components/MiniAppShell'
import { useFlowStore } from '@/hooks/useFlowStore'
import { useI18n } from '@/i18n'
import { closeTelegramMiniApp, showConfirm, triggerHaptic } from '@/utils/telegram'

export default function ResultPage() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const { resultStatus, resultRef, errorMessage, errorMessageKey, sessionId, resetFlow } = useFlowStore((state) => state)

  useEffect(() => {
    if (!sessionId) {
      navigate('/submit', { replace: true })
    }
  }, [sessionId, navigate])

  const isSuccess = resultStatus === 'success'
  const errorText = errorMessageKey ? t(errorMessageKey) : errorMessage

  const handleClose = () => {
    showConfirm(t('result.confirmClose'), (ok) => {
      if (!ok) {
        return
      }

      const closed = closeTelegramMiniApp()

      if (!closed) {
        useFlowStore.setState({ toast: t('toast.browserCannotClose') })
      }

      triggerHaptic(isSuccess ? 'success' : 'warning')
    })
  }

  const handleRestart = () => {
    resetFlow()
    triggerHaptic('light')
    navigate('/submit')
  }

  return (
    <MiniAppShell
      title={t('result.title')}
      label={t('result.label')}
      showBack
      onBack={() => navigate('/otp')}
      footer={
        <>
          <AppButton onClick={handleClose}>
            <X className="h-4 w-4" />
            {t('result.close')}
          </AppButton>
          <AppButton variant="secondary" onClick={handleRestart}>
            <RotateCcw className="h-4 w-4" />
            {t('result.restart')}
          </AppButton>
          {!isSuccess ? (
            <AppButton variant="secondary" onClick={() => navigate('/otp')}>
              <ExternalLink className="h-4 w-4" />
              {t('result.retryOtp')}
            </AppButton>
          ) : null}
        </>
      }
    >
      <div className="grid place-items-center py-8 text-center">
        <div className="space-y-5">
          <div
            className={[
              'mx-auto flex h-24 w-24 items-center justify-center rounded-full border',
              isSuccess
                ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
                : 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300',
            ].join(' ')}
          >
            {isSuccess ? <BadgeCheck className="h-12 w-12" /> : <CircleAlert className="h-12 w-12" />}
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-[2rem] font-extrabold tracking-[-0.05em] text-slate-950 dark:text-white">
              {isSuccess ? t('result.successTitle') : t('result.errorTitle')}
            </h2>
            <p className="mx-auto max-w-[18rem] text-sm leading-6 text-slate-600 dark:text-slate-300">
              {isSuccess ? t('result.successBody') : errorText || t('result.errorFallback')}
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/80 px-5 py-4 text-left shadow-sm dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{t('result.refLabel')}</p>
            <p className="mt-2 font-mono text-base text-slate-900 dark:text-white">{resultRef || t('result.pendingRef')}</p>
          </div>
        </div>
      </div>
    </MiniAppShell>
  )
}