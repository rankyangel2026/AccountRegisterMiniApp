import { ArrowRight, BadgeCheck, KeyRound, MessageSquareText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppButton } from '@/components/AppButton'
import { MiniAppShell } from '@/components/MiniAppShell'
import { useMainButton } from '@/hooks/useMainButton'
import { useI18n, type TranslationKey } from '@/i18n'
import { triggerHaptic } from '@/utils/telegram'

export default function WelcomePage() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const steps = [
    {
      title: 'welcome.stepAccountTitle',
      description: 'welcome.stepAccountDescription',
      icon: KeyRound,
    },
    {
      title: 'welcome.stepOtpTitle',
      description: 'welcome.stepOtpDescription',
      icon: MessageSquareText,
    },
    {
      title: 'welcome.stepResultTitle',
      description: 'welcome.stepResultDescription',
      icon: BadgeCheck,
    },
  ] satisfies Array<{
    title: TranslationKey
    description: TranslationKey
    icon: typeof KeyRound
  }>

  const handleStart = () => {
    triggerHaptic('light')
    navigate('/submit')
  }

  useMainButton({
    text: t('welcome.start'),
    visible: true,
    onClick: handleStart,
  })

  return (
    <MiniAppShell
      title={t('welcome.title')}
      label={t('welcome.label')}
      footer={
        <AppButton
          onClick={handleStart}
          className="min-h-16 rounded-3xl text-base shadow-[0_16px_34px_rgba(14,165,233,0.28)] active:translate-y-px"
        >
          {t('welcome.start')}
          <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white/20">
            <ArrowRight className="h-5 w-5" />
          </span>
        </AppButton>
      }
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="font-display text-[2rem] font-extrabold leading-tight text-slate-950 dark:text-white">
            {t('welcome.heading')}
          </h2>
          <p className="max-w-[20rem] text-sm leading-6 text-slate-600 dark:text-slate-300">
            {t('welcome.description')}
          </p>
        </div>

        <div className="grid gap-3">
          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <div
                key={step.title}
                className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {index + 1}. {t(step.title)}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-300">{t(step.description)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </MiniAppShell>
  )
}
