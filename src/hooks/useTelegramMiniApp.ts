import { useCallback, useEffect, useState } from 'react'
import {
  getTelegramWebApp,
  initTelegramMiniApp,
  onTelegramEvent,
  offTelegramEvent,
  type TelegramTheme,
  type ThemeParams,
} from '@/utils/telegram'

type TelegramRuntime = {
  isTelegram: boolean
  theme: TelegramTheme
  displayName: string
  themeParams: ThemeParams
  version: string
  platform: string
}

const defaultRuntime: TelegramRuntime = {
  isTelegram: false,
  theme: 'light',
  displayName: '访客',
  themeParams: {},
  version: '6.0',
  platform: 'unknown',
}

export function useTelegramMiniApp() {
  const [runtime, setRuntime] = useState<TelegramRuntime>(defaultRuntime)

  const syncTheme = useCallback(() => {
    const webApp = getTelegramWebApp()
    if (!webApp) {
      return
    }

    const theme: TelegramTheme = webApp.colorScheme === 'dark' ? 'dark' : 'light'
    document.documentElement.dataset.theme = theme

    setRuntime((prev) => ({
      ...prev,
      theme,
      themeParams: webApp.themeParams ?? prev.themeParams,
    }))
  }, [])

  useEffect(() => {
    const initial = initTelegramMiniApp()
    document.documentElement.dataset.theme = initial.theme

    setRuntime(initial)

    onTelegramEvent('themeChanged', syncTheme)

    return () => {
      offTelegramEvent('themeChanged', syncTheme)
    }
  }, [syncTheme])

  return runtime
}