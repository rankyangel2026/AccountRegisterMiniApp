import { Eye, EyeOff, KeyRound, UserRound, ChevronDown } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppButton } from '@/components/AppButton'
import { FormField } from '@/components/FormField'
import { MiniAppShell } from '@/components/MiniAppShell'
import { ACCOUNT_PATTERN, PIN_PATTERN, CHANNELS, useFlowStore } from '@/hooks/useFlowStore'
import type { Channel } from '@/hooks/useFlowStore'
import { useMainButton } from '@/hooks/useMainButton'
import { useI18n } from '@/i18n'
import { enableClosingConfirmation, disableClosingConfirmation, triggerHaptic } from '@/utils/telegram'

export default function SubmitPage() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const {
    channel,
    account,
    pin,
    pinVisible,
    sessionId,
    submittingStep,
    setChannel,
    setAccount,
    setPin,
    togglePinVisibility,
    submitAccountStep,
  } = useFlowStore((state) => state)

  const canSubmit = !!channel && ACCOUNT_PATTERN.test(account) && PIN_PATTERN.test(pin) && submittingStep !== 'account'

  const handleSubmit = async () => {
    const success = await submitAccountStep()

    if (success) {
      triggerHaptic('success')
      navigate('/otp')
    } else {
      triggerHaptic('warning')
    }
  }

  useMainButton({
    text: t('submit.mainButton'),
    visible: canSubmit,
    disabled: !canSubmit,
    loading: submittingStep === 'account',
    onClick: handleSubmit,
  })

  useEffect(() => {
    if (sessionId) {
      navigate('/otp', { replace: true })
      return
    }

    enableClosingConfirmation()
    return () => disableClosingConfirmation()
  }, [sessionId, navigate])

  return (
    <MiniAppShell
      title={t('submit.title')}
      label={t('submit.label')}
      showBack
      onBack={() => navigate('/')}
      footer={
        <AppButton
          loading={submittingStep === 'account'}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {t('submit.mainButton')}
        </AppButton>
      }
    >
      <div className="space-y-8">
        <div className="space-y-3">
          <h2 className="font-display text-[1.9rem] font-extrabold leading-none tracking-[-0.05em] text-slate-950 dark:text-white">
            {t('submit.heading')}
          </h2>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            {t('submit.description')}
          </p>
        </div>

        <div className="grid gap-4">
          <FormField label={t('submit.channelLabel')}>
            <div className="relative flex min-h-14 items-center rounded-3xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100 dark:border-white/10 dark:bg-white/5 dark:focus-within:ring-sky-500/15">
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as Channel | '')}
                className="w-full appearance-none bg-transparent text-base text-slate-900 outline-none dark:text-white [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-white"
              >
                <option value="" disabled>
                  {t('submit.channelPlaceholder')}
                </option>
                {CHANNELS.map((ch) => (
                  <option key={ch} value={ch}>
                    {ch.charAt(0).toUpperCase() + ch.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 h-5 w-5 text-slate-400" />
            </div>
          </FormField>

          <FormField label={t('submit.accountLabel')} hint={t('submit.accountHint')}>
            <div className="flex min-h-14 items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100 dark:border-white/10 dark:bg-white/5 dark:focus-within:ring-sky-500/15">
              <UserRound className="h-5 w-5 text-slate-400" />
              <input
                value={account}
                onChange={(event) => setAccount(event.target.value)}
                className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                placeholder={t('submit.accountPlaceholder')}
                inputMode="numeric"
                autoComplete="username"
                maxLength={11}
              />
            </div>
          </FormField>

          <FormField label={t('submit.pinLabel')} hint={t('submit.pinHint')}>
            <div className="flex min-h-14 items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100 dark:border-white/10 dark:bg-white/5 dark:focus-within:ring-sky-500/15">
              <KeyRound className="h-5 w-5 text-slate-400" />
              <input
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                placeholder={t('submit.pinPlaceholder')}
                inputMode="numeric"
                maxLength={6}
                type={pinVisible ? 'text' : 'password'}
              />
              <button
                type="button"
                onClick={togglePinVisibility}
                className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-sky-50 hover:text-sky-600 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-sky-500/10 dark:hover:text-sky-200"
                aria-label={t('submit.togglePinAria')}
              >
                {pinVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormField>
        </div>
      </div>
    </MiniAppShell>
  )
}