import { MessageSquareText, RotateCcw } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppButton } from '@/components/AppButton'
import { FormField } from '@/components/FormField'
import { MiniAppShell } from '@/components/MiniAppShell'
import { useFlowStore } from '@/hooks/useFlowStore'
import { useI18n } from '@/i18n'
import { enableClosingConfirmation, disableClosingConfirmation, triggerHaptic } from '@/utils/telegram'

export default function OtpPage() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const { otp, sessionId, submittingStep, setOtp, verifyOtpStep } = useFlowStore((state) => state)

  const canSubmit = /^\d{6}$/.test(otp) && submittingStep !== 'otp'

  const handleSubmitOtp = async () => {
    const success = await verifyOtpStep()

    triggerHaptic(success ? 'success' : 'error')
    navigate('/result')
  }

  const handleResendOtp = () => {
    triggerHaptic('light')
    useFlowStore.setState({ toast: t('toast.otpResent') })
  }

  useEffect(() => {
    if (!sessionId) {
      navigate('/submit', { replace: true })
      return
    }

    enableClosingConfirmation()
    return () => disableClosingConfirmation()
  }, [sessionId, navigate])

  return (
    <MiniAppShell
      title={t('otp.title')}
      label={t('otp.label')}
      showBack
      onBack={() => navigate('/submit')}
      footer={
        <>
          <AppButton
            loading={submittingStep === 'otp'}
            disabled={!canSubmit}
            onClick={handleSubmitOtp}
          >
            {t('otp.mainButton')}
          </AppButton>
          <AppButton
            variant="secondary"
            onClick={handleResendOtp}
          >
            <RotateCcw className="h-4 w-4" />
            {t('otp.resend')}
          </AppButton>
        </>
      }
    >
      <div className="space-y-8">
        <div className="space-y-3">
          <h2 className="font-display text-[1.9rem] font-extrabold leading-none tracking-[-0.05em] text-slate-950 dark:text-white">
            {t('otp.heading')}
          </h2>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            {t('otp.description')}
          </p>
        </div>

        <FormField label="OTP">
          <div className="flex min-h-14 items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100 dark:border-white/10 dark:bg-white/5 dark:focus-within:ring-sky-500/15">
            <MessageSquareText className="h-5 w-5 text-slate-400" />
            <input
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              placeholder={t('otp.placeholder')}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          </div>
        </FormField>

        <div className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50/80 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-200">{t('otp.tipTitle')}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {t('otp.tipBody')}
          </p>
        </div>
      </div>
    </MiniAppShell>
  )
}
