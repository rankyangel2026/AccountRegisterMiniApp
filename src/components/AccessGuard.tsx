import { useEffect, useState } from 'react'
import { ShieldOff } from 'lucide-react'
import { checkFrontendAccess } from '@/utils/telegram'
import { useI18n } from '@/i18n'
import type { TranslationKey } from '@/i18n'

type AccessState = 'checking' | 'allowed' | 'denied'

function getDenyReasonKey(reason: string): TranslationKey {
  switch (reason) {
    case 'not_telegram':
      return 'access.notTelegram'
    case 'no_chat':
      return 'access.noChat'
    case 'chat_denied':
      return 'access.chatDenied'
    default:
      return 'access.denied'
  }
}

export function AccessGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AccessState>('denied')
  const [denyReason, setDenyReason] = useState<string>('denied')
  const { t } = useI18n()

  useEffect(() => {
    if (import.meta.env.VITE_ACCESS_GUARD !== 'true') {
      setState('allowed')
      return
    }

    const result = checkFrontendAccess()

    if (result.allowed) {
      setState('allowed')
    } else {
      setState('denied')
    }

    setDenyReason(result.reason)
  }, [])

  if (state === 'checking') {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white dark:bg-slate-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" />
      </div>
    )
  }

  if (state === 'denied') {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white px-6 dark:bg-slate-950">
        <div className="grid place-items-center text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
            <ShieldOff className="h-10 w-10" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-extrabold tracking-[-0.04em] text-slate-950 dark:text-white">
            {t('access.deniedTitle')}
          </h2>
          <p className="mt-3 max-w-[18rem] text-sm leading-6 text-slate-600 dark:text-slate-300">
            {t(getDenyReasonKey(denyReason))}
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}